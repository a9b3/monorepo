
locals {
  # This directory is supposed to be global but we still need to provide a
  # region for the aws terraform provider block. This should only be used by the
  # provider in this directory.
  aws_region = "us-east-1"
}
