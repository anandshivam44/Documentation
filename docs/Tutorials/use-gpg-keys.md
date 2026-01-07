# Generate and add GPG Keys

### Get existing Keys
```bash
gpg --list-secret-keys
```
### Generate the Key
```bash
echo "%no-protection" | gpg --batch --gen-key --pinentry-mode loopback 2>&1 <<EOF
%no-protection
Key-Type: RSA
Key-Length: 4096
Subkey-Type: RSA
Subkey-Length: 4096
Name-Real: $(git config user.name 2>/dev/null || echo 'GitHub User')
Name-Email: $(git config user.email 2>/dev/null || echo 'anand.shivam44@yahoo.com')
Expire-Date: 0
EOF
```
### Get the public keys
```bash
# gpg --list-secret-keys
# gpg --armor --export $KEY

# single Liner
KEY_ID=$(gpg --list-secret-keys --keyid-format LONG | grep -E "^sec" | tail -1 | awk '{print $2}' | cut -d'/' -f2) && echo "Key ID: $KEY_ID" && echo "" && gpg --armor --export $KEY_ID
```

### tell git to use the keys
```bash
git config --global user.signingkey $KEY_ID
git config --global commit.gpgsign true
```
### gitconfig file at ~/.gitconfig
your git config file should look like
```
[user]
        name = anandshivam44
        email = anand.shivam44@yahoo.com
        signingkey = xxxxxxxxxxx
[gpg]
        format = openpgp
        program = /Users/user/.brew/bin/gpg
[commit]
        gpgsign = true
[push]
        autoSetupRemote = true
```


