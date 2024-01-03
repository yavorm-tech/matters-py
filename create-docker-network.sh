#!/bin/bash
if [ "$#" -ne 2 ];
then
    echo "Usage: create-docker-network.sh -a <172.20.0.0/24> -b <name>"
    exit 1
else
    docker network create -d bridge --subnet=$1 $2
fi
