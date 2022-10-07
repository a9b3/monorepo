# ------------------------------------------------
# Inputs
# ------------------------------------------------

variable "org" {
  type        = string
  description = "Name of the org to prepend to resource names and descriptions to be created."
}

variable "s3_bucket_name" {
  type        = string
  description = "Name of s3 bucket to be created."
}

variable "wildcard_cert_arn" {
  type        = string
  description = "A acm certificate arn for wildcard domains."
}

variable "hosted_zone_id" {
  type        = string
  description = "Hosted zone id to put alias records in."
}

# ------------------------------------------------
# Resources
# ------------------------------------------------

module "static_sites" {
  source             = "../../../libs/tf_modules/static_sites"
  name               = var.org
  aws_s3_bucket_name = var.s3_bucket_name
  aliases            = ["lllllllll.link", "www.lllllllll.link", "foo.lllllllll.link"]
  # cloudfront requires a certificate located in us-east-1 region
  acm_certificate_arn = var.wildcard_cert_arn
  hosted_zone_id      = var.hosted_zone_id
}

# ------------------------------------------------
# Outputs
# ------------------------------------------------

output "s3_bucket_name" {
  value       = var.s3_bucket_name
  description = "S3 bucket to upload static sites to."
}
