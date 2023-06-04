## SSH to Docker Container from Host and from outside the Host Remotely
### Docker Port Binding Example

#### Create an VM in AWS/GCP/Azure
I've created an ec2 in aws with ubuntu image

SSH into the instance 

#### Install Docker and Docker Compose
Copy paste the command for Ubuntu
```bash
sudo apt-get update -y
sudo apt-get install ca-certificates curl gnupg -y
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
sudo apt install docker-compose -y
```


###### Test Docker Installation
```bash
sudo docker run hello-world
```

#### Add docker to sudoer
```bash
sudo groupadd docker
sudo gpasswd -a $USER docker
newgrp docker
```


#### Create SSH Key Pair in Host Machine

```bash
FILENAME=docker_ssh
ssh-keygen -t ed25519 -a 100 -C $FILENAME -f ./$FILENAME -N ''
```
#### Create DockerFile
```bash
vim DockerFile
```

Contents of DockerFile:
```yaml
FROM ubuntu:latest
RUN apt update && apt install  openssh-server sudo -y
# Create a user “sshuser” and group “sshgroup”
RUN groupadd sshgroup && useradd -ms /bin/bash -g sshgroup sshuser
# Create sshuser directory in home
RUN mkdir -p /home/sshuser/.ssh
# Copy the ssh public key in the authorized_keys file. The idkey.pub below is a public key file you get from ssh-keygen. They are under ~/.ssh directory by default.
COPY docker_ssh.pub /home/sshuser/.ssh/authorized_keys
# change ownership of the key file. 
RUN chown sshuser:sshgroup /home/sshuser/.ssh/authorized_keys && chmod 600 /home/sshuser/.ssh/authorized_keys
# Start SSH service
RUN service ssh start
# Expose docker port 22
EXPOSE 22
CMD ["/usr/sbin/sshd","-D"]
```



#### Test Docker Build for any failures
```bash
docker build -f Dockerfile .
```

#### Create Docker Compose File
```bash
touch docker-compose.yml
vim docker-compose.yml
```
  
Contents of docker-compose.yml:
```yaml
version: '3'
services:
  dockerssh:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: docker_ssh
    ports:
      - "2022:22"
```
#### Run Docker Compose and start the container
```bash
docker-compose build
docker-compose up -d
```

#### SSH into the Container from Host
###### Check for port binding. Verify port 2022 of the host is bind to port 22 of the container

```bash
sudo ss -tulpn
sudo lsof -i -P -n | grep LISTEN
```


###### SSH
```bash
ssh -p 2022 -i ./docker_ssh sshuser@localhost 
```
###### SSH using Internal Ip directly on Port 22
```bash
INTERNAL_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' docker_ssh)
echo $INTERNAL_IP
ssh -i docker_ssh sshuser@$INTERNAL_IP

```

#### SSH from a remote location
Since my VM/ec2 is in a public subnet, I can SSH to the Docker Container remotely directly bypassing Docker Host. But before that you need to also copy the private key file to your laptop/pc and then

```bash
ssh -p 2022  -i ./docker_ssh sshuser@PUBLIC_IP 
```
Make sure the port 2022 is open in Security Groups attached to the VM


#### Cleaning Up
```bash
# Remove all Docker Running Containers
sudo docker rm -vf $(sudo docker ps -a -q)
# Remove all Docker Images
sudo docker rmi -f $(sudo docker images -a -q)
```


###### Terminate your VM to avoid Cost
Delete/Terminate your VM to avoid cost













