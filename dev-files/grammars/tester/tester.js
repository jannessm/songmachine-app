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

function compileGrammar(input){
  // Parse the grammar source into an AST
  let grammarParser = new nearley.Parser(nearleyGrammar);
  grammarParser.feed(input);
  grammarParser = grammarParser.results[0];

  // Compile the AST into a set of rules
  grammarParser = compile(grammarParser, {});
  // Generate JavaScript code from the rules
  grammarParser = generate(grammarParser, "grammar");

  // Pretend this is a CommonJS environment to catch exports from the grammar.
  let module = { exports: {} };
  eval(grammarParser);
  return module.exports;
}

function execParsing(test, results, compiled) {
  let solution = [];
  if(typeof test !== 'string') {
    solution = test[1];
    test = test[0];
  }
  try {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(compiled));
    parser.feed(test);

    let correct;
    if(solution.length > 0){
      try {
        assert.equal(parser.results.length, 1);
        assert.deepEqual(parser.results[0], solution);
        correct = true;
      } catch(assertErr) {
        console.log(assertErr);
        correct = false;
      }
    }

    results.push({query: test, results: parser.results, correct});
  } catch(err) {
    results.push({query: test, results: err, correct: undefined});
  }
}

app.get('/', (req, res) => {
  const results = [];
  const tests = eval(fs.readFileSync(__dirname + '/tests.js').toString());
  Object.keys(tests).forEach(testFile => {
    const grammarInput = fs.readFileSync(__dirname + '/../'+testFile+'.ne');
    let fileResults = [];
    let compiled;

    try {
      compiled = compileGrammar(grammarInput);

      Object.keys(tests[testFile]).forEach(testClass => {
        let resultsClass = [];
        tests[testFile][testClass].forEach(test => {
          execParsing(test, resultsClass, compiled);
        });
        fileResults.push({
          name: testClass,
          results: resultsClass,
          correct: resultsClass.reduce((reduced, val) => val.correct && reduced, true)
        });
      });
    } catch(err) {
      fileResults = err;
    }
    const correct = !fileResults.stack ? fileResults.reduce((reduced, val) => val.correct && reduced, true) : undefined;
    results.push({name: testFile, results: fileResults, file: grammarInput, correct});
  });
  res.send(prepareTemplate(results))
});

app.post('/save', (req, res) => {
  fs.writeFileSync(__dirname + '/' + req.body.fileName + '.ne', req.body.content);
  res.send();
})

app.listen(3000, () => console.log('started server'));