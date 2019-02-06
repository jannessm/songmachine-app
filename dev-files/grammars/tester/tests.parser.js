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
  css.push(/r/.test(cssAbbrev) ? 'red' : '');
  css.push(/g/.test(cssAbbrev) ? 'green' : '');
  css.push(/b/.test(cssAbbrev) ? 'blue' : '');
  css.push(/o/.test(cssAbbrev) ? 'bold' : '');
  css.push(/i/.test(cssAbbrev) ? 'italic' : '');
  css.push(/\[|\]/.test(cssAbbrev) ? 'grey' : '');
  css.push(/n/.test(cssAbbrev) ? 'orange' : '');
  css.push(/e/.test(cssAbbrev) ? 'error' : '');

  return {
    css: css.filter(val => !!val).join(' '),
    content,
    isTerminal: isTerminal === 'true'
  }
}

module.exports = function(content){
  let lastPath = [];
  let lastDepth = -1;
  const tests = {};

  content.split('\n').forEach(line => {
    if (/:/.test(line) && /-/.test(line)) {
      throw Error('no valid test file');
    }

    if(/:/.test(line)){
      const depth = /\S/.exec(line).index / 2;
      let key = line.replace(':', '').trim();

      if (/^["']/.test(key)) {
        key = key.slice(1, -1);
      }

      if (depth > lastDepth) {
        traverse(tests, lastPath)[key] = {};
        lastDepth = depth;
        lastPath.push(key);
      } else if (depth === lastDepth) {
        lastPath.splice(lastPath.length - 1, 1);
        traverse(tests, lastPath)[key] = {};
        lastPath.push(key);
      } else if (depth < lastDepth) {
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

      trav.push(cssObj(...line.replace('-', '').split(',').map(val => val.trim())));
    }
  });
  return tests;
}