const fs = require('fs');
const path = require('path');
const utils = require('@nilsroesel/utils');

module.exports = class {

  constructor() { this.fileMap = new utils.UtilMap(); }

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
        else if(path.extname(entryPath) === '.song') this.fileMap.set(entryPath, null);
      });
    }
    return this;
  }

  /**
   * Will load all .song files from a before scanned directory and return the resulting map
   */
  loadSongFiles() {
    return this.fileMap
      .map((value, key) => fs.readFileSync(key, 'utf8'))
      .map((value) => {
        try {
          return JSON.parse(value);
        } catch(err) { return null; }
      })
      .filter(v => !!v);
  }

  loadFile(path) { return fs.readFileSync(path, 'utf8'); }

  listAllSongFiles() { return Array.from(this.fileMap, map => map[0]); }

  deleteFile(path) {
    if (this.fileMap.has(path)) {
      fs.unlink(path);
      this.fileMap.delete(path);
    } else throw new Error('No such resource');
  }


  writeFile(path, document, onExecute) {
    fs.writeFile(path, JSON.stringify(document), err => {
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

};
