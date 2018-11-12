'use strict';

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

module.exports = class {

  constructor(){
    this.app = express();
    this.httpServer;
    this.port = 8080;
    this.html = '';
  }

  run(host, htmls){
    let pages = '';
    htmls.forEach((page, id) => {
      pages += `<div id="${id}" class="pages">${page}</div>`;
    })
    this.html = fs.readFileSync(__dirname + '/previewTemplate.html', 'utf8').replace('<!--Songs-->', pages);

    const wss = new WebSocket.Server({ port: 8300 });

    wss.on('error', () => {});

    this.app.get('/', (req, res) => {
      res.send(this.html);
    });

    this.app.get('/UbuntuMono_latin_Bold.woff2', (req, res) => {
      res.sendFile(__dirname + '/UbuntuMono_latin_Bold.woff2');
    });
    
    this.app.get('/changeSong/:songId', (req, res) => {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ songId: req.params.songId}));
        }
      });
      res.send();
    });
    this.app.get('/scroll/:scrollTop', (req, res) => {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ scrollTop: req.params.scrollTop}));
        }
      });
      res.send();
    });

    this.httpServer = http.createServer(this.app);
    this.httpServer.on('error', () => {})
    this.httpServer.listen(this.port);
  }

  stop(){
    this.httpServer.close();
  }
}

