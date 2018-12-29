#! /bin/bash
nearleyc ./editor.ne -o ./editor-grammar.js
nearley-test -i "a[asdfasdf]scasdf" ./editor-grammar.js