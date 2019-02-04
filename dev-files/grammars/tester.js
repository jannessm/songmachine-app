'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json({limit: '50mb', type: '*/json'}));

const nearley = require('nearley');
const compile = require('nearley/lib/compile');
const generate = require('nearley/lib/generate');
const nearleyGrammar = require("nearley/lib/nearley-language-bootstrapped");
const fs = require('fs');
const assert = require('assert');

const prepareTemplate = require(__dirname + '/tester.template.parser.js');

function cssObj(cssAbbrev, content, isTerminal = false){
  let css = [];
  css.push(/r/.test(cssAbbrev) ? 'red' : '');
  css.push(/g/.test(cssAbbrev) ? 'green' : '');
  css.push(/b/.test(cssAbbrev) ? 'blue' : '');
  css.push(/bo/.test(cssAbbrev) ? 'bold' : '');
  css.push(/i/.test(cssAbbrev) ? 'italic' : '');

  return {
    css: css.filter(val => !!val).join(' '),
    content,
    isTerminal
  }
}

const tests = {
  st: {
    colors: [
      [
        '<r>as<r>d',
        [cssObj('r', '<r>', true), cssObj('r', 'a'), cssObj('r', 's'), cssObj('r', '<r>', true), 'd']
      ], // wrapping
      'r>asdf', // start with not valid color
      '>asdf',
      '<rasdf',
      '<asdf',
      '<r>asdfr>', // end with not valid color
      '<r>asdf>', // end with not valid color
      '<r>asdf<r', // end with not valid color
      '<r>asdf<', // end with not valid color
      '<r><r>', // color tags directly behind another
      '<r>a<g>a<b>asdf', // changing colors
      '<r>a<g>a<b>asdf'
    ],
    styles: [
      'a***b***c', // bold and italic
      'a**bc', // non closing
      '*a', // beginning
      'a**', // end
    ]
  }
};

app.get('/', (req, res) => {

  const results = [];

  Object.keys(tests).forEach(testFile => {
    const grammarInput = fs.readFileSync(__dirname + '/'+testFile+'.ne');
    const fileResults = [];
    let parser;
    let compiled;

    try {
      // Parse the grammar source into an AST
      let grammarParser = new nearley.Parser(nearleyGrammar);
      grammarParser.feed(grammarInput);
      grammarParser = grammarParser.results[0];

      // Compile the AST into a set of rules
      grammarParser = compile(grammarParser, {});
      // Generate JavaScript code from the rules
      grammarParser = generate(grammarParser, "grammar");

      // Pretend this is a CommonJS environment to catch exports from the grammar.
      let module = { exports: {} };
      fs.writeFileSync(__dirname + '/testOUt.js', grammarParser);
      eval(grammarParser);
      compiled = module.exports;
    } catch(err) {
      fileResults.push(err);
      return;
    }
    
    Object.keys(tests[testFile]).forEach(testClass => {
      const resultsClass = [];
      tests[testFile][testClass].forEach(test => {
        let solution = [];
        if(typeof test !== 'string') {
          solution = test[1];
          test = test[0];
        }
        try {
          parser = new nearley.Parser(nearley.Grammar.fromCompiled(compiled));
          parser.feed(test);

          let correct;
          if(solution.length > 0){
            try {
              assert.equal(parser.results.length, 1);
              assert.deepEqual(parser.results[0], solution);
              correct = true;
            } catch(assertErr) {
              correct = false;
            }
          }

          resultsClass.push({query: test, results: parser.results, correct});
        } catch(err) {
          resultsClass.push({query: test, results: err, correct: undefined});
        }
      });
      fileResults.push({name: testClass, results: resultsClass});
    });
    results.push({name: testFile, results: fileResults, file: grammarInput});
  });
  res.send(prepareTemplate(results))
});

app.post('/save', (req, res) => {
  fs.writeFileSync(__dirname + '/' + req.body.fileName + '.ne', req.body.content);
  res.send();
})

app.listen(3000, () => console.log('started server'));