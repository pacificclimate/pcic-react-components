#!/bin/bash
set -ex

# Convenience workspace directory for later use
WORKSPACE_DIR=$(pwd)

npm install --global npm@12
echo "Node: $(node --version)"
echo "npm:  $(npm --version)"
test "$(node --version | cut -d. -f1 | tr -d v)" = "24"
test "$(npm --version | cut -d. -f1)" = "12"
