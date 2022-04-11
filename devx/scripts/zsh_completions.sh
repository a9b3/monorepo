#!/bin/bash
set -eu

# IMPORTANT:
# make sure your fpath includes ~/.zsh/completion you can do this in your zshrc
# have the following line before compinit
#     fpath = (~/.zsh/completion $fpath)
#
mkdir -p ~/.zsh/completion
minikube completion zsh > ~/.zsh/completion/_minikube
kubectl completion zsh > ~/.zsh/completion/_kubectl
