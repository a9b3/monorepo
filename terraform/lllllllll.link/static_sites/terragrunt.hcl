dependency "wildcard_cert" {
  config_path = "../certs"
}

dependency "hosted_zone" {
  config_path = "../route53"
}

locals {
  account_vars = read_terragrunt_config(find_in_parent_folders("account.hcl"))
}

include {
  path = find_in_parent_folders()
}

inputs = {
  org = "lllllllll"
  s3_bucket_name = "${local.account_vars.locals.aws_account_id}-lllllllll-link-static-sites"
  wildcard_cert_arn = dependency.wildcard_cert.outputs.wildcard_cert_arn
  hosted_zone_id = dependency.hosted_zone.outputs.hosted_zone_id
}
