## Snippets

##### Clean Jenkins Build History
```java
def jobName = "folder_name/job_name"
def job = Jenkins.instance.getItemByFullName(jobName)
job.getBuilds().each { it.delete() }
job.nextBuildNumber = 1
job.save()
```
##### Read a trailing file, Read end of a file
```bash
tail -f /var/log/folder/file.log

clear; tail -n 50 /var/log/folder/file.log

clear; tail -n 100 /var/log/folder/file.log
```
##### Disable root login
```bash
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config;
service sshd restart 
```
##### Replace a word in a file using python
```python
import sys 
with open(sys.argv[1], 'r') as file :
  filedata = file.read()
filedata = filedata.replace(sys.argv[2], sys.argv[3])
with open(sys.argv[1], 'w') as file:
  file.write(filedata)
```
```bash
python3 python-file.py file-name.txt REPLACE_ARG_A WITH_ARG_B
```
##### Python read a Json file, modify and save it
```python
import json
import os
import sys


filename = sys.argv[3]+'/folder/file.json'
with open(filename, 'r') as f:
    data = json.load(f)
    data['A'][sys.argv[1]]={}
    data['A'][sys.argv[1]]['B'] = sys.argv[1] 
    data['A'][sys.argv[1]]['C'] = sys.argv[2] 

os.remove(filename)
with open(filename, 'w') as f:
    json.dump(data, f, indent=4)
```
##### Jenkins Run a Job remotely

You need to pass 2 tokens to execute your job remotely.
You need:
1. apiToken to authenticate your identity. This value is created from JENKINS_URL/me/configure . Also check here for documentation
2. Another Job authentication token which you create when you enable 'Trigger builds remotely'.
Below is a sample you can tweak to get it done.
```bash
PARAM1_VALUE=<param1_value>
PARAM2_VALUE=<param2_vale>
USERNAME=dummy_user_name
JENKINS_URL="http://10.xxx.x.xxx:8080"
JOB_TOKEN="<value>" # you create this token when you enable Job>Configure>Build Triggers>Trigger builds remotely
LOGIN_API_TOKEN="<value>" #get this value from JENKINS_URL/me/configure 

curl -g -L --user $USERNAME:$LOGIN_API_TOKEN "$JENKINS_URL/job/JobName/buildWithParameters?token=$JOB_TOKEN&param1_name=$PARAM1_VALUE&param2_name=$PARAM2_VALUE"
```
-g or --globoff to avoid issues of passing parameters with "'" or brackets to curl


