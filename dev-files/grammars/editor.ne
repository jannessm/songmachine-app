@include "./dev-files/grammars/st.ne"

s -> %openingBr br s {% br %} | %closingBr s {% errorBr %} | %errorOpeningBr s {% errorBr %}
r -> %openingBr br r {% br %} | %closingBr r {% errorBr %} | %errorOpeningBr r {% errorBr %}
g -> %openingBr br g {% br %} | %closingBr g {% errorBr %} | %errorOpeningBr g {% errorBr %}
b -> %openingBr br b {% br %} | %closingBr b {% errorBr %} | %errorOpeningBr b {% errorBr %}
i -> %openingBr br i {% br %} | %closingBr i {% errorBr %} | %errorOpeningBr i {% errorBr %}
bo -> %openingBr br bo {% br %} | %closingBr bo {% errorBr %} | %errorOpeningBr bo {% errorBr %}
bo_i -> %openingBr br bo_i {% br %} | %closingBr bo_i {% errorBr %} | %errorOpeningBr bo_i {% errorBr %}
r_bo -> %openingBr br r_bo {% br %} | %closingBr r_bo {% errorBr %} | %errorOpeningBr r_bo {% errorBr %}
r_i -> %openingBr br r_i {% br %} | %closingBr r_i {% errorBr %} | %errorOpeningBr r_i {% errorBr %}
r_bo_i -> %openingBr br r_bo_i {% br %} | %closingBr r_bo_i {% errorBr %} | %errorOpeningBr r_bo_i {% errorBr %}
g_bo -> %openingBr br g_bo {% br %} | %closingBr g_bo {% errorBr %} | %errorOpeningBr g_bo {% errorBr %}
g_i -> %openingBr br g_i {% br %} | %closingBr g_i {% errorBr %} | %errorOpeningBr g_i {% errorBr %}
g_bo_i -> %openingBr br g_bo_i {% br %} | %closingBr g_bo_i {% errorBr %} | %errorOpeningBr g_bo_i {% errorBr %}
b_bo -> %openingBr br b_bo {% br %} | %closingBr b_bo {% errorBr %} | %errorOpeningBr b_bo {% errorBr %}
b_i -> %openingBr br b_i {% br %} | %closingBr b_i {% errorBr %} | %errorOpeningBr b_i {% errorBr %}
b_bo_i -> %openingBr br b_bo_i {% br %} | %closingBr b_bo_i {% errorBr %} | %errorOpeningBr b_bo_i {% errorBr %}

br -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_bo_i {% pP.br_bo_i %}
  | %bo br_bo {% pP.br_bo %}
  | %i br_i {% pP.br_i %}
  | %char br {% inBrackets %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br {% inBrackets %}

br_r -> %r br {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_r_bo_i {% pP.r_bo_i %}
  | %bo br_r_bo {% pP.r_bo %}
  | %i br_r_i {% pP.r_i %}
  | %char br_r {% pP.r_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_r {% pP.r_ %}

br_g -> %r br_r {% pP.r %}
  | %g br {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_g_bo_i {% pP.g_bo_i %}
  | %bo br_g_bo {% pP.g_bo %}
  | %i br_g_i {% pP.g_i %}
  | %char br_g {% pP.g_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_g {% pP.g_ %}

br_b -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br {% pP.b %}
  | %bo_i br_b_bo_i {% pP.b_bo_i %}
  | %bo br_b_bo {% pP.b_bo %}
  | %i br_b_i {% pP.b_i %}
  | %char br_b {% pP.b_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_b {% pP.b_ %}

br_i -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_bo {% pP.br_bo %}
  | %bo br_bo_i {% pP.br_bo_i %}
  | %i br {% pP.br_i %}
  | %char br_i {% pP.br_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_i {% pP.br_i_ %}

br_bo -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_i {% pP.br_i %}
  | %bo br {% pP.br_bo %}
  | %i br_bo_i {% pP.br_bo_i %}
  | %char br_bo {% pP.br_bo_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_bo {% pP.br_bo_ %}

br_bo_i -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br {% pP.br_bo_i %}
  | %bo br_i {% pP.br_bo_i %}
  | %i br_bo {% pP.br_bo_i %}
  | %char br_bo_i {% pP.br_bo_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_bo_i {% pP.br_bo_i_ %}

br_r_bo -> %r br_bo {% pP.r_bo %}
  | %g br_g_bo {% pP.g_bo %}
  | %b br_b_bo {% pP.b_bo %}
  | %bo_i br_r_i {% pP.r_i %}
  | %bo br_r {% pP.r_bo %}
  | %i br_r_bo_i {% pP.r_bo_i %}
  | %char br_r_bo {% pP.r_bo_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_r_bo {% pP.r_bo_ %}

br_r_i -> %r br_i {% pP.r_i %}
  | %g br_g_i {% pP.g_i %}
  | %b br_b_i {% pP.b_i %}
  | %bo_i br_r_bo {% pP.r_bo %}
  | %bo br_r_bo_i {% pP.r_bo_i %}
  | %i br_r {% pP.r_i %}
  | %char br_r_i {% pP.r_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_r_i {% pP.r_i_ %}

br_r_bo_i -> %r br_bo_i {% pP.r_bo_i %}
  | %g br_g_bo_i {% pP.g_bo_i %}
  | %b br_b_bo_i {% pP.b_bo_i %}
  | %bo_i br_r {% pP.r_bo_i %}
  | %bo br_r_i {% pP.r_bo_i %}
  | %i br_r_bo {% pP.r_bo_i %}
  | %char br_r_bo_i {% pP.r_bo_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_r_bo_i {% pP.r_bo_i_ %}

br_g_bo -> %r br_r_bo {% pP.r_bo %}
  | %g br_bo {% pP.g_bo %}
  | %b br_b_bo {% pP.b_bo %}
  | %bo_i br_g_i {% pP.g_i %}
  | %bo br_g {% pP.g_bo %}
  | %i br_g_bo_i {% pP.g_bo_i %}
  | %char br_g_bo {% pP.g_bo_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_g_bo_ {% pP.g_bo_ %}

br_g_i -> %r br_r_i {% pP.r_i %}
  | %g br_i {% pP.g_i %}
  | %b br_b_i {% pP.b_i %}
  | %bo_i br_g_bo {% pP.g_bo %}
  | %bo br_g_bo_i {% pP.g_bo_i %}
  | %i br_g {% pP.g_i %}
  | %char br_g_i {% pP.g_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_g_i {% pP.g_i_ %}

br_g_bo_i -> %r br_r_bo_i {% pP.r_bo_i %}
  | %g br_bo_i {% pP.g_bo_i %}
  | %b br_b_bo_i {% pP.b_bo_i %}
  | %bo_i br_g {% pP.g_bo_i %}
  | %bo br_g_i {% pP.g_bo_i %}
  | %i br_g_bo {% pP.g_bo_i %}
  | %char br_g_bo_i {% pP.g_bo_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_g_bo_i {% pP.g_bo_i_ %}

br_b_bo -> %r br_r_bo {% pP.r_bo %}
  | %g br_g_bo {% pP.g_bo %}
  | %b br_bo {% pP.b_bo %}
  | %bo_i br_b_i {% pP.b_i %}
  | %bo br_b {% pP.b_bo %}
  | %i br_b_bo_i {% pP.b_bo_i %}
  | %char br_b_bo {% pP.b_bo_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_b_bo {% pP.b_bo_ %}

br_b_i -> %r br_r_i {% pP.r_i %}
  | %g br_g_i {% pP.g_i %}
  | %b br_i {% pP.b_i %}
  | %bo_i br_b_bo {% pP.b_bo %}
  | %bo br_b_bo_i {% pP.b_bo_i %}
  | %i br_b {% pP.b_i %}
  | %char br_b_i {% pP.b_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_b_i {% pP.b_i_ %}

br_b_bo_i -> %r br_r_bo_i {% pP.r_bo_i %}
  | %g br_g_bo_i {% pP.g_bo_i %}
  | %b br_bo_i {% pP.b_bo_i %}
  | %bo_i br_b {% pP.b_bo_i %}
  | %bo br_b_i {% pP.b_bo_i %}
  | %i br_b_bo {% pP.b_bo_i %}
  | %char br_b_bo_i {% pP.b_bo_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}
  | %noTag br_b_bo_i {% pP.b_bo_i_ %}

@{%
  const inBrackets = ([fst, rest]) => [
    {
      css: 'orange',
      content: fst.value,
      isTerminal: false
    }
  ].concat(rest);

  const br = function([fst, br, s]) {
    const openBr = fst.value;
    return [
        {
          css: 'grey',
          content: openBr,
          isTerminal: false
        }
      ]
      .concat(br)
      .concat(s)
  }

  const errorBr = function(data) {
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

  Object.assign(pP, {
    br_bo: ([fst, d]) => post("orange bold", fst.value, d),
    br_i: ([fst, d]) => post("orange italic", fst.value, d),
    br_bo_i: ([fst, d]) => post("orange bold italic", fst.value, d),

    br_bo_: ([fst, d]) => post("orange bold", fst.value, d, false),
    br_i_: ([fst, d]) => post("orange italic", fst.value, d, false),
    br_bo_i_: ([fst, d]) => post("orange bold italic", fst.value, d, false),
  });
%}