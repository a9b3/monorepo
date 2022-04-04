# This is required to load the root terragrunt.hcl containing providers and
# remote_state configurations.
include {
  path = find_in_parent_folders()
}

locals {
  env_vars = read_terragrunt_config(find_in_parent_folders("env.hcl"))
}

dependency "vpc" {
  config_path = "../vpc"

  # Configure mock outputs so `terragrunt validate` can be run before
  # dependencies are applied.
  mock_outputs_allowed_terraform_commands = ["validate"]
  mock_outputs = {
    vpc_id = "mock-vpc-id"
    private_subnets = []
  }
}

inputs = {
  cluster_name = local.env_vars.locals.cluster_name
  vpc_id = dependency.vpc.outputs.vpc_id
  private_subnets = dependency.vpc.outputs.private_subnets
  tags = local.env_vars.locals.tags
  path = local.env_vars.locals.path
}
