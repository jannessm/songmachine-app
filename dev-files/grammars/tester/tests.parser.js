'use strict';

const fs = require('fs');

function traverse(obj, path) {
  if(path.length > 0){
    const spliced = Array.from(path);
    spliced.splice(0, 1);
    return traverse(obj[path[0]], spliced);
  } else {
    return obj;
  }
}

function cssObj(cssAbbrev, content, isTerminal = false){
  if(!content){
    return cssAbbrev;
  }
  let css = [];
  css.push(/n/.test(cssAbbrev) ? 'orange' : '');
  css.push(/r/.test(cssAbbrev) ? 'red' : '');
  css.push(/g/.test(cssAbbrev) ? 'green' : '');
  css.push(/b/.test(cssAbbrev) ? 'blue' : '');
  css.push(/i/.test(cssAbbrev) ? 'italic' : '');
  css.push(/o/.test(cssAbbrev) ? 'bold' : '');
  css.push(/\[|\]/.test(cssAbbrev) ? 'grey' : '');
  css.push(/e/.test(cssAbbrev) ? 'error' : '');

  return {
    css: css.filter(val => !!val).join(' '),
    content,
    isTerminal: isTerminal === 'true'
  }
}

function prepareTests(fileName){
  const tests = parseYml(__dirname + '/../' + fileName + '.tests.yml', true);

  if (tests.include) {
    const reduced = {};
    tests.include.forEach(file => reduced[file] = prepareTests(file));
    return Object.assign(reduced, tests.tests);
  } else {
    return tests.tests;
  }
}

function parseYml(fileName, testContent = false){
  const content = removeComments(fs.readFileSync(fileName));
  let lastPath = [];
  let lastDepth = -1;
  const tests = {};

  content.split('\n').forEach(line => {
    if (/:/.test(line) && /-/.test(line)) {
      throw Error('no valid test file');
    }

    if(/:/.test(line)){
      const depth = /\S/.exec(line).index / 2;
      const key = removeQuotes(line.replace(':', '').trim());

      if (depth > lastDepth) {
        traverse(tests, lastPath)[key] = {};
        lastDepth = depth;
        lastPath.push(key);
      } else if (depth === lastDepth) {
        lastPath.splice(lastPath.length - 1, 1);
        traverse(tests, lastPath)[key] = {};
        lastPath.push(key);
      } else if (depth < lastDepth) {
        // check last
        const lastKey = lastPath[lastPath.length - 1];
        const traversed = traverse(tests, lastPath);
        let offset = 0;

        if (
          testContent &&
          traversed.length && 
          !traversed.reduce((isCorrect, elem, id) => {
            let val;
            if (typeof elem === 'string') {
              val = lastKey.substr(id + offset, elem.length);
              offset += elem.length - 1;
              return isCorrect && val === elem;
            } else {
              val = lastKey.substr(id + offset, elem.content.length);
              offset += elem.content.length - 1;
              return isCorrect && val === elem.content;
            }
          }, true)
        ){
          throw new Error(`tests are not correct:\n\n    file: ${fileName}\n    test: ${lastKey}\n`);
        }

        lastPath = lastPath.slice(0, depth);
        traverse(tests, lastPath)[key] = {};
        lastPath.push(key);
        lastDepth = depth;
      }
    }

    if(/-/.test(line)){
      let trav = traverse(tests, lastPath);
      if(!trav.length){
        traverse(tests, lastPath.slice(0, lastPath.length - 1))[lastPath[lastPath.length - 1]] = [];
        trav = traverse(tests, lastPath);
      }

      trav.push(cssObj(...line.replace('-', '').split(',').map(val => removeQuotes(val.trim()))));
    }
  });

  return tests;
}

function removeComments(content) {
  if (content.replace) {
    return content.replace(/#.*/g, '');
  } else {
    return content.toString().replace(/#.*/g, '');
  }
}

function removeQuotes(str){
  if (/^["']/.test(str)) {
    str = str.slice(1, -1);
  }
  return str;
}

module.exports.prepareTests = prepareTests;
module.exports.parseYml = parseYml;