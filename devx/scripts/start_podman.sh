#!/bin/bash
#
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
  podman machine init monorepo
  podman machine start monorepo

  echo ">>>>>>>>>>>>>>>>>>>>>>>>>> setting podman system connection default to monorepo"
  podman system connection default monorepo
fi
