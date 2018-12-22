s -> "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" bo_i {% pP.bo_i %}
  | "**" bo {% pP.bo %}
  | "*" i {% pP.i %}
  | char s
  | null

r -> "<r>"i s {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" r_bo_i {% pP.r_bo_i %}
  | "**" r_bo {% pP.r_bo %}
  | "*" r_i {% pP.r_i %}
  | char r {% pP.r_ %}
  | null

g -> "<r>"i r {% pP.r %}
  | "<g>"i s {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" g_bo_i {% pP.g_bo_i %}
  | "**" g_bo {% pP.g_bo %}
  | "*" g_i {% pP.g_i %}
  | char g {% pP.g_ %}
  | null

b -> "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i s {% pP.b %}
  | "***" b_bo_i {% pP.b_bo_i %}
  | "**" b_bo {% pP.b_bo %}
  | "*" b_i {% pP.b_i %}
  | char b {% pP.b_ %}
  | null

i -> "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" bo {% pP.bo_i %}
  | "**" bo {% pP.bo %}
  | "*" s {% pP.i %}
  | char i {% pP.i_ %}
  | null

bo -> "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" i {% pP.bo_i %}
  | "**" s {% pP.bo %}
  | "*" i {% pP.i %}
  | char bo {% pP.bo_ %}
  | null

bo_i -> "<r>"i r {% pP.r %}
  | "<g>"i g {% pP.g %}
  | "<b>"i b {% pP.b %}
  | "***" s {% pP.bo_i %}
  | "**" i {% pP.bo_i %}
  | "*" bo {% pP.bo_i %}
  | char bo_i {% pP.bo_i_ %}
  | null

r_bo -> "<r>"i bo {% pP.r_bo %}
  | "<g>"i g_bo {% pP.g_bo %}
  | "<b>"i b_bo {% pP.b_bo %}
  | "***" r_i {% pP.r_i %}
  | "**" r {% pP.r_bo %}
  | "*" r_bo_i {% pP.r_bo_i %}
  | char r_bo {% pP.r_bo_ %}
  | null

r_i -> "<r>"i i {% pP.r_i %}
  | "<g>"i g_i {% pP.g_i %}
  | "<b>"i b_i {% pP.b_i %}
  | "***" r_bo {% pP.r_bo %}
  | "**" r_bo_i {% pP.r_bo_i %}
  | "*" r {% pP.r_i %}
  | char r_i {% pP.r_i_ %}
  | null

r_bo_i -> "<r>"i bo_i {% pP.r_bo_i %}
  | "<g>"i g_bo_i {% pP.g_bo_i %}
  | "<b>"i b_bo_i {% pP.b_bo_i %}
  | "***" r {% pP.r_bo_i %}
  | "**" r_i {% pP.r_bo_i %}
  | "*" r_bo {% pP.r_bo_i %}
  | char r_bo_i {% pP.r_bo_i_ %}
  | null

g_bo -> "<r>"i r_bo {% pP.r_bo %}
  | "<g>"i bo {% pP.g_bo %}
  | "<b>"i b_bo {% pP.b_bo %}
  | "***" g_i {% pP.g_i %}
  | "**" g {% pP.g_bo %}
  | "*" g_bo_i {% pP.g_bo_i %}
  | char g_bo {% pP.g_bo_ %}
  | null

g_i -> "<r>"i r_i {% pP.r_i %}
  | "<g>"i i {% pP.g_i %}
  | "<b>"i b_i {% pP.b_i %}
  | "***" g_bo {% pP.g_bo %}
  | "**" g_bo_i {% pP.g_bo_i %}
  | "*" g {% pP.g_i %}
  | char g_i {% pP.g_i_ %}
  | null

g_bo_i -> "<r>"i r_bo_i {% pP.r_bo_i %}
  | "<g>"i bo_i {% pP.g_bo_i %}
  | "<b>"i b_bo_i {% pP.b_bo_i %}
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

b_bo_i -> "<r>"i r_bo_i {% pP.r_bo_i %}
  | "<g>"i g_bo_i {% pP.g_bo_i %}
  | "<b>"i bo_i {% pP.b_bo_i %}
  | "***" b {% pP.b_bo_i %}
  | "**" b_i {% pP.b_bo_i %}
  | "*" b_bo {% pP.b_bo_i %}
  | char b_bo_i {% pP.b_bo_i_ %}
  | null
  
char -> 
    "r" {% data => data[0] %}
  | "g" {% data => data[0] %}
  | "b" {% data => data[0] %}
  | "<" {% data => data[0] %}
  | ">" {% data => data[0] %}
  | [^(<r>|<g>|<b>|\*)] {% data => data[0] %}

@{%
const post = function post(css, data, rest, isTerminal = true){
  return [
      {
        css: css,
        content: data,
        isTerminal
      },
      rest
    ]
}

const pP = {
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