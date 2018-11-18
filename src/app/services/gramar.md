# Parsing Grammar .st
State | /./g | < r > | < g > | < b > | *   | **   | *** | e
------|------|-------|-------|-------|-----|------|-----|---
S     | S    | R     | G     | B     | I   | Bo   | BoI | e
------|------|-------|-------|-------|-----|------|-----|---
R     | R    | S     | G     | B     | RI  | RBo  | RBoI| e
G     | G    | R     | S     | B     | GI  | GBo  | GBoI| e
B     | B    | R     | G     | S     | BI  | BBo  | BBoI| e
I     | I    | RI    | GI    | BI    | S   | BoI  | Bo  | e
Bo    | Bo   | RB    | GB    | BBo   | BI  | S    | I   | e
------|------|-------|-------|-------|-----|------|-----|---
RI    | RI   |  I    | GI    | BI    | R   | RBoI | RBo | e
GI    | GI   | RI    |  I    | BI    | G   | GBoI | GBo | e
BI    | BI   | RI    | GI    |  I    | B   | BBoI | BBo | e
BoI   | BoI  | RBoI  | GBoI  | BBoI  | Bo  |   I  | S   | e
------|------|-------|-------|-------|-----|------|-----|---
RBo   | RBo  | Bo    | GBo   | BBo   | RBoI| R    | RI  | e
GBo   | GBo  | RBo   | Bo    | BBo   | GBoI| G    | GI  | e
BBo   | BBo  | RBo   | GBo   | Bo    | BBoI| B    | BI  | e
------|------|-------|-------|-------|-----|------|-----|---
RBoI  | RBoI | BoI   | GBoI  | BBoI  | RBo | RI   | R   | e
GBoI  | GBoI | RBoI  | BoI   | BBoI  | GBo | GI   | G   | e
BBoI  | BBoI | RBoI  | GBoI  | BoI   | BBo | BI   | B   | e