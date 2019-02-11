@{%
const moo = require("moo");

const lexer = moo.compile({
  char: /[^<>\*\n]/,
  r: /<(?:r|R)>/,
  g: /<(?:g|G)>/,
  b: /<(?:b|B)>/,
  bo_i: /\*\*\*(?!\*)/,
  bo: /\*\*(?!\*)/,
  i: /\*(?!\*)/,
  noTag: /(?:(?!<)[^\*]?>)|(?:<[^\*]?(?!>))/
});
%}
@lexer lexer

s -> s %r {% pP.r %}
  | s %g {% pP.g %}
  | s %b {% pP.b %}
  | s %i {% pP.i %}
  | s %bo {% pP.bo %}
  | s %bo_i {% pP.bo_i %}
  | s %char {% pP.s %}
  | s %noTag {% pP.s %}
  | null {% resetState %}

@{%

var parsingState = {
  color: "",
  italic: false,
  bold: false,
  resetColor: false,
  resetItalic: false,
  resetBold: false
}

const resetState = function(data) {
  parsingState = {
    color: "",
    italic: false,
    bold: false,
    resetColor: false,
    resetItalic: false,
    resetBold: false
  };
  return data;
}

const getClasses = function() {
  let italic = parsingState.italic ? "italic" : "";
  let bold = parsingState.bold ? "bold" : "";
  
  let color = (!!parsingState.color || !!italic || !!bold) ? parsingState.color : 'text';
  if(parsingState.resetColor){
    parsingState.color = "";
    parsingState.resetColor = false;
  }
  if(parsingState.resetItalic){
    parsingState.italic = false;
    parsingState.resetItalic = false;
  }
  if(parsingState.resetBold){
    parsingState.bold = false;
    parsingState.resetBold = false;
  }
  return [color, italic, bold].filter(val => !!val).join(' ');
}

const setColor = function(color) {
  if (parsingState.color === color) {
    parsingState.resetColor = true;
  } else {
    parsingState.color = color;
  }
}

const cssObj = function(data, isTerminal = true) {
  const css = getClasses();
  if (css === 'text') {
    return data;
  }
	return {
    css,
    content: data,
    isTerminal
  }
}

const postProcessor = function (s, match, isTerminal = true){
  const next = s.concat([cssObj(match.value, isTerminal)]);
  return next;
}

const pP = {
  s: ([fst, d]) => {
    return postProcessor(fst, d, false);
  },
  r: ([fst, d])  => {
    setColor("red");
    return postProcessor(fst, d);
  },
  g: ([fst, d])  => {
    setColor("green");
    return postProcessor(fst, d);
  },
  b: ([fst, d])  => {
    setColor("blue");
    return postProcessor(fst, d);
  },
  i: ([fst, d])  => {
    if (parsingState.italic) {
      parsingState.resetItalic = true;
    } else {
      parsingState.italic = true;
    }
    return postProcessor(fst, d);
  },
  bo: ([fst, d])  => {
    if (parsingState.bold) {
      parsingState.resetBold = true;
    } else {
      parsingState.bold = true;
    }
    return postProcessor(fst, d);
  },
  bo_i: ([fst, d])  => {
    if (parsingState.italic) {
      parsingState.resetItalic = true;
    } else {
      parsingState.italic = true;
    }
    if (parsingState.bold) {
      parsingState.resetBold = true;
    } else {
      parsingState.bold = true;
    }
    return postProcessor(fst, d);
  }
}
%}