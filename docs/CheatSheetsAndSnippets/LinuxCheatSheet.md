## Linux CheatSheet
### Sheel and Bash

#### Replace all file in a folder with another file. Works recursively and source and target both follow regex
```bash
find <folder where you want to fiind> -name "*.pem" -exec cp file.pem '{}' \;
```


