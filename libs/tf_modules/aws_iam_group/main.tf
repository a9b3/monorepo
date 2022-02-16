##############################################################################
# Variables
##############################################################################

variable "name" {
  type        = string
  description = "IAM group name"
}

variable "path" {
  type        = string
  description = "IAM group path"
}

variable "user_names" {
  type        = list(string)
  description = "List of iam user names to add to this group"
}

##############################################################################
# Resources
##############################################################################

resource "aws_iam_group" "group" {
  name = var.name
  path = var.path
}

resource "aws_iam_group_membership" "membership" {
  name  = "${var.name}-membership"
  users = var.user_names
  group = aws_iam_group.group.name
}

##############################################################################
# Outputs
##############################################################################

output "aws_iam_group_name" {
  description = "Name of group created"
  value       = aws_iam_group.group.name
}
