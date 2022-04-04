# This is required to load the root terragrunt.hcl containing providers and
# remote_state configurations.
include {
  path = find_in_parent_folders()
}

locals {
  env_vars = read_terragrunt_config(find_in_parent_folders("env.hcl"))
}

inputs = {
  cluster_name = local.env_vars.locals.cluster_name
  tags = local.env_vars.locals.tags
  private_subnet_tags = {
    "kubernetes.io/cluster/${local.env_vars.locals.cluster_name}" = "shared"
    "kubernetes.io/role/elb" = "1"
  }
  public_subnet_tags = {
    "kubernetes.io/cluster/${local.env_vars.locals.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb" = "1"
  }
}
