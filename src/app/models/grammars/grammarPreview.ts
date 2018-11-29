import { Grammar } from './generalModels';

export const GrammarPreview: Grammar = {
  // IMPORTANT: sort regexs as they should be processed (e.g. italic should be after bold)
  start: 'S',
  cssClasses: {
    'S': 'normal',
    'R': 'red',
    'G': 'green',
    'B': 'blue',
    'Bo': 'bold',
    'I': 'italic',
    'RI': 'red italic',
    'GI': 'green italic',
    'BI': 'blue italic',
    'BoI': 'bold italic',
    'RBo': 'red bold',
    'GBo': 'green bold',
    'BBo': 'blue bold',
    'RBoI': 'red bold italic',
    'GBoI': 'green bold italic',
    'BBoI': 'blue bold italic',
  },
  regexs: [
    {
      id: 1,
      regex: /^<r>/gi,
      ignoreNext: 2
    },
    {
      id: 2,
      regex: /^<g>/gi,
      ignoreNext: 2
    },
    {
      id: 3,
      regex: /^<b>/gi,
      ignoreNext: 2
    },
    {
      id: 6,
      regex: /^\*\*\*/g,
      ignoreNext: 2
    },
    {
      id: 5,
      regex: /^\*\*/g,
      ignoreNext: 1
    },
    {
      id: 4,
      regex: /^\*/g,
      ignoreNext: 0
    }
  ],
  transitions: {
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
  },

};
