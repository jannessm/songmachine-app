// Generated automatically by nearley, version unknown
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
  char: {match: /[^\[\]<>\*]/, lineBreaks: true},
  notColor: /[rgbRGB]/,
  color: /[rgbRGB]/,
  r: /<(?:r|R)>/,
  g: /<(?:g|G)>/,
  b: /<(?:b|B)>/,
  bo: /(?!\*)\*\*(?!\*)/,
  i: /(?!\*)\*(?!\*)/,
  bo_i: /(?!\*)\*\*\*(?!\*)/,
});


const cssObj = function(css, data, isTerminal = true) {
	return {
        css,
        content: data,
        isTerminal
      }
}

const post = function (css, data, rest, isTerminal = true){
  return [cssObj(css, data, isTerminal)].concat(rest);
}

const pP = {
  error: ([fst, d]) => post("error", fst.value, d),
  invError: ([fst, d]) => post("error", d, fst.value).reverse(),

  s: ([fst, d]) => [fst.value].concat(d),
  r: ([fst, d])  => post("red", fst.value, d),
  g: ([fst, d]) => post("green", fst.value, d),
  b: ([fst, d]) => post("blue", fst.value, d),
  i: ([fst, d]) => post("italic", fst.value, d),
  bo: ([fst, d]) => post("bold", fst.value, d),
  bo_i: ([fst, d]) => post("bold italic", fst.value, d),
  r_i: ([fst, d]) => post("red italic", fst.value, d),
  r_bo: ([fst, d]) => post("red bold", fst.value, d),
  r_bo_i: ([fst, d]) => post("red bold italic", fst.value, d),
  g_i: ([fst, d]) => post("green italic", fst.value, d),
  g_bo: ([fst, d]) => post("green bold", fst.value, d),
  g_bo_i: ([fst, d]) => post("green bold italic", fst.value, d),
  b_i: ([fst, d]) => post("blue italic", fst.value, d),
  b_bo: ([fst, d]) => post("blue bold", fst.value, d),
  b_bo_i: ([fst, d]) => post("blue bold italic", fst.value, d),

  r_: ([fst, d])  => post("red", fst.value, d, false),
  g_: ([fst, d]) => post("green", fst.value, d, false),
  b_: ([fst, d]) => post("blue", fst.value, d, false),
  i_: ([fst, d]) => post("italic", fst.value, d, false),
  bo_: ([fst, d]) => post("bold", fst.value, d, false),
  bo_i_: ([fst, d]) => post("bold italic", fst.value, d, false),
  r_i_: ([fst, d]) => post("red italic", fst.value, d, false),
  r_bo_: ([fst, d]) => post("red bold", fst.value, d, false),
  r_bo_i_: ([fst, d]) => post("red bold italic", fst.value, d, false),
  g_i_: ([fst, d]) => post("green italic", fst.value, d, false),
  g_bo_: ([fst, d]) => post("green bold", fst.value, d, false),
  g_bo_i_: ([fst, d]) => post("green bold italic", fst.value, d, false),
  b_i_: ([fst, d]) => post("blue italic", fst.value, d, false),
  b_bo_: ([fst, d]) => post("blue bold", fst.value, d, false),
  b_bo_i_: ([fst, d]) => post("blue bold italic", fst.value, d, false),
	
  s3: ([fst, snd, s]) => [fst.value].concat(pP.s([snd.value, s])),
  i3: ([fst, snd, s]) => [cssObj('italic', fst)].concat(pP.i([snd.value, s])),
  bo3: ([fst, snd, s]) => post("bold", fst, s),
  bo_i3: ([fst, snd, s]) => post("bold italic", fst, d),
  r_i3: ([fst, snd, s]) => [cssObj('red italic', fst)].concat(pP.r_i([snd,s])),
  r_bo3: ([fst, snd, s]) => [cssObj('red bold', fst)].concat(pP.r_bo([snd,s])),
  r_bo_i3: ([fst, snd, s]) => post("red bold italic", fst, d),
  g_i3: ([fst, snd, s]) => post("green italic", fst, d),
  g_bo3: ([fst, snd, s]) => post("green bold", fst, d),
  g_bo_i3: ([fst, snd, s]) => post("green bold italic", fst, d),
  b_i3: ([fst, snd, s]) => post("blue italic", fst, d),
  b_bo3: ([fst, snd, s]) => post("blue bold", fst, d),
  b_bo_i3: ([fst, snd, s]) => post("blue bold italic", fst, d),

  r_3: ([fst, snd, s]) => [cssObj("red", fst, false)].concat(pP.r_([snd,s])),
  g_3: ([fst, snd, s]) => [cssObj("green", fst, false)].concat(pP.g_([snd,s])),
  b_3: ([fst, snd, s]) => [cssObj("blue", fst, false)].concat(pP.b_([snd,s])),
  i_3: ([fst, snd, s]) => [cssObj("italic", fst, false)].concat(pP.i_([snd,s])),
  bo_3: ([fst, snd, s]) => [cssObj("bold", fst, false)].concat(pP.bo_([snd,s])),
  bo_i_3: ([fst, snd, s]) => [cssObj("bold italic", fst, false)].concat(pP.bo_i_([snd,s])),
  r_i_3: ([fst, snd, s]) => [cssObj("red italic", fst, false)].concat(pP.r_i_([snd,s])),
  r_bo_3: ([fst, snd, s]) => [cssObj("red bold", fst, false)].concat(pP.r_bo_([snd,s])),
  r_bo_i_3: ([fst, snd, s]) => [cssObj("red italic bold", fst, false)].concat(pP.r_bo_i_([snd,s])),
  g_i_3: ([fst, snd, s]) => [cssObj("green italic", fst, false)].concat(pP.g_i_([snd,s])),
  g_bo_3: ([fst, snd, s]) => [cssObj("green bold", fst, false)].concat(pP.g_bo_([snd,s])),
  g_bo_i_3: ([fst, snd, s]) => [cssObj("green bold italic", fst, false)].concat(pP.g_bo_i([snd,s])),
  b_i_3: ([fst, snd, s]) => [cssObj("blue italic", fst, false)].concat(pP.b_i_([snd,s])),
  b_bo_3: ([fst, snd, s]) => [cssObj("blue bold", fst, false)].concat(pP.b_bo_([snd,s])),
  b_bo_i_3: ([fst, snd, s]) => [cssObj("blue bold italic", fst, false)].concat(pP.b_bo_i_([snd,s])),
}
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "s", "symbols": [(lexer.has("r") ? {type: "r"} : r), "r"], "postprocess": pP.r},
    {"name": "s", "symbols": [(lexer.has("g") ? {type: "g"} : g), "s"], "postprocess": pP.g},
    {"name": "s", "symbols": [(lexer.has("b") ? {type: "b"} : b), "s"], "postprocess": pP.b},
    {"name": "s", "symbols": [(lexer.has("char") ? {type: "char"} : char), "s"], "postprocess": pP.s},
    {"name": "s", "symbols": []},
    {"name": "r", "symbols": [(lexer.has("r") ? {type: "r"} : r), "s"], "postprocess": pP.r},
    {"name": "r", "symbols": [(lexer.has("g") ? {type: "g"} : g), "r"], "postprocess": pP.r},
    {"name": "r", "symbols": [(lexer.has("b") ? {type: "b"} : b), "r"], "postprocess": pP.r},
    {"name": "r", "symbols": [(lexer.has("char") ? {type: "char"} : char), "r"], "postprocess": pP.r_},
    {"name": "r", "symbols": []}
]
  , ParserStart: "s"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
