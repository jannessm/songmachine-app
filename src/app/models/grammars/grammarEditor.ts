import { Grammar } from './generalModels';

export const GrammarEditor: Grammar = {
  // IMPORTANT: sort regexs as they should be processed (e.g. italic should be after bold)
  start: 'S',
  lookahead: '*',
  cssClasses: {
    'S': 'normal',
    'SR': 'red',
    'SG': 'green',
    'SB': 'blue',
    'SBo': 'bold',
    'SI': 'italic',
    'SRI': 'red italic',
    'SGI': 'green italic',
    'SBI': 'blue italic',
    'SBoI': 'bold italic',
    'SRBo': 'red bold',
    'SGBo': 'green bold',
    'SBBo': 'blue bold',
    'SRBoI': 'red bold italic',
    'SGBoI': 'green bold italic',
    'SBBoI': 'blue bold italic',
    'Br': 'grey',
    'BrCo': 'highlighted' // bracketContent
  },
  nodes: [
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
    },
    {
      id: 7,
      regex: /^\[.*?\]/g,
      ignoreNext: 0
    },
    {
      id: 8,
      regex: /^\]/g,
      ignoreNext: 0
    }
  ],

};
