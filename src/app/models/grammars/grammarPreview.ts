import { Grammar } from './generalModels';

export const GrammarPreview: Grammar = {
  // IMPORTANT: sort regexs as they should be processed (e.g. italic should be after bold)
  start: 'S',
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
    'S' : ['S', 'SR', 'SG', 'SB', 'SI', 'SBo', 'SBoI'],

    'SR' : ['SR', 'S', 'SG', 'SB', 'SRI', 'SRBo', 'SRBoI'],
    'SG' : ['SG', 'SR', 'S', 'SB', 'SGI', 'SGBo', 'SGBoI'],
    'SB' : ['SB', 'SR', 'SG', 'S', 'SBI', 'SBBo', 'SBBoI'],
    'SBo': ['SBo', 'SRBo', 'SGBo', 'SBBo', 'SBoI', 'S', 'SI'],
    'SI' : ['SI', 'SRI', 'SGI', 'SBI', 'S', 'SBoI', 'SBo'],

    'SRI' : ['SRI', 'SI', 'SGI', 'SB', 'SR', 'SRBoI', 'SRBo'],
    'SGI' : ['SGI', 'SRI', 'SI', 'SB', 'SG', 'SGBoI', 'SGBo'],
    'SBI' : ['SBI', 'SRI', 'SGI', 'SB', 'SB', 'SBBoI', 'SBBo'],
    'SBoI' : ['SBoI', 'SRBoI', 'SGBoI', 'SBBoI', 'SBo', 'SI', 'S'],

    'SRBo' : ['SRBo', 'SBo', 'SGBo', 'SBBo', 'SRBoI', 'SR', 'SRI'],
    'SGBo' : ['SGBo', 'SRBo', 'SBo', 'SBBo', 'SGBoI', 'SG', 'SGI'],
    'SBBo' : ['SBBo', 'SRBo', 'SGBo', 'SBo', 'SBBoI', 'SB', 'SBI'],

    'SRBoI' : ['SRBoI', 'SBoI', 'SGBoI', 'SBBoI', 'SRBo', 'SRI', 'SR'],
    'SGBoI' : ['SGBoI', 'SRBoI', 'SBoI', 'SBBoI', 'SGBo', 'SGI', 'SG'],
    'SBBoI' : ['SBBoI', 'SRBoI', 'SGBoI', 'SBoI', 'SBBo', 'SBI', 'SB']
  },

};
