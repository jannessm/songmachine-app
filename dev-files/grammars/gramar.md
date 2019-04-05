# Grammars
All Grammars are defined as nearley grammars (.ne).

## Develop
run `yarn grammar-tester` and open the localhost to see results of all tests. In dev-files/grammars/tests.yml the grammar names are given and test files are evaluated.

### Naming
Each class is seperated by an underscore.

|abbrev|meaning|
|------|-------|
|s|start|
|r|red|
|g|green|
|b|blue|
|i|italic|
|bo|bold|
|br|brackets|

### Tests
In these tests the css class is represented by one char:

|char|class|
|----|-----|
|r|red|
|g|green|
|b|blue|
|i|italic|
|o|bold|
|\[|grey|
|n|orange|
|e|error|
