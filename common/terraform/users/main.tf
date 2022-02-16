module "this" {
  source = "../../../libs/tf_modules/aws_iam_user"

  # Add a new user here.
  #
  # This format should be
  # <first_last> = {
  #   name = <name>
  #   path = <path to pub key>
  # }
  for_each = {
    sam_lau = {
      name = "sam_lau"
      path = filebase64("${path.module}/pubkeys/sam_lau")
    }
  }

  name    = each.key
  path    = "/monorepo/common/"
  pgp_key = each.value.path
}

output "iam_access_key_id" {
  description = "AWS ACCESS KEY for the user"
  value       = { for k, v in module.this : k => v.iam_access_key_id }
}

output "iam_access_key_encrypted_secret_command" {
  description = "Command to show decrypted secret key"
  value       = { for k, v in module.this : k => v.iam_access_key_encrypted_secret_command }
}

output "iam_user_login_profile_encrypted_password_command" {
  description = "Command to show decrypted password"
  value       = { for k, v in module.this : k => v.iam_user_login_profile_encrypted_password_command }
}
