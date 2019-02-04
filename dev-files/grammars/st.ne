@{%
const moo = require("moo");

const lexer = moo.compile({
  char: {match: /[^\[\]<>\*]/, lineBreaks: true},
  r: /<(?:r|R)>/,
  g: /<(?:g|G)>/,
  b: /<(?:b|B)>/,
  bo_i: /\*\*\*/,
  bo: /\*\*/,
  i: /\*/,
  noTag: /(?:(?!<)[^\*]?>)|(?:<[^\*]?(?!>))/,
});
%}
@lexer lexer

s -> %r r {% pP.r %}
  | %g g {% pP.g %}
  | %b b {% pP.b %}
  | %i i {% pP.i %}
  | %bo bo {% pP.bo %}
  | %bo_i bo_i {% pP.bo_i %}
  | %char s {% pP.s %}
  | %noTag s {% pP.s %}
  | null

r -> %r s {% pP.r %}
  | %g g {% pP.g %}
  | %b b {% pP.b %}
  | %i r_i {% pP.r_i %}
  | %bo r_bo {% pP.r_bo %}
  | %bo_i r_bo_i {% pP.r_bo_i %}
  | %char r {% pP.r_ %}
  | %noTag r {% pP.r_ %}
  | null

g -> %r r {% pP.r %}
  | %g s {% pP.g %}
  | %b b {% pP.b %}
  | %i g_i {% pP.g_i %}
  | %bo g_bo {% pP.g_bo %}
  | %bo_i g_bo_i {% pP.g_bo_i %}
  | %char g {% pP.g_ %}
  | %noTag g {% pP.g_ %}
  | null

b -> %r r {% pP.r %}
  | %g g {% pP.g %}
  | %b s {% pP.b %}
  | %i b_i {% pP.b_i %}
  | %bo b_bo {% pP.b_bo %}
  | %bo_i b_bo_i {% pP.b_bo_i %}
  | %char b {% pP.b_ %}
  | %noTag b {% pP.b_ %}
  | null

i -> %r r_i {% pP.r_i %}
  | %g g_i {% pP.g_i %}
  | %b b_i {% pP.b_i %}
  | %i s {% pP.i %}
  | %bo bo_i {% pP.bo_i %}
  | %bo_i bo {% pP.bo_i %}
  | %char i {% pP.i_ %}
  | %noTag i {% pP.i_ %}
  | null

bo -> %r r_bo {% pP.r_bo %}
  | %g g_bo {% pP.g_bo %}
  | %b b_bo {% pP.b_bo %}
  | %i bo_i {% pP.bo_i %}
  | %bo s {% pP.bo %}
  | %bo_i i {% pP.bo_i %}
  | %char bo {% pP.bo_ %}
  | %noTag bo {% pP.bo_ %}
  | null

bo_i -> %r r_bo_i {% pP.r_bo_i %}
  | %g g_bo_i {% pP.g_bo_i %}
  | %b b_bo_i {% pP.b_bo_i %}
  | %i bo {% pP.bo_i %}
  | %bo i {% pP.bo_i %}
  | %bo_i s {% pP.bo_i %}
  | %char bo_i {% pP.bo_i_ %}
  | %noTag bo_i {% pP.bo_i_ %}
  | null

r_i -> %r i {% pP.r_i %}
  | %g g_i {% pP.g_i %}
  | %b b_i {% pP.b_i %}
  | %i r {% pP.r_i %}
  | %bo r_bo_i {% pP.r_bo_i %}
  | %bo_i r_bo {% pP.r_bo %}
  | %char r_i {% pP.r_i_ %}
  | %noTag r_i {% pP.r_i_ %}
  | null

r_bo -> %r bo {% pP.r_bo %}
  | %g g_bo {% pP.g_bo %}
  | %b b_bo {% pP.b_bo %}
  | %i r_bo_i {% pP.r_bo_i %}
  | %bo r {% pP.r_bo %}
  | %bo_i r_i {% pP.r_bo_i %}
  | %char r_bo {% pP.r_bo_ %}
  | %noTag r_bo {% pP.r_bo_ %}
  | null

r_bo_i -> %r bo_i {% pP.r_bo_i %}
  | %g g_bo_i {% pP.g_bo_i %}
  | %b b_bo_i {% pP.b_bo_i %}
  | %i r_bo {% pP.r_bo %}
  | %bo r_i {% pP.r_bo_i %}
  | %bo_i r {% pP.r_bo_i %}
  | %char r_bo_i {% pP.r_bo_i_ %}
  | %noTag r_bo_i {% pP.r_bo_i_ %}
  | null

g_i -> %r r_i {% pP.r_i %}
  | %g i {% pP.g_i %}
  | %b b_i {% pP.b_i %}
  | %i g {% pP.g_i %}
  | %bo g_bo_i {% pP.g_bo_i %}
  | %bo_i g_bo {% pP.g_bo %}
  | %char g_i {% pP.g_i_ %}
  | %noTag g_i {% pP.g_i_ %}
  | null

g_bo -> %r r_bo {% pP.r_bo %}
  | %g bo {% pP.g_bo %}
  | %b b_bo {% pP.b_bo %}
  | %i g_bo_i {% pP.g_bo_i %}
  | %bo g {% pP.g_bo %}
  | %bo_i g_i {% pP.g_bo_i %}
  | %char g_bo {% pP.g_bo_ %}
  | %noTag g_bo {% pP.g_bo_ %}
  | null

g_bo_i -> %r bo_i {% pP.r_bo_i %}
  | %g bo_i {% pP.g_bo_i %}
  | %b b_bo_i {% pP.b_bo_i %}
  | %i g_bo {% pP.g_bo %}
  | %bo g_i {% pP.g_bo_i %}
  | %bo_i g {% pP.g_bo_i %}
  | %char g_bo_i {% pP.g_bo_i_ %}
  | %noTag g_bo_i {% pP.g_bo_i_ %}
  | null

b_i -> %r r_i {% pP.r_i %}
  | %g g_i {% pP.g_i %}
  | %b i {% pP.b_i %}
  | %i b {% pP.b_i %}
  | %bo b_bo_i {% pP.b_bo_i %}
  | %bo_i b_bo {% pP.b_bo %}
  | %char b_i {% pP.b_i_ %}
  | %noTag b_i {% pP.b_i_ %}
  | null

b_bo -> %r r_bo {% pP.r_bo %}
  | %g g_bo {% pP.g_bo %}
  | %b bo {% pP.b_bo %}
  | %i b_bo_i {% pP.b_bo_i %}
  | %bo b {% pP.b_bo %}
  | %bo_i b_i {% pP.b_bo_i %}
  | %char b_bo {% pP.b_bo_ %}
  | %noTag b_bo {% pP.b_bo_ %}
  | null

b_bo_i -> %r r_bo_i {% pP.r_bo_i %}
  | %g g_bo_i {% pP.g_bo_i %}
  | %b bo_i {% pP.b_bo_i %}
  | %i b_bo {% pP.b_bo %}
  | %bo b_i {% pP.b_bo_i %}
  | %bo_i b {% pP.b_bo_i %}
  | %char b_bo_i {% pP.b_bo_i_ %}
  | %noTag b_bo_i {% pP.b_bo_i_ %}
  | null

@{%
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
%}