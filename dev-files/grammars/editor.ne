@include "./dev-files/grammars/st.ne"

s -> %openingBr br %closingBr s {% brackets %}
  | %errorOpeningBr s {% singleBr %}
  | %errorClosingBr s {% singleBr %}
r -> %openingBr br %closingBr r {% brackets %}
g -> %openingBr br %closingBr g {% brackets %}
b -> %openingBr br %closingBr b {% brackets %}
i -> %openingBr br %closingBr i {% brackets %}
bo -> %openingBr br %closingBr bo {% brackets %}

bo_i -> %openingBr br %closingBr bo_i {% brackets %}
r_bo -> %openingBr br %closingBr r_bo {% brackets %}
r_i -> %openingBr br %closingBr r_i {% brackets %}
r_bo_i -> %openingBr br %closingBr r_bo_i {% brackets %}
g_bo -> %openingBr br %closingBr g_bo {% brackets %}
g_i -> %openingBr br %closingBr g_i {% brackets %}
g_bo_i -> %openingBr br %closingBr g_bo_i {% brackets %}
b_bo -> %openingBr br %closingBr b_bo {% brackets %}
b_i -> %openingBr br %closingBr b_i {% brackets %}
b_bo_i -> %openingBr br %closingBr b_bo_i {% brackets %}

br -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_bo_i {% pP.bo_i %}
  | %bo br_bo {% pP.bo %}
  | %i br_i {% pP.i %}
  | %char br {% inBrackets %}
  | %errorClosingBr br {% singleBr %}
  | null

br_r -> %r br {% pP.r %}
  | %b br_b {% pP.b %}
  | %bo_i br_r_bo_i {% pP.r_bo_i %}
  | %bo br_r_bo {% pP.r_bo %}
  | %i br_r_i {% pP.r_i %}
  | %char br_r {% pP.r_ %}
  | error br_r {% ([err, s]) => err.concat(s) %}
  | null

br_g -> %r br_r {% pP.r %}
  | %g br {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_g_bo_i {% pP.g_bo_i %}
  | %bo br_g_bo {% pP.g_bo %}
  | %i br_g_i {% pP.g_i %}
  | %char br_g {% pP.g_ %}
  | error br_g {% ([err, s]) => err.concat(s) %}
  | null

br_b -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br {% pP.b %}
  | %bo_i br_b_bo_i {% pP.b_bo_i %}
  | %bo br_b_bo {% pP.b_bo %}
  | %i br_b_i {% pP.b_i %}
  | %char br_b {% pP.b_ %}
  | error br_b {% ([err, s]) => err.concat(s) %}
  | null

br_i -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_bo {% pP.bo_i %}
  | %bo br_bo_i {% pP.bo_i %}
  | %i br {% pP.i %}
  | %char br_i {% pP.i_ %}
  | error br_i {% ([err, s]) => err.concat(s) %}
  | null

br_bo -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_i {% pP.bo_i %}
  | %bo br {% pP.bo %}
  | %i br_i {% pP.i %}
  | %char br_bo {% pP.bo_ %}
  | error br_bo {% ([err, s]) => err.concat(s) %}
  | null

br_bo_i -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br {% pP.bo_i %}
  | %bo br_i {% pP.bo_i %}
  | %i br_bo {% pP.bo_i %}
  | %char br_bo_i {% pP.bo_i_ %}
  | error br_bo_i {% ([err, s]) => err.concat(s) %}
  | null

br_r_bo -> %r br_bo {% pP.r_bo %}
  | %g br_g_bo {% pP.g_bo %}
  | %b br_b_bo {% pP.b_bo %}
  | %bo_i br_r_i {% pP.r_i %}
  | %bo br_r {% pP.r_bo %}
  | %i br_r_bo_i {% pP.r_bo_i %}
  | %char br_r_bo {% pP.r_bo_ %}
  | error br_r_bo {% ([err, s]) => err.concat(s) %}
  | null

br_r_i -> %r br_i {% pP.r_i %}
  | %g br_g_i {% pP.g_i %}
  | %b br_b_i {% pP.b_i %}
  | %bo_i br_r_bo {% pP.r_bo %}
  | %bo br_r_bo_i {% pP.r_bo_i %}
  | %i br_r {% pP.r_i %}
  | %char br_r_i {% pP.r_i_ %}
  | error br_r_i {% ([err, s]) => err.concat(s) %}
  | null

br_r_bo_i -> %r br_bo_i {% pP.r_bo_i %}
  | %g br_g_bo_i {% pP.g_bo_i %}
  | %b br_b_bo_i {% pP.b_bo_i %}
  | %bo_i br_r {% pP.r_bo_i %}
  | %bo br_r_i {% pP.r_bo_i %}
  | %i br_r_bo {% pP.r_bo_i %}
  | %char br_r_bo_i {% pP.r_bo_i_ %}
  | error br_r_bo_i {% ([err, s]) => err.concat(s) %}
  | null

br_g_bo -> %r br_r_bo {% pP.r_bo %}
  | %g br_bo {% pP.g_bo %}
  | %b br_b_bo {% pP.b_bo %}
  | %bo_i br_g_i {% pP.g_i %}
  | %bo br_g {% pP.g_bo %}
  | %i br_g_bo_i {% pP.g_bo_i %}
  | %char br_g_bo {% pP.g_bo_ %}
  | error br_g_bo {% ([err, s]) => err.concat(s) %}
  | null

br_g_i -> %r br_r_i {% pP.r_i %}
  | %g br_i {% pP.g_i %}
  | %b br_b_i {% pP.b_i %}
  | %bo_i br_g_bo {% pP.g_bo %}
  | %bo br_g_bo_i {% pP.g_bo_i %}
  | %i br_g {% pP.g_i %}
  | %char br_g_i {% pP.g_i_ %}
  | error br_g_i {% ([err, s]) => err.concat(s) %}
  | null

br_g_bo_i -> %r br_r_bo_i {% pP.r_bo_i %}
  | %g br_bo_i {% pP.g_bo_i %}
  | %b br_b_bo_i {% pP.b_bo_i %}
  | %bo_i br_g {% pP.g_bo_i %}
  | %bo br_g_i {% pP.g_bo_i %}
  | %i br_g_bo {% pP.g_bo_i %}
  | %char br_g_bo_i {% pP.g_bo_i_ %}
  | error br_g_bo_i {% ([err, s]) => err.concat(s) %}
  | null

br_b_bo -> %r br_r_bo {% pP.r_bo %}
  | %g br_g_bo {% pP.g_bo %}
  | %b br_bo {% pP.b_bo %}
  | %bo_i br_b_i {% pP.b_i %}
  | %bo br_b {% pP.b_bo %}
  | %i br_b_bo_i {% pP.b_bo_i %}
  | %char br_b_bo {% pP.b_bo_ %}
  | error br_b_bo {% ([err, s]) => err.concat(s) %}
  | null

br_b_i -> %r br_r_i {% pP.r_i %}
  | %g br_g_i {% pP.g_i %}
  | %b br_i {% pP.b_i %}
  | %bo_i br_b_bo {% pP.b_bo %}
  | %bo br_b_bo_i {% pP.b_bo_i %}
  | %i br_b {% pP.b_i %}
  | %char br_b_i {% pP.b_i_ %}
  | error br_b_i {% ([err, s]) => err.concat(s) %}
  | null

br_b_bo_i -> %r br_r_bo_i {% pP.r_bo_i %}
  | %g br_g_bo_i {% pP.g_bo_i %}
  | %b br_bo_i {% pP.b_bo_i %}
  | %bo_i br_b {% pP.b_bo_i %}
  | %bo br_b_i {% pP.b_bo_i %}
  | %i br_b_bo {% pP.b_bo_i %}
  | %char br_b_bo_i {% pP.b_bo_i_ %}
  | error br_b_bo_i {% ([err, s]) => err.concat(s) %}
  | null

@{%
  const inBrackets = ([fst, rest]) => [
    {
      css: 'orange',
      content: fst.value,
      isTerminal: false
    }
  ].concat(rest);

  const brackets = function(data) {
    const openBr = data[0].value;
    const content = data[1];
    const closingBr = data[2].value;
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

  const singleBr = function(data) {
    const openBr = data[0].value;
    const content = data[1];
    return [
        {
          css: 'error',
          content: openBr,
          isTerminal: false
        }
      ]
      .concat(content)
  }
%}