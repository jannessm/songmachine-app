#! /bin/bash
nearleyc ./st.ne -o ./st-grammar.js
nearley-test -i "a<r>sr>casdf" ./st-grammar.js