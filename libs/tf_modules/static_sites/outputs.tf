output "domain_name" {
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
  description = "Created AWS cloudfront distribution's domain_name."
}

output "hosted_zone_id" {
  value       = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
  description = "Created AWS cloudfront distribution's hosted_zone_id."
}
