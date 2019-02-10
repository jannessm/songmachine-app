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
const prepareTests = require(__dirname + '/tests.parser.js').prepareTests;
const parseYml = require(__dirname + '/tests.parser.js').parseYml;

function compileGrammar(input){
  // Parse the grammar source into an AST
  let grammarParser = new nearley.Parser(nearleyGrammar);
  grammarParser.feed(input);
  grammarParser = grammarParser.results[0];
  
  // Compile the AST into a set of rules
  grammarParser = compile(grammarParser, {});
  // Generate JavaScript code from the rules
  grammarParser = generate(grammarParser, "grammar");
  fs.writeFileSync('compiled2', grammarParser);

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
        try {
          assert.deepEqual(parser.results[0], solution);
          correct = true;
        } catch(assertErr) {
          correct = false;
          console.log(parser.results);
          parser.results.push(["solution:"].concat(solution));
        }
      } catch(assertErr) {
        parser.results = assertErr;
        correct = false;
      }
    }

    results.push({query: test, results: parser.results, correct});
  } catch(err) {
    results.push({query: test, results: err, correct: undefined});
  }
}

function processTestClass(testClasses, compiledGrammar) {
  const results = [];

  Object.keys(testClasses).forEach(testClass => {
    if (!testClasses[testClass].length && typeof testClasses[testClass] === 'object') {
      const res = processTestClass(testClasses[testClass], compiledGrammar);
      results.push({name: testClass, results: res, correct: res.reduce((red, val) => val.correct && red, true)});
    } else {
      const solution = testClasses[testClass];
      const testInput = solution.length ? [testClass, solution] : testClass;
      execParsing(testInput, results, compiledGrammar);
      return {
        name: testClass,
        results,
        correct: results.reduce((reduced, val) => val.correct && reduced, true)
      };
    }
  });
  return results;
}

app.get('/', (req, res) => {
  const results = [];
  const testsConfig = parseYml(__dirname + '/tests.yml');
  testsConfig.grammars.forEach(testFile => {
    let grammarInput = fs.readFileSync(__dirname + '/../'+testFile+'.ne');
    const tests = prepareTests(testFile);
    let fileResults = [];
    let compiled;

    try {
      compiled = compileGrammar(grammarInput);

      fileResults = processTestClass(tests, compiled);
    } catch(err) {
      fileResults = err;
    }
    const correct = !fileResults.stack ? fileResults.reduce((reduced, val) => val.correct && reduced, true) : undefined;
    results.push({name: testFile, results: fileResults, file: grammarInput, correct});
  });
  res.send(prepareTemplate(results))
});

app.post('/save', (req, res) => {
  fs.writeFileSync(__dirname + '/../' + req.body.fileName + '.ne', req.body.content);
  res.send();
})

app.listen(3000, () => console.log('started server'));