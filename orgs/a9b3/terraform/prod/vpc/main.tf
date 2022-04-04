variable "cluster_name" {}
variable "tags" {
  type = map(any)
}
variable "private_subnet_tags" {
  type = map(any)
}
variable "public_subnet_tags" {
  type = map(any)
}

module "vpc" {
  source = "../../../../libs/tf_modules/aws_vpc"

  cluster_name        = var.cluster_name
  tags                = var.tags
  private_subnet_tags = var.private_subnet_tags
  public_subnet_tags  = var.public_subnet_tags
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "private_subnets" {
  value = module.vpc.private_subnets
}
