#! /bin/bash
nearleyc ./chords.ne -o ./chords-grammar.js
nearley-test -i "a[C]<r>sc[<r>A]asdf" ./chords-grammar.js