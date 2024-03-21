# ------------------------------------------------
# Inputs
# ------------------------------------------------

variable "aws_route53_zone_id" {
  type        = string
  description = "Zone ID of the hosted zone to create aws cert DNS validation records in. This is used in the creation of the acm cert."
}

# ------------------------------------------------
# Resources
# ------------------------------------------------

# Cloudfront only accepts certificates from us-east-1
module "aws_cert_us_east_1_wildcard" {
  source       = "../../../libs/tf_modules/aws_cert"
  domain_names = ["lllllllll.link", "*.lllllllll.link"]
  zone_id      = var.aws_route53_zone_id
  aws_region   = "us-east-1"
}

# ------------------------------------------------
# Outputs
# ------------------------------------------------

output "wildcard_cert_arn" {
  value = module.aws_cert_us_east_1_wildcard.acm_certificate_arn
}
