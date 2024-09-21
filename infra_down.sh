#!/bin/bash

# Check if Docker is running and if not start it
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    if systemctl is-active --quiet docker; then
	echo "Docker has already been started"
    else
	echo "Starting Docker"
	sudo systemctl start docker
    fi
fi

if ! [ -f docker-compose.yml ]; then
    echo "docker-compose.yml is missing"
else
    docker compose down
fi
