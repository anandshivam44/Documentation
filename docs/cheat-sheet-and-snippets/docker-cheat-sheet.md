## Docker Cheat Sheet

#### Login to custom/private repository
```bash
REPOSITORY_URL=<repo url like artifactory.shivamanand.com>
REPOSITORY_USERNAME=<username>
REPOSITORY_PASSWORD=<password or token>

docker login $REPOSITORY_URL --username $REPOSITORY_USERNAME --password $REPOSITORY_PASSWORD
```
#### Login to dockerhub
```bash
REPOSITORY_USERNAME=<username>
REPOSITORY_PASSWORD=<password or token>

docker login --username $REPOSITORY_USERNAME --password $REPOSITORY_PASSWORD
```
#### Docker pull image
public image from docker hub
```bash
docker pull anandshivam44/flask-hello-world:v1
```
private image
```bash
# For private repo docker login before
docker pull artifactory.shivamanand.com/docker-release/image/path/python312:v1
```
#### List docker images and running containers
```bash
# Get all Images
docker images
# Get all containers
docker ps -a
```
#### Docker run images - multiple ways to run a docker container
```bash
# Run a container - simple
docker run -it ubuntu:latest
# Run a container and SSH into it.
docker run -it ubuntu:latest /bin/bash

# Docker port binding
HOST_PORT=80
CONTAINER_PORT=5000
docker run -p $HOST_PORT:$CONTAINER_PORT flask-hello-world:v1

# Docker multiple port binding
docker run  -p 80:5000 -p 8080:8080 -p 443:443 crud-flask:v1

# Multiple Vars
docker run \
--detach \
--name=[container_name] \
--env="MYSQL_ROOT_PASSWORD=[my_password]" \
--publish 6603:3306 \
--volume=/root/docker/[container_name]/conf.d:/etc/mysql/conf.d \
mysql

# Use host network, helps with port mappings
docker run --network="host"  -it stream-purchase-processor
```
#### Docker Build
```bash
# Clones a public github repo and builds Dockerfile from the root of 
docker build github.com/anandshivam44/flask-hello-world

# Docker Build with an image name
docker build -t myimage:latest .

# Docker Build from a file
docker build -f Dockerfile.dev -t myimage:dev .
# Docker Build and pass arguments/parameters
docker build --build-arg APP_VERSION=1.0 -t myimage:latest .
```
#### Docker push to repository
```bash
# tag image (optional)
docker image tag my-app:latest johndoe/my-app:latest

#Push image (login madatory)
docker push johndoe/my-app:latest
```
#### Docker login, commit and push a running image
```bash
docker login
sudo docker commit CONTAINER_HASH anandshivam44/flask-hello-world:v1
docker push anandshivam44/flask-hello-world:v1
```
#### Run docker without sudo
```bash
sudo groupadd docker
sudo gpasswd -a $USER docker
newgrp docker
```
or
```bash
sudo groupadd docker # create group
sudo usermod -aG docker ${USER} # add currrent user
```

#### Docker Daemon
```bash
# start Docker
sudo service docker start
# Check Docker status
sudo service docker status
```
#### Docker Init - Quickly create Dockerfile
```bash
docker init
```
#### Delete all images and running containers
```bash
# Remove all Docker containers locally
docker rm -vf $(docker ps -a -q)
# Remove all Docker Images locally
docker rmi -f $(docker images -a -q)
```
#### SSH
```bash
docker exec -it [container_name] bash
```

#### Docker Compose
```bash
docker-compose build
docker-compose up -d
```
#### Get Internal IP of the Docker Container
```bash
INTERNAL_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' docker_ssh)
echo $INTERNAL_IP
```

#### Docker Container Logs
```bash
docker logs container_name
```

#### To check the location of the volumes
```bash
docker inspect [container_name]
```

## Install Docker Ubuntu
#### Update your system:
```bash
sudo apt update && sudo apt upgrade -y

sudo apt install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release
```

#### Add Docker’s official GPG key:
```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

#### Set up the Docker repository:
```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

#### Install Docker Engine:
```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### Start and enable Docker:
```bash
sudo systemctl enable docker
sudo systemctl start docker
```

#### (Optional) Run Docker as a non-root user:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

