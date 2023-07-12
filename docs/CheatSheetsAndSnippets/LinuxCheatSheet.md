## Linux CheatSheet
### Sheel and Bash

#### Replace all file in a folder with another file. Works recursively and source and target both follow regex
```bash
find <folder where you want to fiind> -name "*.pem" -exec cp file.pem '{}' \;
```
#### Delete all files in a folder with an extension / pattern
```bash
find . -name "*.tf-e" -type f #find all file
```
Use with precaution
```bash
find . -name "*.txt-e" -type f -delete
```
#### Find and replace a word in all files in a folder
```bash
find ./ -type f -exec sed -e 's/Hello/Linux/g' {} \;
```


