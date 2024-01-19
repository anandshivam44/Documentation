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
