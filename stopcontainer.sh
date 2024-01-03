#!/bin/bash
for item in "$@"
do
    docker stop $item && docker rm $item
done
