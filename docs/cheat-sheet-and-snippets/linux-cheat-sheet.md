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
Only on MacOS if find command doesn't work
```
export LC_CTYPE=C 
export LANG=C
```

```bash
find ./ -type f -exec sed -i '' -e 's/Hello/Linux/g' {} \;
```

#### Find a folder and copy a folder inside the folder
```bash
find . -type d -name "04-*" -exec cp -r <folder path> '{}' \;
```
#### For loop with String Numbers
```bash
for ((i = "1"; i <= "6"; i++)); do 
   echo "$i"
done
```
#### For loop with Numbers
```bash
for ((i = 1; i <= 6; i++)); do 
   echo "$i"
done
```
#### Generate SHA512 Password and set password using HASH
```bash
PASSWORD='password'
LINUX_USER='root'
HASH=$(openssl passwd -1 $PASSWORD)
echo $HASH
usermod -p "$HASH" $LINUX_USER
```
#### Get list of larget files in a folder recursively
```bash
find . -type f -exec du -h {} + | sort -rh | head -n 10
```


