const pdf = require('html-pdf');
const path = require('path');
const FileManager = require('./filesystem.manager');

module.exports = class {

  static run(api) {
    const emptyData = [{ json: () => Object.assign({}) }];
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
      const requestPayload = (request.uploadData || emptyData)[0].json();
      if(requestPayload.filePath && requestPayload.fileName && requestPayload.payload && requestPayload.metadata) {
        pdf.create(requestPayload.payload, requestPayload.metadata).toFile(path.join(requestPayload.filePath, requestPayload.fileName), (err, res) => {
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
      const payload = (request.uploadData || emptyData)[0].json();
      if(payload.path) {
        try {
          const songLinks = fileManager
            .readDir(payload.path)
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
      const payload = (request.uploadData || emptyData)[0].json();
      fileManager.writeFile(payload.filePath, payload.payload, (err) => {
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
  }
};
