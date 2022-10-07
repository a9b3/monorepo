terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.26.0"
    }
  }
}

locals {
  lambda_generated_zip_file    = "${path.module}/.generated/index.js.zip"
  lambda_generated_output_file = "${path.module}/.generated/index.js"
  # used by cloudfront only to map cache behavior to cloudfront origin
  s3_origin_id = "id"
}

# lambda must be in us-east-1 supply this provider to lambda creation
provider "aws" {
  alias  = "east-1"
  region = "us-east-1"
}

# -------------------------------------------
# Lambda
# -------------------------------------------

resource "aws_iam_role" "lambda_execution_role" {
  name_prefix        = "${var.name}-lambda-execution-role-"
  description        = "Managed by Terraform for ${var.name}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": [
          "edgelambda.amazonaws.com",
          "lambda.amazonaws.com"
        ]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lambda_execution" {
  name_prefix = "${var.name}-lambda-execution-policy-"
  role        = aws_iam_role.lambda_execution_role.id
  policy      = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:CreateLogGroup"
      ],
      "Effect": "Allow",
      "Resource": "*"
    },
    {
      "Action": [
        "s3:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::${var.aws_s3_bucket_name}/*"
      ]
    }
  ]
}
EOF
}

resource "local_file" "indexjs" {
  content = templatefile("${path.module}/index.js.tpl", {
    S3_BUCKET_NAME = var.aws_s3_bucket_name
  })
  filename = local.lambda_generated_output_file
}

data "archive_file" "origin_request_handler_file" {
  type        = "zip"
  source_file = local.lambda_generated_output_file
  output_path = local.lambda_generated_zip_file

  depends_on = [
    local_file.indexjs
  ]
}

resource "aws_lambda_function" "origin_request_handler" {
  description      = "Managed by Terraform for ${var.name}"
  filename         = local.lambda_generated_zip_file
  provider         = aws.east-1
  function_name    = "${var.name}_static_sites_origin_request_handler"
  handler          = "index.handler"
  source_code_hash = data.archive_file.origin_request_handler_file.output_base64sha256
  publish          = true
  role             = aws_iam_role.lambda_execution_role.arn
  runtime          = "nodejs12.x"
}

# -------------------------------------------
# S3
# -------------------------------------------

# The policy that will be associated with an cloudfront OAI which will allow
# access into the given bucket.
data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    sid = "1"

    actions = [
      "s3:*",
    ]

    resources = [
      "arn:aws:s3:::${var.aws_s3_bucket_name}/*",
    ]

    effect = "Allow"

    principals {
      type = "AWS"

      identifiers = [
        aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn,
        aws_iam_role.lambda_execution_role.arn,
      ]
    }
  }
}

# s3 bucket to store all static site assets
resource "aws_s3_bucket" "s3_bucket" {
  bucket = var.aws_s3_bucket_name
  acl    = "private"

  versioning {
    enabled = true
  }

  lifecycle {
    prevent_destroy = true
  }

  policy = data.aws_iam_policy_document.s3_bucket_policy.json
}

# -------------------------------------------
# Cloudfront
# -------------------------------------------

# This is assigned s3 bucket access in the iam policy above and this will be
# used to give cloudfront access
resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "Static sites cloud front access identity for ${var.name}."
}

# TODO - handle multiple domains
# might want to change this to a loop and change input to something like
# [{ acm_arn: "", root_domain: "", aliases: [] }]
# acm_arn should secure all the supplied alises
# all aliases should belong to the root_domain
# [{ acm_arn: "", root_domain: "exampe.com", aliases: ["foo.example.com"] }]
resource "aws_cloudfront_distribution" "s3_distribution" {
  depends_on = [aws_s3_bucket.s3_bucket]

  origin {
    domain_name = aws_s3_bucket.s3_bucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = var.aliases

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }

  default_cache_behavior {
    default_ttl            = 3600
    max_ttl                = 86400
    min_ttl                = 0
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = [
      "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"
    ]
    cached_methods = [
      "GET", "HEAD"
    ]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = aws_lambda_function.origin_request_handler.qualified_arn
      include_body = false
    }
  }

  # do not cache index.html
  ordered_cache_behavior {
    default_ttl            = 0
    max_ttl                = 0
    min_ttl                = 0
    path_pattern           = "index.html"
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = aws_lambda_function.origin_request_handler.qualified_arn
      include_body = false
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    error_caching_min_ttl = 0
    # TODO create a custom error page
    response_page_path = "/"
  }
}

# -------------------------------------------
# Routes
# -------------------------------------------

resource "aws_route53_record" "esayemm_com" {
  for_each = toset(var.aliases)

  zone_id = var.hosted_zone_id
  name    = each.value
  type    = "A"

  # route all static site subdomains to cloudfront
  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
