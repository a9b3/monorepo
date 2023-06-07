#!/bin/bash

echo "----------------------------------------------------------"
echo "Welcome to the monorepo"
echo "----------------------------------------------------------"
echo ""

# ---------------------------------------------------------------
# If minikube is not running start it.
# Uses container-runtime docker so minikube can pull from local docker
# images.
# The k8s manifest must also have ImagePullPolicy: Never
# ---------------------------------------------------------------

minikubeStarted=$(minikube status | rg Running)

if [[ -z "$minikubeStarted" ]]; then
  minikube start --driver=docker --container-runtime=docker --addons ingress --cni calico
fi


# ---------------------------------------------------------------
# Set npm root so you can use npm global
# ---------------------------------------------------------------

npm config set prefix "$HOME/.npm-packages"
export PATH="$(npm root -g)/../../bin:$PATH"
if [ ! -f "$(which ibazel)" ]; then
  echo "* installing ibazel..."
  npm install -g @bazel/ibazel
fi

# ---------------------------------------------------------------
# This will install configuration from .pre-commit-config.yaml to
# git hooks
# ---------------------------------------------------------------

pre-commit install -f --hook-type pre-commit

echo "----------------------------------------------------------"
