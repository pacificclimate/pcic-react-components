# These variables are set to make it convenient to run the docker image locally.
tag = $(shell git rev-parse --abbrev-ref HEAD)
port = 30520
public_url = http://localhost:${port}

image:
	@PRC_TAG=$(tag) PRC_PORT=$(port) PRC_PUBLIC_URL=$(public_url) docker-compose -f docker/docker-compose.yaml build

up:
	@PRC_TAG=$(tag) PRC_PORT=$(port) PRC_PUBLIC_URL=$(public_url) docker-compose -f docker/docker-compose.yaml up -d
	@echo "Demo running at $(public_url)"
	@PRC_TAG=$(tag) PRC_PORT=$(port) PRC_PUBLIC_URL=$(public_url) docker-compose -f docker/docker-compose.yaml logs -f

down:
	@PRC_TAG=$(tag) PRC_PORT=$(port) PRC_PUBLIC_URL=$(public_url) docker-compose -f docker/docker-compose.yaml down
