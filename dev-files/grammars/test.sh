#! /bin/bash
nearleyc ./editor.ne -o ./editor-grammar.js
nearley-test -i "a[]scasdf" ./editor-grammar.js