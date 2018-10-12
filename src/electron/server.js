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
     *     directoryPath: 'absolute path to directory
     * }
     *
     * Response Body Payload
     * [] Array of file system links to all song files
     */
    api.post('index', (request, response) => {
      const payload = (request.uploadData || emptyData)[0].json();
      if(payload.directoryPath) {
        try {
          const songLinks = fileManager
            .readDir(payload.directoryPath)
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
  }

};
