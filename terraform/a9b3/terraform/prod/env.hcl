locals {
  env = "prod"

  # This is used by vpc and eks to share subnets. It is important they both use
  # the same cluster_name.
  cluster_name = "a9b3"

  tags = {
    Terraform = "true"
    Codebase  = "monorepo/a9b3"
  }

  # This is used for certain aws resources for organization purposes.
  path = "/monorepo/a9b3/"
}
