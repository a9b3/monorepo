variable "cluster_name" {}
variable "vpc_id" {}
variable "private_subnets" {}
variable "tags" {}
variable "path" {}

module "eks" {
  source = "../../../../libs/tf_modules/aws_eks"

  cluster_name    = var.cluster_name
  vpc_id          = var.vpc_id
  private_subnets = var.private_subnets
  tags            = var.tags
  path            = var.path
}
