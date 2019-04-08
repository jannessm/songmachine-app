
export const MUSICAL_KEYS = {
  sharps : ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  flats : ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
};

export interface MKey {
  major: string;
  minor: string;
  flat: boolean;
  sharp: boolean;
}

export const ChordKeys = {
  'C/Am': ['C', 'Cmaj7', 'Dm', 'Dm7', 'Em', 'Em7', 'F', 'Fmaj7', 'G', 'G7', 'Am', 'Am7', 'Bdim'],
  // #
  'G/Em': ['G', 'Gmaj7', 'Am', 'Am7', 'Bm', 'Bm7', 'C', 'Cmaj7', 'D', 'D7', 'Em', 'Em7', 'F#dim'],
  'D/Bm': ['D', 'Dmaj7', 'Em', 'Em7', 'F#m', 'F#m7', 'G', 'Gmaj7', 'A', 'A7', 'Bm', 'Bm7', 'C#dim'],
  'A/F#m': ['A', 'Amaj7', 'Bm', 'Bm7', 'C#m', 'C#m7', 'D', 'Dmaj7', 'E', 'E7', 'F#m', 'F#m7', 'G#dim'],
  'E/C#m': ['E', 'Emaj7', 'F#m', 'F#m7', 'G#m', 'G#m7', 'A', 'Amaj7', 'B', 'B7', 'C#m', 'C#m7', 'D#dim'],
  'B/G#m': ['B', 'Bmaj7', 'C#m', 'C#m7', 'D#m', 'D#m7', 'E', 'Emaj7', 'F#', 'F#7', 'G#m', 'G#m7', 'A#dim'],
  'F#/D#m': ['F#', 'F#maj7', 'G#m', 'G#m7', 'A#m', 'A#m7', 'B', 'Bmaj7', 'C#', 'C#7', 'D#m', 'D#m7', 'E#dim'],
  'C#/A#m': ['C#', 'C#maj7', 'D#m', 'D#m7', 'E#m', 'E#m7', 'F#', 'F#maj7', 'G#', 'G#7', 'A#m', 'A#m7', 'B#dim'],
  // b
  'F/Dm': ['F', 'Fmaj7', 'Gm', 'Gm7', 'Am', 'Am7', 'Bb', 'Bbmaj7', 'C', 'C7', 'Dm', 'Dm7', 'Edim'],
  'Bb/Gm': ['Bb', 'Bbmaj7', 'Cm', 'Cm7', 'Dm', 'Dm7', 'Eb', 'Ebmaj7', 'F', 'F7', 'Gm', 'Gm7', 'Adim'],
  'Eb/Cm': ['Eb', 'Ebmaj7', 'Fm', 'Fm7', 'Gm', 'Gm7', 'Ab', 'Abmaj7', 'Bb', 'Bb7', 'Cm', 'Cm7', 'Ddim'],
  'Ab/Fm': ['Ab', 'Abmaj7', 'Bbm', 'Bbm7', 'Cm', 'Cm7', 'Db', 'Dbmaj7', 'Eb', 'Eb7', 'Fm', 'Fm7', 'Gdim'],
  'Db/Bbm': ['Db', 'Dbmaj7', 'Ebm', 'Ebm7', 'Fm', 'Fm7', 'Gb', 'Gbmaj7', 'Ab', 'Ab7', 'Bbm', 'Bbm7', 'Cdim'],
  'Gb/Ebm': ['Gb', 'Gbmaj7', 'Abm', 'Abm7', 'Bbm', 'Bbm7', 'Cb', 'Cbmaj7', 'Db', 'Db7', 'Ebm', 'Ebm7', 'Fdim'],
  'Cb/Abm': ['Cb', 'Cbmaj7', 'Dbm', 'Dbm7', 'Ebm', 'Ebm7', 'Fb', 'Fbmaj7', 'Gb', 'Gb7', 'Abm', 'Abm7', 'Bbdim'],

  'D#/Cm': ['D#', 'D#maj7', 'E#m', 'E#m7', 'F##m', 'F##m7', 'G#', 'G#maj7', 'A#', 'A#7', 'B#m', 'B#m7', 'C##dim'],
  'G#/Fm': ['G#', 'G#maj7', 'A#m', 'A#m7', 'B#m', 'B#m7', 'C#', 'C#maj7', 'D#', 'D#7', 'E#m', 'E#m7', 'F##dim'],
  'A#/Gm': ['A#', 'A#maj7', 'B#m', 'B#m7', 'C##m', 'C##m7', 'D#', 'D#maj7', 'E#', 'E#7', 'F##m', 'F##m7', 'G##dim'],
};

export const overtones = [0, 5, 4, 3]; // desc
