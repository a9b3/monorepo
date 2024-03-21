variable "domain_names" {
  type        = list(string)
  description = "List of domain names to create cert for the first item in the list is the domain name."
}

variable "zone_id" {
  type        = string
  description = "A matching zone_id for route53 for the given domain"
}

variable "aws_region" {
  type        = string
  description = "Region to create certificate in"
}
