s -> char s {% ([char, s]) => [char].concat(s) %}
  | "[" br "]" s {% ([open, char, close, s]) =>  [{char, isChord: true}].concat(s) %}
  | null

br -> char s {% ([char, s]) => [char].concat(s) %} | null

char -> [^\[\]] {% data => data[0] %}