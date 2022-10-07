# AWS Cert

Terraform module for creating and validating a ssl certificate on AWS.

Example:

```
module "aws_cert" {
  source = "REPLACE"
  domain_name = "REPLACE"
  zone_id = "REPLACE"
}

// use
{
  // ...
  module.aws_cert.acm_certificate_arn
}
```
