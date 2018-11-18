export const GramarSt = {
  red: {
    id: 1,
    regex: /^<r>/gi
  },
  green: {
    id: 2,
    regex: /^<g>/gi
  },
  blue: {
    id: 3,
    regex: /^<b>/gi
  },
  italic: {
    id: 4,
    regex: /^\*/g
  },
  bold: {
    id: 5,
    regex: /^\*\*/g
  },
  boldItalic: {
    id: 6,
    regex: /^\*\*\*/g
  },
  'S' : ['S', 'R', 'G', 'B', 'I', 'Bo', 'BoI'],

  'R' : ['R', 'S', 'G', 'B', 'RI', 'RBo', 'RBoI'],
  'G' : ['G', 'R', 'S', 'B', 'GI', 'GBo', 'GBoI'],
  'B' : ['B', 'R', 'G', 'S', 'BI', 'BBo', 'BBoI'],
  'Bo': ['Bo', 'RBo', 'GBo', 'BBo', 'BoI', 'S', 'I'],
  'I' : ['I', 'RI', 'GI', 'BI', 'S', 'BoI', 'Bo'],

  'RI' : ['RI', 'I', 'GI', 'B', 'R', 'RBoI', 'RBo'],
  'GI' : ['GI', 'RI', 'I', 'B', 'G', 'GBoI', 'GBo'],
  'BI' : ['BI', 'RI', 'GI', 'B', 'B', 'BBoI', 'BBo'],
  'BoI' : ['BoI', 'RBoI', 'GBoI', 'BBoI', 'Bo', 'I', 'S'],

  'RBo' : ['RBo', 'Bo', 'GBo', 'BBo', 'RBoI', 'R', 'RI'],
  'GBo' : ['GBo', 'RBo', 'Bo', 'BBo', 'GBoI', 'G', 'GI'],
  'BBo' : ['BBo', 'RBo', 'GBo', 'Bo', 'BBoI', 'B', 'BI'],

  'RBoI' : ['RBoI', 'BoI', 'GBoI', 'BBoI', 'RBo', 'RI', 'R'],
  'GBoI' : ['GBoI', 'RBoI', 'BoI', 'BBoI', 'GBo', 'GI', 'G'],
  'BBoI' : ['BBoI', 'RBoI', 'GBoI', 'BoI', 'BBo', 'BI', 'B']
};
