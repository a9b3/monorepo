resource "aws_route53_zone" "lllllllll_link" {
  name    = "lllllllll.link"
  comment = "Managed by Terraform (https://github.com/a9b3/monorepo)"
}

output "hosted_zone_id" {
  value = aws_route53_zone.lllllllll_link.zone_id
}
