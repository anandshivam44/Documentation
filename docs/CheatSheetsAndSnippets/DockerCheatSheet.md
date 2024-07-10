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
#### List Docker Images and running containers
```bash
# Get all Images
docker images
# Get all containers
docker ps -a
```
#### Delete all images and running containers
```bash
# Remove all Docker containers locally
docker rm -vf $(docker ps -a -q)
# Remove all Docker Images locally
docker rmi -f $(docker images -a -q)
```
#### Different ways to run a docker container
```bash
# Run a container and SSH into it.
docker run -it ubuntu:latest /bin/bash

# Docker port binding
docker run -p 80:80 flask-hello-world

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
#### SSH
```bash
docker exec -it [container_name] bash
```
#### Docker Build
```bash


# Clones a public github repo and builds Dockerfile from the root of 
docker build github.com/anandshivam44/flask-hello-world

# Docker Build with an image name
docker build -t name-of-the-image .

# Docker Build from a file with name Dockerfile
docker build -f Dockerfile .
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
#### Docker login, commit and push
```bash
docker login

sudo docker commit CONTAINER_HASH anandshivam44/flask-hello-world:v1

docker push anandshivam44/flask-hello-world:v1
```
#### Docker pull 
```bash
# For private repo do docker login
sudo docker pull anandshivam44/flask-hello-world:v1
```

