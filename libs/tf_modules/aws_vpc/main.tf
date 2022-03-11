# ------------------------------------------------
# Inputs
# ------------------------------------------------
variable "cluster_name" {
  type        = string
  description = "Name of VPC to create"
}

# https://aws.amazon.com/premiumsupport/knowledge-center/eks-vpc-subnet-discovery/
# To allow EKS clusters to use the subnet supply the following.
# {
#   "kubernetes.io/cluster/${var.cluster_name}" = "shared"
#   "kubernetes.io/role/elb"                    = "1"
# }
variable "public_subnet_tags" {
  type        = map(any)
  description = "Tags for public subnet"
  default     = {}
}

# https://aws.amazon.com/premiumsupport/knowledge-center/eks-vpc-subnet-discovery/
# To allow EKS clusters to use the subnet supply the following.
# {
#   "kubernetes.io/cluster/${var.cluster_name}" = "shared"
#   "kubernetes.io/role/internal-elb"           = "1"
# }
variable "private_subnet_tags" {
  type        = map(any)
  description = "Tags for private subnet"
  default     = {}
}

# Tags for common resources.
variable "tags" {
  type        = map(any)
  description = "Tags for common resources"
  default = {
    Terraform = "true"
  }
}

# ------------------------------------------------
# Resources
# ------------------------------------------------

data "aws_availability_zones" "available" {}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "2.68.0"

  name                 = "vpc-${var.cluster_name}"
  cidr                 = "172.16.0.0/16"
  azs                  = data.aws_availability_zones.available.names
  private_subnets      = ["172.16.1.0/24", "172.16.2.0/24", "172.16.3.0/24"]
  public_subnets       = ["172.16.4.0/24", "172.16.5.0/24", "172.16.6.0/24"]
  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true

  public_subnet_tags  = var.public_subnet_tags
  private_subnet_tags = var.private_subnet_tags

  tags = var.tags
}

# ------------------------------------------------
# Outputs
# ------------------------------------------------

output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "The ID of the VPC created."
}

output "private_subnets" {
  value       = module.vpc.private_subnets
  description = "The private subnets of the vpc created."
}

output "default_security_group_id" {
  value       = module.vpc.default_security_group_id
  description = "The default security group id."
}
