// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "s", "symbols": ["char", "s"], "postprocess": ([char, s]) => [char].concat(s)},
    {"name": "s", "symbols": [{"literal":"["}, "br", {"literal":"]"}, "s"], "postprocess": ([open, char, close, s]) =>  [{char, isChord: true}].concat(s)},
    {"name": "s", "symbols": []},
    {"name": "br", "symbols": ["char", "s"], "postprocess": ([char, s]) => [char].concat(s)},
    {"name": "br", "symbols": []},
    {"name": "char", "symbols": [/[^\[\]]/], "postprocess": data => data[0]}
]
  , ParserStart: "s"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
