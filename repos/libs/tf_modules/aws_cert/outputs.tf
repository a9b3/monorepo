output "acm_certificate_arn" {
  value       = aws_acm_certificate.default.arn
  description = "The arn of the generated certificate."
}
