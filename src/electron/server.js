const pdf = require('html-pdf');
const path = require('path');
const FileManager = require('./filesystem.manager');
const jiff = require('jiff');

function assembleBufferPayload(request) {
  const requestPayload = (request.uploadData || [{ stringContent: () => '{}' }]);
  const stringData = requestPayload
    .map(data => data.stringContent())
    .reduce((data, curr) => data.concat(curr));
  return JSON.parse(stringData);
}

module.exports = class {

  static run(api) {
    const fileManager = new FileManager();

    /**
     * Request Body
     * {
     *     filePath: 'absolute path to target file',
     *     fileName: 'name for the file',
     *     payload: 'html',
     *     metadata: 'pdf create opts'
     * }
     *
     * Response Body Payload
     * {
     *     created: 'boolean flag, false on error'
     * }
     */
    api.post('pdf', (request, response) => {
      const requestPayload = assembleBufferPayload(request);
      if(requestPayload.filePath && requestPayload.fileName && requestPayload.payload && requestPayload.metadata) {
        pdf.create(requestPayload.payload, requestPayload.metadata).toFile(path.join(requestPayload.filePath, requestPayload.fileName), err => {
          response.json({
            status: !!err? 201: 500,
            statusMessage: err.stack,
            payload: {
              created: !!err
            }
          });
        });
      } else {
        response.json({
          status: 400,
          statusMessage: 'Invalid Post Body',
          payload: {
            created: false
          }
        });
      }
    });

    /**
     * Request Body
     * {
     *     path: 'absolute path to directory
     * }
     *
     * Response Body Payload
     * [] Array of file system links to all song files
     */
    api.post('index', (request, response) => {
      const payload = assembleBufferPayload(request);
      if(payload.path) {
        try {
          const songLinks = fileManager
            .clearMap()
            .readDir(payload.path)
            .loadSongFiles()
            .listAllSongFiles();
          response.json({
            status: 200,
            statusMessage: 'All songs indexed',
            payload: songLinks
          });
        } catch (error) {
          response.json({
            status: 500,
            statusMessage: error.stack,
            payload: {}
          });
        }
      } else {
        response.json({
          status: 400,
          statusMessage: 'Invalid Post Body',
          payload: {}
        });
      }
    });

    api.get('index', (request, response) => {
      try {
        const songLinks =  Array.from(fileManager.loadSongFiles(), 
          map => Object.assign({}, { path: map[0], content: map[1] })
          );
        response.json({
          status: 200,
          statusMessage: 'All songs indexed',
          payload: songLinks
        });
      } catch (error) {
        response.json({
          status: 500,
          statusMessage: error.stack,
          payload: {}
        });
      }

    });
    

    /**
     * Request Body
     * {
     *     path: absolute path to the file
     *     payload: to be saved data
     * }
     *
     * No response payload. statuses
     * 201,
     * 400 on not saved because assumed your input data was wrong
     */
    api.post('file', (request, response) => {
      const payload = assembleBufferPayload(request);
      fileManager.writeFile(payload.path, payload.payload, (err) => {
        if(err) {
            response.json({
              status: 400,
              statusMessage: ['Could not create file', err.stack].join('\n See information: ')
            });
        }
        else {
          response.json({
            status: 201,
            statusMessage: 'Wrote file',
            payload: {}
          });
        }
      });
    });

    /**
     * Request Body
     * {
     *     path: absolute path to the file
     *     payload: to be saved data
     * }
     * Statuses
     * 201,
     * 300, when there have been changes since last load
     * 404 if the given path was not loaded before and a synch check is not possible
     *
     * Response Payload on 300
     * {
     *     currentVersion: version from current file
     * }
     */
    api.post('file/sync', (request, response) => {
      const payload = assembleBufferPayload(request);
      if(fileManager.isIndexed(payload.path)) {
        try {
          const indexedFile = JSON.parse(fileManager.getIndexedVersion(payload.path));
          const currentFile = JSON.parse(fileManager.loadFile(payload.path));
          const diff = jiff.diff(currentFile, indexedFile);
          if(diff.length === 0) {
            fileManager.writeFile(payload.path, payload.payload, () => {});
            response.json({
              status: 201,
              statusMessage: 'File was saved without conflicts',
              payload: {}
            });
          } else {
            response.json({
              status: 300,
              statusMessage: 'The file has been modified without being reloaded',
              payload: {
                currentVersion: currentFile,
                indexedVersion: indexedFile
              }
            });
          }
        } catch (err) {
          response.json({
            status: 500,
            statusMessage: ['An error occurred while loading file', err.stack].join('\n See information: ')
          });
        }
      } else {
        response.json({
          status: 404,
          statusMessage: 'The given resource has not been initialized',
          payload: {}
        });
      }
    });

    /**
     * Request Body
     * {
     *     path: absolute path to the file
     * }
     * No response payload. statuses
     * 200,
     * 400 on not saved because assumed your input data was wrong,
     * 404 on not existing file
     */
    api.delete('file', (request, response) => {
      const payload = assembleBufferPayload(request);
      try {
        fileManager.deleteFile(payload.path)
      } catch(err) {
        response.json({
          status: 404,
          statusMessage: err.stack,
          payload: {}
        });
      }
    });

    /**
     * Request Body
     * {
     *     path: path to file
     *     json?: if true it will return the file as json
     * }
     *
     * Response Body
     * {
     *     data: utf8 encoded string or json
     * }
     */
    api.post('read', (request, response) => {
      const payload = assembleBufferPayload(request);
      if(fileManager.exists(payload.path)) {
        const file = fileManager.loadFile(payload.path);
        const data = payload.json? JSON.parse(file) : file;
        response.json({
          status: 200,
          statusMessage: 'Resource loaded',
          payload: { data }
        });
      } else {
        response.json({
          status: 404,
          statusMessage: 'Given path does not exist or is not readable',
          payload: {}
        });
      }
    });
  }
};
