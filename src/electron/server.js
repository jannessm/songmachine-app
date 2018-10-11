const pdf = require('html-pdf');
const path = require('path');

module.exports = class {

  constructor() { }

  static run(api) {
    /**
     * Request Body
     * {
     *     filePath: 'absolute path to target file',
     *     fileName: 'name for the file',
     *     payload: 'html',
     *     metadata: 'pdf create opts'
     * }
     *
     * Response Body
     * {
     *     created: 'boolean flag, false on error'
     * }
     */
    api.post('pdf', (request, response) => {
      const emptyData = [{ json: () => Object.assign({}) }];
      const requestPayload = (request.uploadData || emptyData)[0].json();

      pdf.create(requestPayload.payload, requestPayload.metadata).toFile(path.join(requestPayload.filePath, requestPayload.fileName), (err, res) => {
        response.json({
          created: !!err
        });
      });
    });

  }

};
