# These variables are set to make it convenient to run the docker image locally.
port = 30531
public_url = http://localhost:${port}
#public_url = https://services.pacificclimate.org/dev/pcic-react-components/

image:
	@PRC_PORT=$(port) PRC_PUBLIC_URL=$(public_url) docker-compose -f docker/docker-compose.yaml build

up:
	@PRC_PORT=$(port) PRC_PUBLIC_URL=$(public_url) docker-compose -f docker/docker-compose.yaml up -d
	@echo "Demo running at $(public_url)"
	@PRC_PORT=$(port) PRC_PUBLIC_URL=$(public_url) docker-compose -f docker/docker-compose.yaml logs -f

down:
	@PRC_PORT=$(port) PRC_PUBLIC_URL=$(public_url) docker-compose -f docker/docker-compose.yaml down
