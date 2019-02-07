'use strict';

const fs = require('fs');
const template = fs.readFileSync(__dirname + '/tester.template.html');

function prepareTemplate(results) {
  return template
    .toString()
    .replace('{{body}}', results.map(testFile => prepareTestFile(testFile)).join(''));
}

function prepareTestFile(testFile) {
  if(testFile.results.stack){
    return `
    <div class="res-card">
      <h1 onclick="toggleFile(event)" class="${testFile.correct === undefined ? '': testFile.correct ? 'correct' : 'not-correct'}">${testFile.name}</h1>
      <div class="res-file">
        <h3 onclick="toggleClassWrapper(event)">Editor</h3>
        <textarea class="editor">${testFile.file}</textarea><button onclick="refresh(event, '${testFile.name}')">Refresh</button><hr>
        <div class="res-wrapper error-wide">
          <div class="res-query-wrapper"><pre class="res">${testFile.results.stack}</pre></div>
        </div>
      </div>
    </div>`;
  } else {
    return `
    <div class="res-card">
      <h1 onclick="toggleFile(event)" class="${testFile.correct === undefined ? '': testFile.correct ? 'correct' : 'not-correct'}">${testFile.name}</h1>
      <div class="res-file" ${testFile.correct === undefined ? '': testFile.correct ? 'style="display: none;"' : ''}>
        <h2 onclick="toggleClassWrapper(event)">Editor</h2>
        <textarea class="editor">${testFile.file}</textarea><button onclick="refresh(event, '${testFile.name}')">Refresh</button><hr>
        ${testFile.results.map(testClass => prepareClass(testClass)).join('<hr>')}
      </div>
    </div>`;
  }
}

function prepareClass(testClass) {
  let func;
  let content;
  let css = testClass.correct === undefined ? '': testClass.correct ? 'correct' : 'not-correct';
  // is query
  if (testClass.results[0] && testClass.results[0].results[0].length) {
    func = 'toggleClassWrapper';
    content = `
        <div class="flex-wrapper" ${testClass.correct === undefined ? '': testClass.correct ? 'style="display: none;"' : ''}>
          <div class="flex">${testClass.results.map(query => prepareQuery(query)).join('')}</div>
        </div>`;
  } else if(testClass.results[0]) {
    func = 'toggleFile';
    css += testClass.correct ? ' collapsed' : ' expended'
    content = `<div class="subclass" ${testClass.correct === undefined ? '': testClass.correct ? 'style="display: none;"' : ''}>
      ${testClass.results.map(nextClass => `  
          <div class="res-file">
          ${prepareClass(nextClass)}
          </div>`).join('<hr>')}
      </div>`;
  }

  if (!content) {
    css = '';
  }

  return `
    <div class="res-class">
    <h2 onclick="${func}(event)" class="${css}">${testClass.name}</h2>
      ${content}
    </div>`;
}

function prepareQuery(query) {
  if(query.results.stack){
    return `
  <div class="res-wrapper error">
    <h3 class="not-correct">${escapeHTML(query.query)}</h3>
    <div class="res-query-wrapper"><pre class="res">${query.results.stack}</pre></div>
  </div>`;
  } else {
    return `
    <div class="res-wrapper">
      <h3 class="${query.correct === undefined ? '' : query.correct ? 'correct' : 'not-correct'}">${escapeHTML(query.query)}</h3>
      <div class="res-query-wrapper">
        ${query.results.map(res => prepareResult(res)).join('<hr>')}
      </div>
    </div>`;
  }
}

function prepareResult(res) {
  return `
    <div class="res">
      ${res.map(char => prepareChar(char)).join('')}
    </div>`;
}

function prepareChar(char) {
  if (!char) {
    char = 'undefined';
  }

  if(typeof char === 'string'){
    return '<pre class="res-char">' + escapeHTML(char) + '</pre>';
  } else {
    return `<pre class="res-char ${char.css}" onclick="toggleChar(event.target, event.target.nextElementSibling)" style="display: none;">${
      escapeHTML(JSON.stringify(char, null, 2))
    }</pre>
    <pre class="res-char ${char.css} ${char.isTerminal ? 'isTerminal' : ''}" onclick="toggleChar(event.target, event.target.previousElementSibling)">${
      escapeHTML(`{${char.content}}`)
    }</pre>`;
  }
}

function escapeHTML(char) {
  if (char && char.length === 1) {
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
        '|': '&#124;',
        '♮': '&#9838;'
    };

    return entityMap[char] ? entityMap[char] : char;
  } else if (char) {
    return char.split('').map(c => escapeHTML(c)).join('');
  }
}

module.exports = prepareTemplate;