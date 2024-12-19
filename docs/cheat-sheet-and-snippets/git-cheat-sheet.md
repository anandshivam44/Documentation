## Git Cheat Sheet  

#### To keep in sync with remote branch (You may loose your local changes in the branch)
```bash
git fetch --all
branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
echo $branch
git reset --hard origin/$branch
```
#### Squash previous N commits into 1
```bash

git reset --soft HEAD~3 &&
git commit
```
#### Git undo 1 commit without loosing changes
```bash
git reset HEAD~1 --soft   
```
#### Git forceful deletion of a branch without merging it
```bash
git branch -D BRANCH_NAME
```
#### Git create a branch from another branch
```bash
git checkout -b NEW_BRANCH_NAME SOURCE_BRANCH_NAME
```
#### Git rename a local branch
 ```bash
 git checkout OLD_BRANCH_NAME
 ```
 ```bash
 git branch -m NEW_BRANCH_NAME
 ```
 `-m, --move            move/rename a branch and its reflog`
#### Git rename a remote branch
 ```
 git push origin -u NEW_BRANCH_NAME
 ```
 ```
 git push origin --delete OLD_BRANCH_NAME
 ```
#### Modify previous commit message
```bash
#remote: Use this command to change commit message (one commit at a time):
git rebase --interactive 985f75c0e537c357414b2a60f38a07dfe941f91b^
# remote: In the default editor, modify 'pick' to 'edit' in the line whose commit you want to modify
git commit --amend
# remote: modify the commit message
run: git rebase --continue
```
#### Mistakenly did a git add. To remove a file from staging area use
```bash
git reset filename
```
To unstag all changes use
```bash
git reset
```
#### Get `git diff` after it was staged using `git add`
```bash
git diff --staged
```
#### How can I purge all the history and push it
```bash
git checkout --orphan <name_you_choose_for_orphan_branch>
git commit
git push <remote-name> <branch-name>
```
#### Remove a file from staging if it was added using `git add` / Undo `git add`
```bash
git restore --staged <file>
```
#### git checkout remote branch
```bash
git checkout -b BRANCH_NAME origin/BRANCH_NAME 
```
#### git link and sync all remote branch to local branch
```bash
git branch -r | grep -v '\->' | sed "s,\x1B\[[0-9;]*[a-zA-Z],,g" | while read remote; do git branch --track "${remote#origin/}" "$remote"; done
git pull --all
```
also check this [link](https://stackoverflow.com/questions/10312521/how-do-i-fetch-all-git-branches)
#### git stash changes. By stashing changes you can change your current branch without having to worry about commiting changes in branch.
```bash
git stash
git checkout BRANCH
git stash pop
```
#### git stash changes including untracked files. By stashing changes you can change your current branch without having to worry about commiting changes in branch.
```bash
git stash --include-untracked
git checkout BRANCH
git stash pop
```
#### Clear git stash
```bash
git stash clear
```
#### git goto to a particular commit
```bash
git reflog # check commits; you can also use git log
git reset --hard commit_SHA
```
#### git undo previous commit. This will undo the commit and remove changes from staging, but your previous commit file changes will not be lost
```bash
git reset HEAD~1
```
#### git goback to previous commit (IMPORTANT: All changes will be discarded)
```bash
git reset --hard HEAD
```
#### git goback to (previous - 1 commit) (IMPORTANT: All changes will be discarded)
```bash
git reset --hard HEAD~1
```
#### git check history of a file
```bash
git log -p -- filepath
```
#### git bring changes from a specific commit from a specific repository into working repository
use git log to get commit hash from the branch you branch you want to bring changes, then 
```bash
git checkout WORKING_BRANCH
git cherry-pick <commit-hash>
```
Note: The new changes will be commited into the working branch
#### git cherry pick without commit 
```bash
git cherry-pick -n <hash>
```
#### git cherry pick fast
```bash
# Get hash from the branch
HASH=$(git rev-parse HEAD)

# switch branch then
git cherry-pick -n $HASH

# verify the changes then make the commit
git restore --staged *
git restore *
git cherry-pick  $HASH
```
#### git abort merge if stuck in merge conflict
```bash
git merge --abort
```
#### git accept all incoming changes
Overwrite any current changes and accept all conflicts from incoming changes, you can use the theirs strategy instead:
```bash
git merge [branch] --strategy-option theirs
```
#### git accept all current changes
Accept all current changes and ignore any incoming changes
```bash
git merge [branch] --strategy-option ours
```
#### prune all stale branches from your local repository
This will delete all local branches that already have been removed from the remote
```bash
git remote prune origin --dry-run
```
```bash
git remote prune origin
```
#### Remove sensitive files and their commits from Git history
These commands will re-write git history and therefore advisibale to create a backup  

This will delete all local branches that already have been removed from the remote
```bash
PATH_TO_FILE="/a/b/c"

# If multiple branch has the secret
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch $PATH_TO_FILE" \
  --prune-empty --tag-name-filter cat -- --all

# If only one branch has the secret
BRANCH_CONTAINING_FILE="main"
git filter-branch --force --index-filter \
"git rm --cached --ignore-unmatch $PATH_TO_FILE" \
--prune-empty --tag-name-filter cat -- $BRANCH_CONTAINING_FILE

```
 force-push your local changes to overwrite your remote repository, as well as all the branches you've pushed up
```bash
git push --force --verbose --dry-run
git push origin --force
```
In order to remove the sensitive file from your tagged releases, you'll also need to force-push against your Git tags
```bash
git push origin --force --tags
```
When others try pull down your latest changes after this, they'll get a message indicating that the changes can't be applied because it's not a fast-forward.

To fix this, they'll have to either delete their existing repository and re-clone it, or do a re-base
```bash
git rebase --interactive
```

Complete breakdown of commands [here](https://dev.to/arthvhanesa/how-to-remove-secrets-from-a-git-repository-36e4)

#### git setup diffferent configuration for different folders

Setup `~/.gitconfig`  
point differnt directories to respective gitconfig
```bash
[includeIf "gitdir:~/personal/"]
    path = ~/personal/.gitconfig

[includeIf "gitdir:~/work/"]
    path = ~/work/.gitconfig


[init]
 defaultBranch = main
```
Setup `~/personal/.gitconfig` 
add directory specific configuration here
```bash
[user]
        email = anand.shivam44@yahoo.com
        name = Shivam Anand
[pull]
        rebase = true

[core]
        editor = vim
        sshCommand = ssh -i ~/.ssh/shivam_personal_laptop_ubuntu
```
Setup `~/work/.gitconfig` 
add directory specific configuration here
```bash
[user]
        email = shivam.anand@work-email.company
        name = S Anand
[pull]
        rebase = true 
[core]
        editor = vim
        sshCommand = ssh -i ~/.ssh/shivam-work
```
#### git delete remote branch
Accept all current changes and ignore any incoming changes
```bash
git push origin -d <branch-name>
```
