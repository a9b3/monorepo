# ------------------------------------------------
# Inputs
# ------------------------------------------------
variable "cluster_name" {
  type        = string
  description = "Name of eks cluster to create"
}

variable "workers_additional_policies" {
  type        = list(any)
  description = "List of iam policy arns to add to each worker node"
  default     = []
}

variable "node_groups" {
  type = map(any)
}

# ------------------------------------------------
# Resources
# ------------------------------------------------

data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

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

  public_subnet_tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                    = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"           = "1"
  }
}

resource "aws_iam_policy" "worker_policy" {
  name        = "worker-policy"
  description = "worker policy for the ALB ingress"

  policy = file("${path.module}/iam_policy.json")
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "18.6.0"

  cluster_name                    = var.cluster_name
  cluster_version                 = "1.21"
  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = true

  cluster_addons = {
    coredns = {
      resolve_conflicts = "OVERWRITE"
    }
    kube-proxy = {}
    vpc-cni = {
      resolve_conflicts = "OVERWRITE"
    }
  }

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  node_groups_defaults = {
    ami_type  = "AL2_x86_64"
    disk_size = 50
  }

  node_groups = {
    # node label
    # eks.amazonaws.com/capacityType: ON_DEMAND
    # https://docs.amazonaws.cn/en_us/eks/latest/userguide/managed-node-groups.html
    on_demand = {
      desired_capacity = 1
      max_capacity     = 3
      min_capacity     = 1

      instance_type = ["m5.large"]
    }
  }

  # get this after applying terraform changes by seeing the output of the state
  # use the output variable 'kubeconfig' below
  write_kubeconfig = false

  workers_additional_policies = concat([aws_iam_policy.worker_policy.arn], var.workers_additional_policies)
}

data "tls_certificate" "cluster" {
  url = data.aws_eks_cluster.cluster.identity.0.oidc.0.issuer
}

# ------------------------------------------------
# Outputs
# ------------------------------------------------

output "eks_cluster_endpoint" {
  value       = data.aws_eks_cluster.cluster.endpoint
  description = "The endpoint of cluster control plane"
}

output "eks_cluster_ca_data" {
  value       = data.aws_eks_cluster.cluster.certificate_authority[0].data
  description = "CA for eks cluster"
}

output "eks_cluster_auth_token" {
  value       = data.aws_eks_cluster_auth.cluster.token
  description = "eks cluster auth token"
}

output "kubeconfig" {
  value       = module.eks.kubeconfig
  description = "kubeconfig to be used by local kubectl"
}

output "eks_oidc_issuer" {
  value = data.aws_eks_cluster.cluster.identity.0.oidc.0.issuer
}

output "eks_thumbprint" {
  value = data.tls_certificate.cluster.certificates.0.sha1_fingerprint
}
