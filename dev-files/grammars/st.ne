s -> "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" bo_i {% pP.bo_i %}
  | "**" bo {% pP.bo %}
  | "*" i {% pP.i %}
  | char s {% pP.s %}
  | error s {% ([err, s]) => err.concat(s) %}
  | null

r -> "<r>"i s {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" r_bo_i {% pP.r_bo_i %}
  | "**" r_bo {% pP.r_bo %}
  | "*" r_i {% pP.r_i %}
  | char r {% pP.r_ %}
  | error r {% ([err, s]) => err.concat(s) %}
  | null

g -> "<r>"i r {% pP.r %}
  | "<g>"i s {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" g_bo_i {% pP.g_bo_i %}
  | "**" g_bo {% pP.g_bo %}
  | "*" g_i {% pP.g_i %}
  | char g {% pP.g_ %}
  | error g {% ([err, s]) => err.concat(s) %}
  | null

b -> "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i s {% pP.b %}
  | "***" b_bo_i {% pP.b_bo_i %}
  | "**" b_bo {% pP.b_bo %}
  | "*" b_i {% pP.b_i %}
  | char b {% pP.b_ %}
  | error b {% ([err, s]) => err.concat(s) %}
  | null

i -> "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" bo {% pP.bo_i %}
  | "**" bo_i {% pP.bo_i %}
  | "*" s {% pP.i %}
  | char i {% pP.i_ %}
  | error i {% ([err, s]) => err.concat(s) %}
  | null

bo -> "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" i {% pP.bo_i %}
  | "**" s {% pP.bo %}
  | "*" i {% pP.i %}
  | char bo {% pP.bo_ %}
  | error bo {% ([err, s]) => err.concat(s) %}
  | null

bo_i -> "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" s {% pP.bo_i %}
  | "**" i {% pP.bo_i %}
  | "*" bo {% pP.bo_i %}
  | char bo_i {% pP.bo_i_ %}
  | error bo_i {% ([err, s]) => err.concat(s) %}
  | null

r_bo -> "<r>"i bo {% pP.r_bo %}
  | "<g>"i g_bo {% pP.g_bo %}
  | "<b>"i b_bo {% pP.b_bo %}
  | "***" r_i {% pP.r_i %}
  | "**" r {% pP.r_bo %}
  | "*" r_bo_i {% pP.r_bo_i %}
  | char r_bo {% pP.r_bo_ %}
  | error r_bo {% ([err, s]) => err.concat(s) %}
  | null

r_i -> "<r>"i i {% pP.r_i %}
  | "<g>"i g_i {% pP.g_i %}
  | "<b>"i b_i {% pP.b_i %}
  | "***" r_bo {% pP.r_bo %}
  | "**" r_bo_i {% pP.r_bo_i %}
  | "*" r {% pP.r_i %}
  | char r_i {% pP.r_i_ %}
  | error r_i {% ([err, s]) => err.concat(s) %}
  | null

r_bo_i -> "<r>"i bo_i {% pP.r_bo_i %}
  | "<g>"i g_bo_i {% pP.g_bo_i %}
  | "<b>"i b_bo_i {% pP.b_bo_i %}
  | "***" r {% pP.r_bo_i %}
  | "**" r_i {% pP.r_bo_i %}
  | "*" r_bo {% pP.r_bo_i %}
  | char r_bo_i {% pP.r_bo_i_ %}
  | error r_bo_i {% ([err, s]) => err.concat(s) %}
  | null

g_bo -> "<r>"i r_bo {% pP.r_bo %}
  | "<g>"i bo {% pP.g_bo %}
  | "<b>"i b_bo {% pP.b_bo %}
  | "***" g_i {% pP.g_i %}
  | "**" g {% pP.g_bo %}
  | "*" g_bo_i {% pP.g_bo_i %}
  | char g_bo {% pP.g_bo_ %}
  | error g_bo {% ([err, s]) => err.concat(s) %}
  | null

g_i -> "<r>"i r_i {% pP.r_i %}
  | "<g>"i i {% pP.g_i %}
  | "<b>"i b_i {% pP.b_i %}
  | "***" g_bo {% pP.g_bo %}
  | "**" g_bo_i {% pP.g_bo_i %}
  | "*" g {% pP.g_i %}
  | char g_i {% pP.g_i_ %}
  | error g_i {% ([err, s]) => err.concat(s) %}
  | null

g_bo_i -> "<r>"i r_bo_i {% pP.r_bo_i %}
  | "<g>"i bo_i {% pP.g_bo_i %}
  | "<b>"i b_bo_i {% pP.b_bo_i %}
  | "***" g {% pP.g_bo_i %}
  | "**" g_i {% pP.g_bo_i %}
  | "*" g_bo {% pP.g_bo_i %}
  | char g_bo_i {% pP.g_bo_i_ %}
  | error g_bo_i {% ([err, s]) => err.concat(s) %}
  | null

b_bo -> "<r>"i r_bo {% pP.r_bo %}
  | "<g>"i g_bo {% pP.g_bo %}
  | "<b>"i bo {% pP.b_bo %}
  | "***" b_i {% pP.b_i %}
  | "**" b {% pP.b_bo %}
  | "*" b_bo_i {% pP.b_bo_i %}
  | char b_bo {% pP.b_bo_ %}
  | error b_bo {% ([err, s]) => err.concat(s) %}
  | null

b_i -> "<r>"i r_i {% pP.r_i %}
  | "<g>"i g_i {% pP.g_i %}
  | "<b>"i i {% pP.b_i %}
  | "***" b_bo {% pP.b_bo %}
  | "**" b_bo_i {% pP.b_bo_i %}
  | "*" b {% pP.b_i %}
  | char b_i {% pP.b_i_ %}
  | error b_i {% ([err, s]) => err.concat(s) %}
  | null

b_bo_i -> "<r>"i r_bo_i {% pP.r_bo_i %}
  | "<g>"i g_bo_i {% pP.g_bo_i %}
  | "<b>"i bo_i {% pP.b_bo_i %}
  | "***" b {% pP.b_bo_i %}
  | "**" b_i {% pP.b_bo_i %}
  | "*" b_bo {% pP.b_bo_i %}
  | char b_bo_i {% pP.b_bo_i_ %}
  | error b_bo_i {% ([err, s]) => err.concat(s) %}
  | null
  
error -> "<" notColor {% pP.error %}
  | "<r" [^>] {% pP.error %}
  | "<g" [^>] {% pP.error %}
  | "<b" [^>] {% pP.error %}
  | [^<] "r>" {% pP.invError %}
  | [^<] "g>" {% pP.invError %}
  | [^<] "b>" {% pP.invError %}
  | notColor ">" {% pP.invError %}

notColor -> [^rgb]
char -> [^\[\]<>\*)] {% data => data[0] %}


@{%
const post = function (css, data, rest, isTerminal = true){
  return [
      {
        css,
        content: data,
        isTerminal
      }
    ].concat(rest);
}

const pP = {
  error: ([fst, d]) => post("error", fst, d),
  invError: ([fst, d]) => post("error", d, fst),

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
}
%}