terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  alias = "acm"
  # To use certificates with cloudfront you must create it in us-east-1.
  # https://docs.aws.amazon.com/acm/latest/userguide/acm-regions.html
  region = var.aws_region
}

# Certificate for the given domain name and it's subdomains.
resource "aws_acm_certificate" "default" {
  provider = aws.acm

  domain_name               = var.domain_names[0]
  subject_alternative_names = slice(var.domain_names, 1, length(var.domain_names))
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# To validate the cert using validation_method = "DNS" for aws_acm_certificate.
resource "aws_route53_record" "validation" {
  count = length(var.domain_names)

  zone_id = var.zone_id
  name    = lookup(tolist(aws_acm_certificate.default.domain_validation_options)[count.index], "resource_record_name")
  type    = lookup(tolist(aws_acm_certificate.default.domain_validation_options)[count.index], "resource_record_type")
  records = [lookup(tolist(aws_acm_certificate.default.domain_validation_options)[count.index], "resource_record_value")]
  ttl     = 60

  allow_overwrite = true
}

# Associates the route53 validation with the certificate.
resource "aws_acm_certificate_validation" "default" {
  provider = aws.acm

  certificate_arn = aws_acm_certificate.default.arn
  validation_record_fqdns = [
    for record in aws_route53_record.validation : record.fqdn
  ]
}
