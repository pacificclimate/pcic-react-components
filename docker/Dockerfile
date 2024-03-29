# This Dockerfile adapted from https://mherman.org/blog/dockerizing-a-react-app/
# and Client Explorer Dockerfile.

# This Dockerfile can (and should) be used to pass through automatically generated
# version information to the build which is triggered when the image is run.
# To do this, issue the following build command:
#
# docker build --build-arg REACT_APP_VERSION="$(./generate-commitish.sh)" -t <tag> .

# At this moment, Node.js 10.16 LTS is recommended for most users.
#
# In future, as we scale up, we may want to use an Alpine base image, which would reduce
# the size of the image by about an order of magnitude and reduce the attack surface of
# the image as well.

FROM node:16

WORKDIR /app
RUN chown node /app

ENV PATH /app/node_modules/.bin:$PATH

# PUBLIC_URL has to be set at *build* time. We build in this Dockerfile.
ARG PUBLIC_URL
ENV PUBLIC_URL $PUBLIC_URL
ADD --chown=node:node  . /app

RUN npm install --quiet && \
    npm install -g serve

EXPOSE 3000

USER node
RUN npm run build:app
ENTRYPOINT ./docker/entrypoint.sh
