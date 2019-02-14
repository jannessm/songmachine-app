import { Injectable } from '@angular/core';
import { CreateOptions } from 'html-pdf';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as jiff from 'jiff';
import { dialog, app } from 'electron';
import { Song } from '../models/song';
import { Songgroup } from '../models/songgroup';
import { DATABASES } from '../models/databases';
import { FILESYSTEM } from '../models/filesystem';

@Injectable()
export class StoreService {

  fileMap = {
    songs: {},
    songgroups: {}
  };
  mainDirectory = '';

  constructor() {
  }

  // generatePdfRequest(path: string, fileName: string, htmlData: string, opts?: CreateOptions): Promise<CmResponse<PdfRequestResponse>> {
  //   return this.ConnectorFactory('pdf')
  //     .setMode(Modes.CORS)
  //     .dispatch<CmPdfRequest, CmResponse<PdfRequestResponse>>(Methods.POST,  {
  //       filePath: path,
  //       fileName: fileName,
  //       payload: htmlData,
  //       metadata: opts || {}
  //   });
  // }

  loadFile(filePath): JSON {
    try {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const p = filePath.replace(path.join(this.mainDirectory, FILESYSTEM.DATA), '').split(path.sep).slice(1);
      this.addToMap(p, this.fileMap, file);
      return file;
    } catch (err) {
      console.warn(filePath, err);
    }
    return;
  }

  loadSongFiles() {
    Object.keys(this.fileMap)
      .map((key) => {
        this.fileMap[key] = fs.readFileSync(path.join(this.mainDirectory, FILESYSTEM.DATA, key), 'utf8');
        return this.fileMap[key];
      })
      .map((value) => {
        try {
          return JSON.parse(value);
        } catch (err) { return null; }
      })
      .filter(v => !!v);
    return this;
  }

  createFileIndex(dirPath?: string) {
    if (!dirPath) {
      dirPath = this.mainDirectory;
    }

    fs.readdirSync(dirPath).forEach(entry => {
      const entryPath = path.join(dirPath, entry);
      if (fs.statSync(entryPath).isDirectory()) {
        this.createFileIndex(entryPath);
      } else if (path.extname(entryPath) === '.song' || path.extname(entryPath) === '.songgroup') {
        this.loadFile(entryPath);
      }
    });
    return this;
  }

  createFile(type: DATABASES, payload: Song|Songgroup): Promise<Song|Songgroup> {
    const promise = new Promise<Song|Songgroup>((res, rej) => {
      const suffix = this.suffix(type);

      const filePath = path.join(this.mainDirectory, FILESYSTEM.DATA, type, payload.id + suffix);
      mkdirp(path.dirname(filePath));
      fs.writeFile(filePath, JSON.stringify(payload, null, 2), err => {
        if (err) {
          rej(err);
        } else {
          this.fileMap[type][payload.id + suffix] = payload;
          res(payload);
        }
      });
    });
    return promise;
  }

  deleteFile(type: DATABASES, id: string): Promise<any> {
    return new Promise((res, rej) => {
      const suffix = this.suffix(type);
      if (type === DATABASES.songs && this.fileMap[type][id + suffix]) {
        fs.unlinkSync(path.join(this.mainDirectory, FILESYSTEM.DATA, type, id + suffix));
        delete this.fileMap.songs[id + suffix];
        res();
      } else {
        rej('No such resource');
      }
    });
  }

  updateFile(type: DATABASES, payload: Song | Songgroup): Promise<Song|Songgroup> {
    const promise = new Promise<Song|Songgroup>((res, rej) => {
      const suffix = this.suffix(payload);
      const obj = this.fileMap[type][payload.id + suffix];
      const filePath = path.join(this.mainDirectory, FILESYSTEM.DATA, type, payload.id + suffix);
      if (obj) {
        try {
          const indexedFile = obj;
          const currentFile = this.loadFile(filePath);
          const diff = jiff.diff(currentFile, indexedFile);
          if (diff.length === 0) {
            fs.writeFile(filePath, JSON.stringify(payload, null, 2), () => { res(payload); });
          } else {
            // The file has been modified without being reloaded
            rej({indexedFile, currentFile});
          }
        } catch (err) {
          rej(err);
        }
      } else {
        rej('The given resource has not been initialized');
      }
    });
    return promise;
  }

  // generateRunHttpServerRequest(
  //   htmls: string[], title: string, hostWidth: number, hostHeight: number): Promise<CmResponse<RunHttpServerResponse>> {
  //   return this.ConnectorFactory('performserver/run')
  //     .setMode(Modes.CORS)
  //     .dispatch<RunHttpServerRequest, CmResponse<RunHttpServerResponse>>(Methods.POST, { htmls, title, hostWidth, hostHeight });
  // }

  // generateStopHttpServerRequest(): Promise<CmResponse<HttpServerResponse>> {
  //   return this.ConnectorFactory('performserver/stop')
  //     .setMode(Modes.CORS)
  //     .dispatch<StopHttpServerRequest, CmResponse<HttpServerResponse>>(Methods.GET);
  // }

  generateBlobCreateRequest(blob: any, fileName: string, encoding?: string) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        dialog.showSaveDialog(null, {
          defaultPath: app.getPath('documents') + '/' + fileName,
        }, file => {
          if (file) {
            fs.writeFileSync(file, reader.result, encoding || 'binary');
            // Created file
          } else {
            // Request Canceled
          }
        });
      } catch (err) {
        // Error while creating file
      }
    };
    reader.readAsBinaryString(blob);
  }

  // generateOpenUrlRequest(url: string): Promise<CmResponse<CmOpenUrlResponse>> {
  //   return this.ConnectorFactory('openurl')
  //     .setMode(Modes.CORS)
  //     .dispatch<CmOpenUrlRequest, CmResponse<CmOpenUrlResponse>>(Methods.POST, { url: url });
  // }

  getAll(type: DATABASES): Array<Song> | Array<Songgroup> {
    let table = {};

    if (type === DATABASES.songs) {
      table = this.fileMap.songs;
    } else if (type === DATABASES.songgroups) {
      table = this.fileMap.songgroups;
    }

    return table ? Object.keys(table).map(key => table[key]) : [];
  }

  getByKey(type: DATABASES, id: string): Song | Songgroup {
    const suffix = this.suffix(type);
    return this.fileMap.songs[id + suffix];
  }

  addToMap(pathArray: string[], map: object, file: object) {
    if (pathArray.length > 1 && map[pathArray[0]]) {
      this.addToMap(pathArray.slice(1), map[pathArray[0]], file);
    } else if (pathArray.length > 1) {
      map[pathArray[0]] = {};
      this.addToMap(pathArray.slice(1), map[pathArray[0]], file);
    } else if (pathArray.length === 1) {
      map[pathArray[0]] = file;
    }
  }

  suffix(obj: Song | Songgroup | DATABASES) {
    if (obj instanceof Song || obj === DATABASES.songs) {
      return '.song';
    } else {
      return '.songgroup';
    }
  }
}
