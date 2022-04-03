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

variable "vpc_id" {
  type        = string
  description = "VPC to create eks cluster in"
}

variable "private_subnets" {
  type        = string
  description = "VPC to create eks cluster in"
}

variable "tags" {
  type    = map(any)
  default = {}
}

variable "path" {
  type = string
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

resource "aws_iam_policy" "worker_policy" {
  name        = "worker-policy"
  description = "worker policy for the ALB ingress"

  policy = file("${path.module}/iam_policy.json")
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "18.7.2"

  cluster_name                    = var.cluster_name
  cluster_version                 = "1.21"
  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = true
  cluster_ip_family               = "ipv6"

  cluster_addons = {
    coredns = {
      resolve_conflicts = "OVERWRITE"
    }
    kube-proxy = {}
    vpc-cni = {
      resolve_conflicts = "OVERWRITE"
    }
  }

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnets

  eks_managed_node_group_defaults = {
    ami_type       = "BOTTLEROCKET_x86_64"
    disk_size      = 50
    instance_types = ["m5.large"]
  }

  # cluster_name                    = var.cluster_name
  # cluster_version                 = "1.21"
  # cluster_endpoint_private_access = true
  # cluster_endpoint_public_access  = true
  #
  # cluster_addons = {
  #   coredns = {
  #     resolve_conflicts = "OVERWRITE"
  #   }
  #   kube-proxy = {}
  #   vpc-cni = {
  #     resolve_conflicts = "OVERWRITE"
  #   }
  # }
  #
  # vpc_id     = var.vpc_id
  # subnet_ids = var.private_subnets
  #
  # # Node groups
  # self_managed_node_groups_defaults = {
  #   # ami_type                               = "AL2_x86_64"
  #   # disk_size                              = 50
  #   update_launch_template_default_version = true
  # }
  #
  # self_managed_node_groups = {
  #   one = {
  #     name = "spot-1"
  #
  #     public_ip    = true
  #     max_size     = 5
  #     desired_size = 1
  #
  #     use_mixed_instances_policy = true
  #     instance_type              = ["m5.large"]
  #   }
  # }
  #
  # # get this after applying terraform changes by seeing the output of the state
  # # use the output variable 'kubeconfig' below
  # write_kubeconfig = false
  #
  # workers_additional_policies = concat([aws_iam_policy.worker_policy.arn], var.workers_additional_policies)

  tags = var.tags
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

# output "kubeconfig" {
#   value       = module.eks.kubeconfig
#   description = "kubeconfig to be used by local kubectl"
# }

output "eks_oidc_issuer" {
  value = data.aws_eks_cluster.cluster.identity.0.oidc.0.issuer
}

output "eks_thumbprint" {
  value = data.tls_certificate.cluster.certificates.0.sha1_fingerprint
}
