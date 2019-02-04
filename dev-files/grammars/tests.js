'use strict';

(function(){
  function cssObj(cssAbbrev, content, isTerminal = false){
    let css = [];
    css.push(/r/.test(cssAbbrev) ? 'red' : '');
    css.push(/g/.test(cssAbbrev) ? 'green' : '');
    css.push(/b/.test(cssAbbrev) ? 'blue' : '');
    css.push(/o/.test(cssAbbrev) ? 'bold' : '');
    css.push(/i/.test(cssAbbrev) ? 'italic' : '');
  
    return {
      css: css.filter(val => !!val).join(' '),
      content,
      isTerminal
    }
  }

  return {
  st: {
    colors: [
      [
        '<r>as<r>d',
        [cssObj('r', '<r>', true), cssObj('r', 'a'), cssObj('r', 's'), cssObj('r', '<r>', true), 'd']
      ], // wrapping
      ['r>asdf', 'r>asdf'.split('')], // start with not valid color
      ['>asdf', '>asdf'.split('')],
      ['<rasdf', ['<r'].concat('asdf'.split(''))],
      ['<asdf', ['<a'].concat('sdf'.split(''))],
      [
        '<r>asr>',
        [cssObj('r', '<r>', true), cssObj('r', 'a'), cssObj('r', 's'), cssObj('r', 'r'), cssObj('r', '>')]
      ], // end with not valid color
      [
        '<r>as>',
        [cssObj('r', '<r>', true), cssObj('r', 'a'), cssObj('r', 's'), cssObj('r', '>')]
      ], // end with not valid color
      [
        '<r>as<r',
        [cssObj('r', '<r>', true), cssObj('r', 'a'), cssObj('r', 's'), cssObj('r', '<r')]
      ], // end with not valid color
      [
        '<r>as<',
        [cssObj('r', '<r>', true), cssObj('r', 'a'), cssObj('r', 's'), cssObj('r', '<')]
      ], // end with not valid color
      [
        '<r><r>a',
        [cssObj('r', '<r>', true),cssObj('r', '<r>', true),'a']
      ], // color tags directly behind another
      [
        'd<r>a<g>b<b>c',
        ['d', cssObj('r', '<r>', true), cssObj('r', 'a'), cssObj('g', '<g>', true), cssObj('g', 'b'), cssObj('b', '<b>', true), cssObj('b', 'c')]
      ] // changing colors
    ],
    styles: [
      [
        'a***b***c', 
        ['a', cssObj('oi', '***', true), cssObj('oi', 'b'), cssObj('oi', '***', true), 'c']
      ], // bold and italic
      [
        'a**bc',
        ['a', cssObj('o', '**', true), cssObj('o', 'b'), cssObj('o', 'c')]
      ], // non closing
      [
        '*a',
        [cssObj('i', '*', true), cssObj('i', 'a')]
      ], // beginning
      [
        'a**',
        ['a', cssObj('o', '**', true)]
      ], // end
      [
        'a*b**c***d',
        ['a', cssObj('i', '*', true), cssObj('i', 'b'), cssObj('io', '**', true), cssObj('oi', 'c'), cssObj('oi', '***', true), 'd']
      ] // transitions
    ],
    "styles and colors": [
      [
        'd<r>a***b***c', 
        ['d', cssObj('r', '<r>', true), cssObj('r', 'a'), cssObj('roi', '***', true), cssObj('roi', 'b'), cssObj('roi', '***', true), cssObj('r', 'c')]
      ], // bold and italic
      [
        '<g>a**bc',
        [cssObj('g', '<g>', true), cssObj('g', 'a'), cssObj('go', '**', true), cssObj('go', 'b'), cssObj('go', 'c')]
      ], // non closing
      [
        '<*a',
        ['<', cssObj('i', '*', true), cssObj('i', 'a')]
      ], // beginning
      [
        '<b>*a',
        [cssObj('b', '<b>', true), cssObj('bi', '*', true), cssObj('bi', 'a')]
      ], // beginning
      [
        'a**r>',
        ['a', cssObj('o', '**', true), cssObj('o', 'r'), cssObj('o', '>')]
      ], // end
      [
        '<r>a*b<b>**c***d<b>f',
        [cssObj('r', '<r>', true), 
        cssObj('r', 'a'),
        cssObj('ri', '*', true),
        cssObj('ri', 'b'),
        cssObj('bi', '<b>', true),
        cssObj('bio', '**', true),
        cssObj('boi', 'c'),
        cssObj('boi', '***', true),
        cssObj('b', 'd'),
        cssObj('b', '<b>', true),'f']
      ] // transitions
    ]
  }
}})();