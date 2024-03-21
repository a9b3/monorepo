# ------------------------------------------------
# Inputs
# ------------------------------------------------
variable "name" {
  type        = string
  description = "Name of user"
}

variable "path" {
  type        = string
  description = "AWS iam user path for user"
}

variable "tags" {
  type        = map(any)
  description = "Tags to add to resouce"
  default     = {}
}

variable "pgp_key" {
  type        = string
  description = "base-64 encoded PGP public key for creating encrypted password and access key."
}

variable "password_length" {
  type        = number
  default     = 20
  description = "Length of generated password"
}

variable "password_reset_required" {
  type        = bool
  default     = true
  description = "User forced to reset password on first login."
}

# ------------------------------------------------
# Resources
# ------------------------------------------------
resource "aws_iam_user" "this" {
  name = var.name
  path = var.path

  tags = var.tags
}

resource "aws_iam_user_login_profile" "this" {
  user                    = aws_iam_user.this.name
  pgp_key                 = var.pgp_key
  password_length         = var.password_length
  password_reset_required = var.password_reset_required
}

resource "aws_iam_access_key" "this" {
  user    = aws_iam_user.this.name
  pgp_key = var.pgp_key
}

# ------------------------------------------------
# Outputs
# ------------------------------------------------
output "iam_user_name" {
  description = "User's name"
  value       = aws_iam_user.this.name
}

output "iam_user_arn" {
  description = "User AWS ARN"
  value       = aws_iam_user.this.arn
}

output "iam_user_login_profile_key_fingerprint" {
  description = "The fingerprint of the PGP key used to encrypt the password"
  value       = aws_iam_user_login_profile.this.key_fingerprint
}

output "iam_user_login_profile_encrypted_password" {
  description = "The encrypted password, base64 encoded"
  value       = aws_iam_user_login_profile.this.encrypted_password
}

output "iam_user_login_profile_encrypted_password_command" {
  description = "Command to show decrypted password"
  value       = <<EOF
echo "${aws_iam_user_login_profile.this.encrypted_password}" | base64 --decode | gpg -d
EOF
}

output "iam_access_key_id" {
  description = "The access key ID"
  value       = aws_iam_access_key.this.id
}

output "iam_access_key_encrypted_secret" {
  description = "The encrypted secret, base64 encoded"
  value       = aws_iam_access_key.this.encrypted_secret
}

output "iam_access_key_encrypted_secret_command" {
  description = "Command to show decrypted secret"
  value       = <<EOF
echo "${aws_iam_access_key.this.encrypted_secret}" | base64 --decode | gpg -d
EOF
}
