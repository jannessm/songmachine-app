@include "./dev-files/grammars/st.ne"

s -> %openingBr br s {% br %} | %closingBr s {% singleBr %} | %errorOpeningBr s {% singleBr %}
r -> %openingBr br r {% br %} | %closingBr r {% singleBr %} | %errorOpeningBr r {% singleBr %}
g -> %openingBr br g {% br %} | %closingBr g {% singleBr %} | %errorOpeningBr g {% singleBr %}
b -> %openingBr br b {% br %} | %closingBr b {% singleBr %} | %errorOpeningBr b {% singleBr %}
i -> %openingBr br i {% br %} | %closingBr i {% singleBr %} | %errorOpeningBr i {% singleBr %}
bo -> %openingBr br bo {% br %} | %closingBr bo {% singleBr %} | %errorOpeningBr bo {% singleBr %}
bo_i -> %openingBr br bo_i {% br %} | %closingBr bo_i {% singleBr %} | %errorOpeningBr bo_i {% singleBr %}
r_bo -> %openingBr br r_bo {% br %} | %closingBr r_bo {% singleBr %} | %errorOpeningBr r_bo {% singleBr %}
r_i -> %openingBr br r_i {% br %} | %closingBr r_i {% singleBr %} | %errorOpeningBr r_i {% singleBr %}
r_bo_i -> %openingBr br r_bo_i {% br %} | %closingBr r_bo_i {% singleBr %} | %errorOpeningBr r_bo_i {% singleBr %}
g_bo -> %openingBr br g_bo {% br %} | %closingBr g_bo {% singleBr %} | %errorOpeningBr g_bo {% singleBr %}
g_i -> %openingBr br g_i {% br %} | %closingBr g_i {% singleBr %} | %errorOpeningBr g_i {% singleBr %}
g_bo_i -> %openingBr br g_bo_i {% br %} | %closingBr g_bo_i {% singleBr %} | %errorOpeningBr g_bo_i {% singleBr %}
b_bo -> %openingBr br b_bo {% br %} | %closingBr b_bo {% singleBr %} | %errorOpeningBr b_bo {% singleBr %}
b_i -> %openingBr br b_i {% br %} | %closingBr b_i {% singleBr %} | %errorOpeningBr b_i {% singleBr %}
b_bo_i -> %openingBr br b_bo_i {% br %} | %closingBr b_bo_i {% singleBr %} | %errorOpeningBr b_bo_i {% singleBr %}

br -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_bo_i {% pP.bo_i %}
  | %bo br_bo {% pP.bo %}
  | %i br_i {% pP.i %}
  | %char br {% inBrackets %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_r -> %r br {% pP.r %}
  | %b br_b {% pP.b %}
  | %bo_i br_r_bo_i {% pP.r_bo_i %}
  | %bo br_r_bo {% pP.r_bo %}
  | %i br_r_i {% pP.r_i %}
  | %char br_r {% pP.r_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_g -> %r br_r {% pP.r %}
  | %g br {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_g_bo_i {% pP.g_bo_i %}
  | %bo br_g_bo {% pP.g_bo %}
  | %i br_g_i {% pP.g_i %}
  | %char br_g {% pP.g_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_b -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br {% pP.b %}
  | %bo_i br_b_bo_i {% pP.b_bo_i %}
  | %bo br_b_bo {% pP.b_bo %}
  | %i br_b_i {% pP.b_i %}
  | %char br_b {% pP.b_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_i -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_bo {% pP.bo_i %}
  | %bo br_bo_i {% pP.bo_i %}
  | %i br {% pP.i %}
  | %char br_i {% pP.i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_bo -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br_i {% pP.bo_i %}
  | %bo br {% pP.bo %}
  | %i br_i {% pP.i %}
  | %char br_bo {% pP.bo_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_bo_i -> %r br_r {% pP.r %}
  | %g br_g {% pP.g %}
  | %b br_b {% pP.b %}
  | %bo_i br {% pP.bo_i %}
  | %bo br_i {% pP.bo_i %}
  | %i br_bo {% pP.bo_i %}
  | %char br_bo_i {% pP.bo_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_r_bo -> %r br_bo {% pP.r_bo %}
  | %g br_g_bo {% pP.g_bo %}
  | %b br_b_bo {% pP.b_bo %}
  | %bo_i br_r_i {% pP.r_i %}
  | %bo br_r {% pP.r_bo %}
  | %i br_r_bo_i {% pP.r_bo_i %}
  | %char br_r_bo {% pP.r_bo_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_r_i -> %r br_i {% pP.r_i %}
  | %g br_g_i {% pP.g_i %}
  | %b br_b_i {% pP.b_i %}
  | %bo_i br_r_bo {% pP.r_bo %}
  | %bo br_r_bo_i {% pP.r_bo_i %}
  | %i br_r {% pP.r_i %}
  | %char br_r_i {% pP.r_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_r_bo_i -> %r br_bo_i {% pP.r_bo_i %}
  | %g br_g_bo_i {% pP.g_bo_i %}
  | %b br_b_bo_i {% pP.b_bo_i %}
  | %bo_i br_r {% pP.r_bo_i %}
  | %bo br_r_i {% pP.r_bo_i %}
  | %i br_r_bo {% pP.r_bo_i %}
  | %char br_r_bo_i {% pP.r_bo_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_g_bo -> %r br_r_bo {% pP.r_bo %}
  | %g br_bo {% pP.g_bo %}
  | %b br_b_bo {% pP.b_bo %}
  | %bo_i br_g_i {% pP.g_i %}
  | %bo br_g {% pP.g_bo %}
  | %i br_g_bo_i {% pP.g_bo_i %}
  | %char br_g_bo {% pP.g_bo_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_g_i -> %r br_r_i {% pP.r_i %}
  | %g br_i {% pP.g_i %}
  | %b br_b_i {% pP.b_i %}
  | %bo_i br_g_bo {% pP.g_bo %}
  | %bo br_g_bo_i {% pP.g_bo_i %}
  | %i br_g {% pP.g_i %}
  | %char br_g_i {% pP.g_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_g_bo_i -> %r br_r_bo_i {% pP.r_bo_i %}
  | %g br_bo_i {% pP.g_bo_i %}
  | %b br_b_bo_i {% pP.b_bo_i %}
  | %bo_i br_g {% pP.g_bo_i %}
  | %bo br_g_i {% pP.g_bo_i %}
  | %i br_g_bo {% pP.g_bo_i %}
  | %char br_g_bo_i {% pP.g_bo_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_b_bo -> %r br_r_bo {% pP.r_bo %}
  | %g br_g_bo {% pP.g_bo %}
  | %b br_bo {% pP.b_bo %}
  | %bo_i br_b_i {% pP.b_i %}
  | %bo br_b {% pP.b_bo %}
  | %i br_b_bo_i {% pP.b_bo_i %}
  | %char br_b_bo {% pP.b_bo_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_b_i -> %r br_r_i {% pP.r_i %}
  | %g br_g_i {% pP.g_i %}
  | %b br_i {% pP.b_i %}
  | %bo_i br_b_bo {% pP.b_bo %}
  | %bo br_b_bo_i {% pP.b_bo_i %}
  | %i br_b {% pP.b_i %}
  | %char br_b_i {% pP.b_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

br_b_bo_i -> %r br_r_bo_i {% pP.r_bo_i %}
  | %g br_g_bo_i {% pP.g_bo_i %}
  | %b br_bo_i {% pP.b_bo_i %}
  | %bo_i br_b {% pP.b_bo_i %}
  | %bo br_b_i {% pP.b_bo_i %}
  | %i br_b_bo {% pP.b_bo_i %}
  | %char br_b_bo_i {% pP.b_bo_i_ %}
  | %closingBr {% d => {return {css: 'grey', content:']', isTerminal: false}} %}

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