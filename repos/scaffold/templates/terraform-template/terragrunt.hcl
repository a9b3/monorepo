# this is required to pull in
include {
  path = find_in_parent_folders()
}

# Example
# dependency "hosted_zone_id" {
#   config_path = "../route53"
# }

# Example
# inputs = {
#   aws_route53_zone_id = dependency.hosted_zone_id.outputs.hosted_zone_id
# }
