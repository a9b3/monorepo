variable "name" {
  type        = string
  description = "Name to prefix created resources with."
}

variable "aws_s3_bucket_name" {
  type        = string
  description = "Name of the s3 bucket to be created and used to store all static site assets."
}

variable "aliases" {
  default     = []
  description = "Aliases to be handled by cloudfront distribution. ex. foo.example.com"
}

variable "acm_certificate_arn" {
  type        = string
  description = "ACM Certificate arn to use, make sure it certifies all the provided aliases."
}

variable "hosted_zone_id" {
  type        = string
  description = "Hosted zone ID for the aliases."
}
