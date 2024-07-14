## gcloud cheat sheet

#### Login to gcloud
```bash
gcloud auth login
```
```bash
gcloud auth login --no-launch-browser
```
#### gcloud get projects
```bash
gcloud projects list
```
#### gcloud set project
```bash
PROJECT_ID=<set project id>
gcloud config set project $PROJECT_ID
```
#### gcloud delete a project
```bash
PROJECT_ID=<set project id>
gcloud --quiet projects delete $PROJECT_ID
```


