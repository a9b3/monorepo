#!/bin/bash

echo "----------------------------------------------------------"
echo "Welcome to the monorepo"
echo "----------------------------------------------------------"
echo ""

# ---------------------------------------------------------------
# Start podman
# ---------------------------------------------------------------

podman info &>/dev/null
isPodmanRunning="$?"

if [ "$isPodmanRunning" != "0" ]; then
  echo ">>>>>>>>>>>>>>>>>>>>>>>>>> podman not running"

  podman machine list | rg monorepo 2>/dev/null
  isPodmanMachineCreated="$?"
  if [ "$isPodmanMachineCreated" == "0" ]; then
    yes | podman machine rm monorepo
  fi

  echo ">>>>>>>>>>>>>>>>>>>>>>>>>> podman machine init"
  podman machine init monorepo --cpus 2 --rootful
  podman machine start monorepo

  echo ">>>>>>>>>>>>>>>>>>>>>>>>>> setting podman system connection default to monorepo"
  podman system connection default monorepo

  echo ">>>>>>>>>>>>>>>>>>>>>>>>>> finished podman"
  exit 0
fi

# ---------------------------------------------------------------
# If minikube is not running start it.
# Uses container-runtime docker so minikube can pull from local docker
# images.
# The k8s manifest must also have ImagePullPolicy: Never
# ---------------------------------------------------------------

if [ "$isPodmanRunning" = "0" ]; then
  minikubeStarted=$(minikube status | rg Running)
fi
if [[ -z "$minikubeStarted" ]]; then
  echo "* minikube is not running run the following command"
  echo ""
  echo "    minikube start --driver=podman --addons ingress --cni calico"
  echo ""
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
