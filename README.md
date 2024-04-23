 New Application - postgresql, python + redis, react (typescript)  
 To Install do:  
 move env-file to .env  
 add -H 0.0.0.0:2375 to docker daemon  
 docker network create -d bridge --subnet 172.23.0.0/24 <network-name>  
 docker-compose up -d --build  
