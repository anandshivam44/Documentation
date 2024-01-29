## Regex CheatSheet

#### Anything that Line starts with abc and Line ends with xyz
```bash
^abc.*xyz$
```
```bash
^abc(.*)xyz$
```
#### Anywhere anything between ABC and xyx & includes  abc and xyz
```bash
abc.*xyz
```
```bash
abc(.*)xyz
```
#### Find pattern between multiple lines
```bash
abc((.|\n)*)xyx
```

#### Find pattern between multiple lines
Regex pattern to find
```bash
abc((.|\n)*)lmn((.|\n)*)xyz
```
Regex pattern to replace. Each pattern corresponds to equivalent $n
```bash
def$1opq$2wxy
```

