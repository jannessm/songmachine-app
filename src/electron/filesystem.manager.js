const fs = require('fs');
const path = require('path');
const UtilMap = require('@nilsroesel/utils').UtilMap;
const shell = require('shelljs');

module.exports = class {

  constructor() { this.fileMap = UtilMap.asES5(); }

  createDir(pathWithFile) {
    const dir = path.parse(pathWithFile).dir;
    if(!fs.existsSync(dir)) {
      shell.mkdir('-p', dir);
    }
  }

  /**
   * Will index and map all file paths for .song files
   * and scan all sub directories recursive
   * @param dirPath
   * @return this
   */
  readDir(dirPath) {
    if(dirPath) {
      fs.readdirSync(dirPath).forEach(entry => {
        const entryPath = path.join(dirPath, entry);
        if(fs.statSync(entryPath).isDirectory()) this.readDir(entryPath);
        else if(path.extname(entryPath) === '.song' || path.extname(entryPath) === '.songgroup') this.fileMap.set(entryPath, null);
      });
    }
    return this;
  }

  /**
   * Will load all .song files from a before scanned directory and return the resulting map
   */
  loadSongFiles() {
    this.fileMap = this.fileMap
      .map((value, key) => fs.readFileSync(key, 'utf8'))
      .map((value) => {
        try {
          return JSON.parse(value);
        } catch(err) { return null; }
      })
      .filter(v => !!v);
    return this;
  }

  loadFile(path) { return fs.readFileSync(path, 'utf8'); }

  listAllSongFiles() { return Array.from(this.fileMap, map => map[0]); }

  deleteFile(path) {
    if (this.fileMap.has(path)) {
      fs.unlinkSync(path);
      this.fileMap.delete(path);
    } else throw new Error('No such resource');
  }


  writeFile(path, document, onExecute) {
    fs.writeFile(path, JSON.stringify(document, null, 2), err => {
      this.createDir(path);
      onExecute(err);
      if(!err) this.fileMap.set(path, document);
    });
  }

  /**
   * Will call the callback without parameters when the given file was changed
   * @param path
   * @param callback (newData) => void
   */
  observe(path, callback) { fs.watchFile(path, () => callback(JSON.parse(fs.readFileSync(path, 'utf8')))); }

  isIndexed(path) { return this.fileMap.has(path); }

  getIndexedVersion(path) { return this.fileMap.get(path); }

  exists(path) { return fs.existsSync(path); }

  clearMap() {
    this.fileMap.clear(); 
    return this;
  }

};
