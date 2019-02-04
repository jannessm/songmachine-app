
s -> "<" {% pP.s %}
  | "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "<" [^rgbRGB>] s {% pP.s3 %}
  | "<" [rgbRGB] s {% pP.s3 %}
  | [^rgbRGB] ">" s {% pP.s3 %}
  | [rgbRGB] ">" s {% pP.s3 %}
  | "***" bo_i {% pP.bo_i %}
  | "**" [^*] bo {% pP.bo3 %}
  | "*" [^*] i {% pP.i3 %}
  | [^*] "**" bo {% pP.bo3 %}
  | [^*] "*" i {% pP.i3 %}
  | char s {% pP.s %}
  | null

r -> "<" {% ([fst]) => [cssObj("red", fst, false)] %}
  | "<r>"i s {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "<" [^rgbRGB>] r {% pP.r_3 %}
  | "<" [rgbRGB] r {% pP.r_3 %}
  | [^rgbRGB] ">" r {% pP.r_3 %}
  | [rgbRGB] ">" r {% pP.r_3 %}
  | "***" r_bo_i {% pP.r_bo_i %}
  | "**" [^*] r_bo {% pP.r_bo3 %}
  | "*" [^*] r_i {% pP.r_i3 %}
  | [^*] "**" r_bo {% pP.r_bo3 %}
  | [^*] "*" r_i {% pP.r_i3 %}
  | char r {% pP.r_ %}
  | null

g -> "<" {% ([fst]) => [cssObj("green", fst, false)] %}
  | "<r>"i r {% pP.r %}
  | "<g>"i s {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "<" [^rgbRGB>] g {% pP.g_3 %}
  | "<" [rgbRGB] g {% pP.g_3 %}
  | [^rgbRGB] ">" g {% pP.g_3 %}
  | [rgbRGB] ">" g {% pP.g_3 %}
  | "***" g_bo_i {% pP.g_bo_i %}
  | "**" [^*] g_bo {% pP.g_bo3 %}
  | "*" [^*] g_i {% pP.g_i3 %}
  | [^*] "**" g_bo {% pP.g_bo3 %}
  | [^*] "*" g_i {% pP.g_i3 %}
  | char g {% pP.g_ %}
  | null

b -> "<" {% ([fst]) => [cssObj("blue", fst, false)] %}
  | "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i s {% pP.b %}
  | "<" [^rgbRGB>] b {% pP.b_3 %}
  | "<" [rgbRGB] b {% pP.b_3 %}
  | [^rgbRGB] ">" b {% pP.b_3 %}
  | [rgbRGB] ">" b {% pP.b_3 %}
  | "***" b_bo_i {% pP.b_bo_i %}
  | "**" [^*] b_bo {% pP.b_bo3 %}
  | "*" [^*] b_i {% pP.b_i3 %}
  | [^*] "**" b_bo {% pP.b_bo3 %}
  | [^*] "*" b_i {% pP.b_i3 %}
  | char b {% pP.b_ %}
  | null

i -> "<" {% ([fst]) => [cssObj("italic", fst, false)] %}
  | "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "<" [^rgbRGB>] i {% pP.i_3 %}
  | "<" [rgbRGB] i {% pP.i_3 %}
  | [^rgbRGB] ">" i {% pP.i_3 %}
  | [rgbRGB] ">" i {% pP.i_3 %}
  | "***" bo {% pP.bo_i %}
  | "**" [^*] bo_i {% pP.bo_i3 %}
  | "*" [^*] s {% pP.s3 %}
  | [^*] "**" bo_i {% pP.bo_i3 %}
  | [^*] "*" s {% pP.s3 %}
  | char i {% pP.i_ %}
  | null

bo -> "<" {% ([fst]) => [cssObj("bold", fst, false)] %}
  | "<r>"i r_i {% pP.r_i %}
  | "<g>"i g_i {% pP.g_i %}
  | "<b>"i b_i {% pP.b_i %}
  | "<" [^rgbRGB>] bo {% pP.bo_3 %}
  | "<" [rgbRGB] bo {% pP.bo_3 %}
  | [^rgbRGB] ">" bo {% pP.bo_3 %}
  | [rgbRGB] ">" bo {% pP.bo_3 %}
  | "***" i {% pP.bo_i %}
  | "**" [^*] s {% pP.bo3 %}
  | "*" [^*] bo_i {% pP.bo_i3 %}
  | [^*] "**" s {% pP.bo3 %}
  | [^*] "*" bo_i {% pP.bo_i3 %}
  | char bo {% pP.bo_ %}
  | null

bo_i -> "<" {% ([fst]) => [cssObj("bold italic", fst, false)] %}
  | "<r>"i r_bo_i {% pP.r_bo_i %}
  | "<g>"i g_bo_i {% pP.g_bo_i %}
  | "<b>"i b_bo_i {% pP.b_bo_i %}
  | "<" [^rgbRGB>] bo_i {% pP.bo_i_3 %}
  | "<" [rgbRGB] bo_i {% pP.bo_i_3 %}
  | [^rgbRGB] ">" bo_i {% pP.bo_i_3 %}
  | [rgbRGB] ">" bo_i {% pP.bo_i_3 %}
  | "***" s {% pP.bo_i %}
  | "**" [^*] i {% pP.bo_i3 %}
  | "*" [^*] bo {% pP.bo_i3 %}
  | [^*] "**" i {% pP.i3 %}
  | [^*] "*" bo {% pP.bo3 %}
  | char bo_i {% pP.bo_i_ %}
  | null

r_bo -> "<" {% ([fst]) => [cssObj("red bold", fst, false)] %}
  | "<r>"i bo {% pP.r_bo %}
  | "<g>"i g_bo {% pP.g_bo %}
  | "<b>"i b_bo {% pP.b_bo %}
  | "<" [^rgbRGB>] r_bo {% pP.r_bo_3 %}
  | "<" [rgbRGB] r_bo {% pP.r_bo_3 %}
  | [^rgbRGB] ">" r_bo {% pP.r_bo_3 %}
  | [rgbRGB] ">" r_bo {% pP.r_bo_3 %}
  | "***" r_i {% pP.r_i %}
  | "**" [^*] r {% pP.r_bo3 %}
  | "*" [^*] r_i {% pP.r_i3 %}
  | [^*] "**" r {% pP.r_bo3 %}
  | [^*] "*" r_i {% pP.r_i3 %}
  | char r_bo {% pP.r_bo_ %}
  | null

r_i -> "<" {% ([fst]) => [cssObj("red italic", fst, false)] %}
  | "<r>"i i {% pP.r_i %}
  | "<g>"i g_i {% pP.g_i %}
  | "<b>"i b_i {% pP.b_i %}
  | "<" [^rgbRGB>] r_i {% pP.r_i_3 %}
  | "<" [rgbRGB] r_i {% pP.r_i_3 %}
  | [^rgbRGB] ">" r_i {% pP.r_i_3 %}
  | [rgbRGB] ">" r_i {% pP.r_i_3 %}
  | "***" r_bo {% pP.r_bo %}
  | "**" [^*] r_bo_i {% pP.r_bo_i3 %}
  | "*" [^*] r_bo_i {% pP.r_bo_i3 %}
  | [^*] "**" r_bo_i {% pP.r_bo_i3 %}
  | [^*] "*" r_bo_i {% pP.r_bo_i3 %}
  | char r_i {% pP.r_i_ %}
  | null

r_bo_i -> "<" {% ([fst]) => [cssObj("red bold italic", fst, false)] %}
  | "<r>"i bo_i {% pP.r_bo_i %}
  | "<g>"i g_bo_i {% pP.g_bo_i %}
  | "<b>"i b_bo_i {% pP.b_bo_i %}
  | "<" [^rgbRGB>] r_bo_i {% pP.r_bo_i_3 %}
  | "<" [rgbRGB] r_bo_i {% pP.r_bo_i_3 %}
  | [^rgbRGB] ">" r_bo_i {% pP.r_bo_i_3 %}
  | [rgbRGB] ">" r_bo_i {% pP.r_bo_i_3 %}
  | "***" r {% pP.r_bo_i %}
  | "**" [^*] r_i {% pP.r_i3 %}
  | "*" [^*] r_bo {% pP.r_bo3 %}
  | [^*] "**" r_i {% pP.r_i3 %}
  | [^*] "*" r_bo {% pP.r_bo3 %}
  | char r_bo_i {% pP.r_bo_i_ %}
  | null

g_bo -> "<" {% ([fst]) => [cssObj("green bold", fst, false)] %}
  | "<r>"i r_bo {% pP.r_bo %}
  | "<g>"i bo {% pP.g_bo %}
  | "<b>"i b_bo {% pP.b_bo %}
  | "<" [^rgbRGB>] g_bo {% pP.g_bo_3 %}
  | "<" [rgbRGB] g_bo {% pP.g_bo_3 %}
  | [^rgbRGB] ">" g_bo {% pP.g_bo_3 %}
  | [rgbRGB] ">" g_bo {% pP.g_bo_3 %}
  | "***" g_i {% pP.g_i %}
  | "**" g {% pP.g_bo %}
  | "*" g_bo_i {% pP.g_bo_i %}
  | char g_bo {% pP.g_bo_ %}
  | null

g_i -> "<" {% ([fst]) => [cssObj("green italic", fst, false)] %}
  | "<r>"i r_i {% pP.r_i %}
  | "<g>"i i {% pP.g_i %}
  | "<b>"i b_i {% pP.b_i %}
  | "<" [^rgbRGB>] g_i {% pP.g_i_3 %}
  | "<" [rgbRGB] g_i {% pP.g_i_3 %}
  | [^rgbRGB] ">" g_i {% pP.g_i_3 %}
  | [rgbRGB] ">" g_i {% pP.g_i_3 %}
  | "***" g_bo {% pP.g_bo %}
  | "**" g_bo_i {% pP.g_bo_i %}
  | "*" g {% pP.g_i %}
  | char g_i {% pP.g_i_ %}
  | null

g_bo_i -> "<" {% ([fst]) => [cssObj("green bold italic", fst, false)] %}
  | "<r>"i r_bo_i {% pP.r_bo_i %}
  | "<g>"i bo_i {% pP.bo_i %}
  | "<b>"i b_bo_i {% pP.b_bo_i %}
  | "<" [^rgbRGB>] g_bo_i {% pP.g_bo_i_3 %}
  | "<" [rgbRGB] g_bo_i {% pP.g_bo_i_3 %}
  | [^rgbRGB] ">" g_bo_i {% pP.g_bo_i_3 %}
  | [rgbRGB] ">" g_bo_i {% pP.g_bo_i_3 %}
  | "***" g {% pP.g_bo_i %}
  | "**" g_i {% pP.g_bo_i %}
  | "*" g_bo {% pP.g_bo_i %}
  | char g_bo_i {% pP.g_bo_i_ %}
  | null

b_bo -> "<r>"i r_bo {% pP.r_bo %}
  | "<g>"i g_bo {% pP.g_bo %}
  | "<b>"i bo {% pP.b_bo %}
  | "***" b_i {% pP.b_i %}
  | "**" b {% pP.b_bo %}
  | "*" b_bo_i {% pP.b_bo_i %}
  | char b_bo {% pP.b_bo_ %}
  | null

b_i -> "<r>"i r_i {% pP.r_i %}
  | "<g>"i g_i {% pP.g_i %}
  | "<b>"i i {% pP.b_i %}
  | "***" b_bo {% pP.b_bo %}
  | "**" b_bo_i {% pP.b_bo_i %}
  | "*" b {% pP.b_i %}
  | char b_i {% pP.b_i_ %}
  | null

b_bo_i -> "<" {% ([fst]) => [cssObj("blue bold italic", fst, false)] %}
  | "<r>"i r_bo_i {% pP.r_bo_i %}
  | "<g>"i g_bo_i {% pP.g_bo_i %}
  | "<b>"i bo_i {% pP.b_bo_i %}
  | "<" [^rgbRGB>] b_bo_i {% pP.b_bo_i_3 %}
  | "<" [rgbRGB] b_bo_i {% pP.b_bo_i_3 %}
  | [^rgbRGB] ">" b_bo_i {% pP.b_bo_i_3 %}
  | [rgbRGB] ">" b_bo_i {% pP.b_bo_i_3 %}
  | "***" b {% pP.b_bo_i %}
  | "**" b_i {% pP.b_bo_i %}
  | "*" b_bo {% pP.b_bo_i %}
  | char b_bo_i {% pP.b_bo_i_ %}
  | null

char -> [^\[\]<>\*] {% data => data[0] %}


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
  error: ([fst, d]) => post("error", fst, d),
  invError: ([fst, d]) => post("error", d, fst).reverse(),

  s: ([fst, d]) => [fst].concat(d),
  r: ([fst, d])  => post("red", fst, d),
  g: ([fst, d]) => post("green", fst, d),
  b: ([fst, d]) => post("blue", fst, d),
  i: ([fst, d]) => post("italic", fst, d),
  bo: ([fst, d]) => post("bold", fst, d),
  bo_i: ([fst, d]) => post("bold italic", fst, d),
  r_i: ([fst, d]) => post("red italic", fst, d),
  r_bo: ([fst, d]) => post("red bold", fst, d),
  r_bo_i: ([fst, d]) => post("red bold italic", fst, d),
  g_i: ([fst, d]) => post("green italic", fst, d),
  g_bo: ([fst, d]) => post("green bold", fst, d),
  g_bo_i: ([fst, d]) => post("green bold italic", fst, d),
  b_i: ([fst, d]) => post("blue italic", fst, d),
  b_bo: ([fst, d]) => post("blue bold", fst, d),
  b_bo_i: ([fst, d]) => post("blue bold italic", fst, d),

  r_: ([fst, d])  => post("red", fst, d, false),
  g_: ([fst, d]) => post("green", fst, d, false),
  b_: ([fst, d]) => post("blue", fst, d, false),
  i_: ([fst, d]) => post("italic", fst, d, false),
  bo_: ([fst, d]) => post("bold", fst, d, false),
  bo_i_: ([fst, d]) => post("bold italic", fst, d, false),
  r_i_: ([fst, d]) => post("red italic", fst, d, false),
  r_bo_: ([fst, d]) => post("red bold", fst, d, false),
  r_bo_i_: ([fst, d]) => post("red bold italic", fst, d, false),
  g_i_: ([fst, d]) => post("green italic", fst, d, false),
  g_bo_: ([fst, d]) => post("green bold", fst, d, false),
  g_bo_i_: ([fst, d]) => post("green bold italic", fst, d, false),
  b_i_: ([fst, d]) => post("blue italic", fst, d, false),
  b_bo_: ([fst, d]) => post("blue bold", fst, d, false),
  b_bo_i_: ([fst, d]) => post("blue bold italic", fst, d, false),
	
  s3: ([fst, snd, s]) => [fst].concat(pP.s([snd,s])),
  i3: ([fst, snd, s]) => [cssObj('italic', fst)].concat(pP.i([snd,s])),
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