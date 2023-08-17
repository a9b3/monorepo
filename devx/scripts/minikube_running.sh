#!/bin/bash

minikube status &>/dev/null
exit_code=$(echo $?)
