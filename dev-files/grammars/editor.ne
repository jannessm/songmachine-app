@include "./st.ne"

s -> "[" br "]" s {% brackets %}
r -> "[" br "]" r {% brackets %}
g -> "[" br "]" g {% brackets %}
b -> "[" br "]" b {% brackets %}
i -> "[" br "]" i {% brackets %}
bo -> "[" br "]" bo {% brackets %}

bo_i -> "[" br "]" bo_i {% brackets %}
r_bo -> "[" br "]" r_bo {% brackets %}
r_i -> "[" br "]" r_i {% brackets %}
r_bo_i -> "[" br "]" r_bo_i {% brackets %}
g_bo -> "[" br "]" g_bo {% brackets %}
g_i -> "[" br "]" g_i {% brackets %}
g_bo_i -> "[" br "]" g_bo_i {% brackets %}
b_bo -> "[" br "]" b_bo {% brackets %}
b_i -> "[" br "]" b_i {% brackets %}
b_bo_i -> "[" br "]" b_bo_i {% brackets %}

br -> "<r>"i br_r {% pP.r %}
  | "<g>"i br_g {% pP.g %}
  | "<b>"i br_b {% pP.b %}
  | "***" br_bo_i {% pP.bo_i %}
  | "**" br_bo {% pP.bo %}
  | "*" br_i {% pP.i %}
  | char br {% inBrackets %}
  | error br {% ([err, s]) => err.concat(s) %}
  | null

br_r -> "<r>"i br {% pP.r %}
  | "<b>"i br_b {% pP.b %}
  | "***" br_r_bo_i {% pP.r_bo_i %}
  | "**" br_r_bo {% pP.r_bo %}
  | "*" br_r_i {% pP.r_i %}
  | char br_r {% pP.r_ %}
  | error br_r {% ([err, s]) => err.concat(s) %}
  | null

br_g -> "<r>"i br_r {% pP.r %}
  | "<g>"i br {% pP.g %}
  | "<b>"i br_b {% pP.b %}
  | "***" br_g_bo_i {% pP.g_bo_i %}
  | "**" br_g_bo {% pP.g_bo %}
  | "*" br_g_i {% pP.g_i %}
  | char br_g {% pP.g_ %}
  | error br_g {% ([err, s]) => err.concat(s) %}
  | null

br_b -> "<r>"i br_r {% pP.r %}
  | "<g>"i br_g {% pP.g %}
  | "<b>"i br {% pP.b %}
  | "***" br_b_bo_i {% pP.b_bo_i %}
  | "**" br_b_bo {% pP.b_bo %}
  | "*" br_b_i {% pP.b_i %}
  | char br_b {% pP.b_ %}
  | error br_b {% ([err, s]) => err.concat(s) %}
  | null

br_i -> "<r>"i br_r {% pP.r %}
  | "<g>"i br_g {% pP.g %}
  | "<b>"i br_b {% pP.b %}
  | "***" br_bo {% pP.bo_i %}
  | "**" br_bo_i {% pP.bo_i %}
  | "*" br {% pP.i %}
  | char br_i {% pP.i_ %}
  | error br_i {% ([err, s]) => err.concat(s) %}
  | null

br_bo -> "<r>"i br_r {% pP.r %}
  | "<g>"i br_g {% pP.g %}
  | "<b>"i br_b {% pP.b %}
  | "***" br_i {% pP.bo_i %}
  | "**" br {% pP.bo %}
  | "*" br_i {% pP.i %}
  | char br_bo {% pP.bo_ %}
  | error br_bo {% ([err, s]) => err.concat(s) %}
  | null

br_bo_i -> "<r>"i br_r {% pP.r %}
  | "<g>"i br_g {% pP.g %}
  | "<b>"i br_b {% pP.b %}
  | "***" br {% pP.bo_i %}
  | "**" br_i {% pP.bo_i %}
  | "*" br_bo {% pP.bo_i %}
  | char br_bo_i {% pP.bo_i_ %}
  | error br_bo_i {% ([err, s]) => err.concat(s) %}
  | null

br_r_bo -> "<r>"i br_bo {% pP.r_bo %}
  | "<g>"i br_g_bo {% pP.g_bo %}
  | "<b>"i br_b_bo {% pP.b_bo %}
  | "***" br_r_i {% pP.r_i %}
  | "**" br_r {% pP.r_bo %}
  | "*" br_r_bo_i {% pP.r_bo_i %}
  | char br_r_bo {% pP.r_bo_ %}
  | error br_r_bo {% ([err, s]) => err.concat(s) %}
  | null

br_r_i -> "<r>"i br_i {% pP.r_i %}
  | "<g>"i br_g_i {% pP.g_i %}
  | "<b>"i br_b_i {% pP.b_i %}
  | "***" br_r_bo {% pP.r_bo %}
  | "**" br_r_bo_i {% pP.r_bo_i %}
  | "*" br_r {% pP.r_i %}
  | char br_r_i {% pP.r_i_ %}
  | error br_r_i {% ([err, s]) => err.concat(s) %}
  | null

br_r_bo_i -> "<r>"i br_bo_i {% pP.r_bo_i %}
  | "<g>"i br_g_bo_i {% pP.g_bo_i %}
  | "<b>"i br_b_bo_i {% pP.b_bo_i %}
  | "***" br_r {% pP.r_bo_i %}
  | "**" br_r_i {% pP.r_bo_i %}
  | "*" br_r_bo {% pP.r_bo_i %}
  | char br_r_bo_i {% pP.r_bo_i_ %}
  | error br_r_bo_i {% ([err, s]) => err.concat(s) %}
  | null

br_g_bo -> "<r>"i br_r_bo {% pP.r_bo %}
  | "<g>"i br_bo {% pP.g_bo %}
  | "<b>"i br_b_bo {% pP.b_bo %}
  | "***" br_g_i {% pP.g_i %}
  | "**" br_g {% pP.g_bo %}
  | "*" br_g_bo_i {% pP.g_bo_i %}
  | char br_g_bo {% pP.g_bo_ %}
  | error br_g_bo {% ([err, s]) => err.concat(s) %}
  | null

br_g_i -> "<r>"i br_r_i {% pP.r_i %}
  | "<g>"i br_i {% pP.g_i %}
  | "<b>"i br_b_i {% pP.b_i %}
  | "***" br_g_bo {% pP.g_bo %}
  | "**" br_g_bo_i {% pP.g_bo_i %}
  | "*" br_g {% pP.g_i %}
  | char br_g_i {% pP.g_i_ %}
  | error br_g_i {% ([err, s]) => err.concat(s) %}
  | null

br_g_bo_i -> "<r>"i br_r_bo_i {% pP.r_bo_i %}
  | "<g>"i br_bo_i {% pP.g_bo_i %}
  | "<b>"i br_b_bo_i {% pP.b_bo_i %}
  | "***" br_g {% pP.g_bo_i %}
  | "**" br_g_i {% pP.g_bo_i %}
  | "*" br_g_bo {% pP.g_bo_i %}
  | char br_g_bo_i {% pP.g_bo_i_ %}
  | error br_g_bo_i {% ([err, s]) => err.concat(s) %}
  | null

br_b_bo -> "<r>"i br_r_bo {% pP.r_bo %}
  | "<g>"i br_g_bo {% pP.g_bo %}
  | "<b>"i br_bo {% pP.b_bo %}
  | "***" br_b_i {% pP.b_i %}
  | "**" br_b {% pP.b_bo %}
  | "*" br_b_bo_i {% pP.b_bo_i %}
  | char br_b_bo {% pP.b_bo_ %}
  | error br_b_bo {% ([err, s]) => err.concat(s) %}
  | null

br_b_i -> "<r>"i br_r_i {% pP.r_i %}
  | "<g>"i br_g_i {% pP.g_i %}
  | "<b>"i br_i {% pP.b_i %}
  | "***" br_b_bo {% pP.b_bo %}
  | "**" br_b_bo_i {% pP.b_bo_i %}
  | "*" br_b {% pP.b_i %}
  | char br_b_i {% pP.b_i_ %}
  | error br_b_i {% ([err, s]) => err.concat(s) %}
  | null

br_b_bo_i -> "<r>"i br_r_bo_i {% pP.r_bo_i %}
  | "<g>"i br_g_bo_i {% pP.g_bo_i %}
  | "<b>"i br_bo_i {% pP.b_bo_i %}
  | "***" br_b {% pP.b_bo_i %}
  | "**" br_b_i {% pP.b_bo_i %}
  | "*" br_b_bo {% pP.b_bo_i %}
  | char br_b_bo_i {% pP.b_bo_i_ %}
  | error br_b_bo_i {% ([err, s]) => err.concat(s) %}
  | null

@{%
  const inBrackets = ([fst, rest]) => [
    {
      css: 'orange',
      content: fst,
      isTerminal: false
    }
  ].concat(rest);

  const brackets = function(data) {
    const openBr = data[0];
    const content = data[1];
    const closingBr = data[2];
    const rest = data[3];
    return [
        {
          css: 'grey',
          content: openBr,
          isTerminal: false
        }
      ]
      .concat(content)
      .concat({
        css: 'grey',
        content: closingBr,
        isTerminal: false
      })
      .concat(rest)
  }
%}