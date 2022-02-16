locals {
  account_vars = read_terragrunt_config(find_in_parent_folders("account.hcl"))
  region_vars = read_terragrunt_config(find_in_parent_folders("region.hcl"))

  account_id = local.account_vars.locals.aws_account_id
  aws_region = local.region_vars.locals.aws_region
}

# Terragrunt manage provider so you can run terragrunt from any subdirectory.
generate "providers" {
  path = "_providers.tf"
  if_exists = "overwrite_terragrunt"
  contents = <<EOF
provider "aws" {
  region = "${local.aws_region}"
  allowed_account_ids = ["${local.account_id}"]
}
EOF
}

# Terragrunt manage tfstate.
remote_state {
  backend = "s3"
  generate = {
    path      = "_backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    bucket         = "${local.account_id}-a9b3-tfstate"
    dynamodb_table = "${local.account_id}-a9b3-tflock"
    encrypt        = true
    key            = "${path_relative_to_include()}/terraform.tfstate"
    region         = "us-west-2"
  }
}

# All resources can inherit.
inputs = merge(
  local.account_vars.locals,
  local.region_vars.locals,
)
