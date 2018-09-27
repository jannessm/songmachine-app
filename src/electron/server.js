module.exports = class {

  constructor() { }

  static run(api) {
    const Router = require('@marshallofsound/electron-router').Router;

    /**
     * Request Body
     * {
     *     filePath: 'abs path to target file',
     *     payload: 'html'
     * }
     */
    api.post('pdf', (request, response) => {
      console.log(request.uploadData[0].json())
      response.json({foo: 'bar'})
    });

  }

};
