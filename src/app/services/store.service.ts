import { Injectable } from '@angular/core';
import { CreateOptions } from 'html-pdf';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as jiff from 'jiff';
import { dialog, app } from 'electron';

@Injectable()
export class StoreService {

  fileMap = {};

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
    const file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    this.fileMap[filePath] = file;
    return file;
  }

  loadSongFiles() {
    Object.keys(this.fileMap)
      .map((key) => {
        this.fileMap[key] = fs.readFileSync(key, 'utf8');
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

  createFileIndex(dirPath: string) {
    if (dirPath) {
      fs.readdirSync(dirPath).forEach(entry => {
        const entryPath = path.join(dirPath, entry);
        if (fs.statSync(entryPath).isDirectory()) {
          this.createFileIndex(entryPath);
        } else if (path.extname(entryPath) === '.song' || path.extname(entryPath) === '.songgroup') {
          this.fileMap[entryPath] = null;
        }
      });
    }
    return this;
  }

  createFile(filePath: string, payload: string): Promise<any> {
    const promise = new Promise((res, rej) => {
      fs.writeFile(filePath, JSON.stringify(payload, null, 2), err => {
        if (err) {
          rej(err);
        } else {
          this.fileMap[filePath] = JSON.parse(payload);
          res(this.fileMap[filePath]);
        }
      });
    });
    return promise;
  }

  deleteFile(filePath: string): Promise<any> {
    return new Promise((res, rej) => {
      if (this.fileMap[filePath]) {
        fs.unlinkSync(filePath);
        delete this.fileMap[filePath];
        res();
      } else {
        rej('No such resource');
      }
    });
  }

  updateFile<T>(filePath: string, payload: T): Promise<any> {
    const promise = new Promise((res, rej) => {
      if (this.fileMap[filePath]) {
        try {
          const indexedFile = this.fileMap[filePath];
          const currentFile = this.loadFile(filePath);
          const diff = jiff.diff(currentFile, indexedFile);
          if (diff.length === 0) {
            fs.writeFile(filePath, payload, () => {res(payload); });
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

}
