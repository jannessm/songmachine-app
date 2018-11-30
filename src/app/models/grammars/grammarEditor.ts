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
  // transitions: {
  //   'S' : ['S', 'SR', 'SG', 'SB', 'SI', 'SBo', 'SBoI', 'Br', 'S'],

  //   'SR' : ['SR', 'S', 'SG', 'SB', 'SRI', 'SRBo', 'SRBoI', 'BrR', 'SR'],
  //   'SG' : ['SG', 'SR', 'S', 'SB', 'SGI', 'SGBo', 'SGBoI', 'BrG', 'SG'],
  //   'SB' : ['SB', 'SR', 'SG', 'S', 'SBI', 'SBBo', 'SBBoI', 'BrB', 'SB'],
  //   'SBo': ['SBo', 'SRBo', 'SGBo', 'SBBo', 'SBoI', 'S', 'SI', 'BrBo', 'SBo'],
  //   'SI' : ['SI', 'SRI', 'SGI', 'SBI', 'S', 'SBoI', 'SBo', 'BrI', 'SI'],

  //   'SRI' : ['SRI', 'SI', 'SGI', 'SB', 'SR', 'SRBoI', 'SRBo', 'BrRI', 'SRI'],
  //   'SGI' : ['SGI', 'SRI', 'SI', 'SB', 'SG', 'SGBoI', 'SGBo', 'BrGI', 'SGI'],
  //   'SBI' : ['SBI', 'SRI', 'SGI', 'SB', 'SB', 'SBBoI', 'SBBo', 'BrBI', 'SBI'],
  //   'SBoI' : ['SBoI', 'SRBoI', 'SGBoI', 'SBBoI', 'SBo', 'SI', 'S', 'BrBoI', 'SBoI'],

  //   'SRBo' : ['SRBo', 'SBo', 'SGBo', 'SBBo', 'SRBoI', 'SR', 'SRI', 'BrRBo', 'SRBo'],
  //   'SGBo' : ['SGBo', 'SRBo', 'SBo', 'SBBo', 'SGBoI', 'SG', 'SGI', 'BrGBo', 'SGBo'],
  //   'SBBo' : ['SBBo', 'SRBo', 'SGBo', 'SBo', 'SBBoI', 'SB', 'SBI', 'BrBBo', 'SBBo'],

  //   'SRBoI' : ['SRBoI', 'SBoI', 'SGBoI', 'SBBoI', 'SRBo', 'SRI', 'SR', 'BrRBoI', 'SRBoI'],
  //   'SGBoI' : ['SGBoI', 'SRBoI', 'SBoI', 'SBBoI', 'SGBo', 'SGI', 'SG', 'BrGBoI', 'SGBoI'],
  //   'SBBoI' : ['SBBoI', 'SRBoI', 'SGBoI', 'SBoI', 'SBBo', 'SBI', 'SB', 'BrBBoI', 'SBBoI'],

  //   'Br' : ['BrCo', 'BrCo', 'BrCo', 'BrCo', 'BrCo', 'BrCo', 'BrCo', 'BrCo', 'S'],
  //   'BrCo' : ['BrCo', 'BrCo', 'BrCo', 'BrCo', 'BrCo', 'BrCo', 'BrCo', 'BrCo', 'S']
  // },

};
