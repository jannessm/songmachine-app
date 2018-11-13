'use strict';

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const sudo = require('sudo-prompt');
const os = require('os');

module.exports = class {

  constructor(){
    this.app = express();
    this.httpServer;
    this.port = 8080;
    this.html = '';
    this.sudoOptions = {
      name: 'Songmachine',
      icns: __dirname + '/assets/main-icon/songsheet.icns'
    };
  }

  run(host, htmls, title, hostWidth, hostHeight){
    this.setupHotspot();

    this.genHTML(htmls, host, hostWidth, hostHeight, title);

    const wss = new WebSocket.Server({ port: 8300 });

    wss.on('error', () => {});

    this.app.get('/', (req, res) => {
      res.send(this.html);
    });

    this.app.get('/UbuntuMono_latin_Bold.woff2', (req, res) => {
      res.sendFile(__dirname + '/UbuntuMono_latin_Bold.woff2');
    });
    this.app.get('/raleway-light.woff2', (req, res) => {
      res.sendFile(__dirname + '/UbuntuMono_latin_Bold.woff2');
    });
    this.app.get('/64x64.png', (req, res) => {
      res.sendFile(__dirname + '/64x64.png');
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

  setupHotspot(){
    switch(os.platform()){
      case 'darwin':
        const cmd = 'networksetup -createnetworkservice Songmachine lo0 && networksetup -setmanual Songmachine 172.20.42.42 255.255.0.0';
        sudo.exec(cmd, this.sudoOptions, () => {});
        break;
      case 'win32':
      case 'linux':
    }
  }

  genHTML(htmls, host, hostWidth, hostHeight, title){
    let pages = '';
    htmls.forEach((page, id) => {
      pages += `<div id="${id}" class="pages">${page}</div>`;
    })
    // this.html = fs.readFileSync(__dirname + '/previewTemplate.html', 'utf8')
    this.html = fs.readFileSync(__dirname + '/../../src/electron/previewTemplate.html', 'utf8')
      .replace('<!--Songs-->', pages)
      .replace('<!--WSHOST-->', host)
      .replace('<!--HostWidth-->', hostWidth)
      .replace('<!--HostHeight-->', hostHeight)
      .replace('<!--Title-->', title);
  }
}

