# terraform-aws-static_sites

Infrastructure to deploy static sites for any domain with support for routing to
dynamic subdomains.

This module must be created in us-east-1. Because of lambda and cloudfront
certs.

---

## Deploy a Static Site

```
aws s3 sync ./dist s3://<bucket name>/<entire alias>/

ex. This will make www.lllllllll.link serve the contents of ./dist
aws s3 sync ./dist s3://173316437537-lllllllll-link-static-sites/www.lllllllll.link/
```

---

## Concept

    ```
    browser --> lambda@edge  --> cloudfront --> s3
             (viewer-request)  terminates ssl
    ```

The viewer-request function will look at the viewer host and route to the
respective s3 bucket's directory.

    ```
    http://foo.example.com

    viewer-request will change the uri to

    s3://your_bucket_name/example.com/foo
    ```

---

## Usage

After this is live in your infrastructure you should now upload sites to the
corresponding s3 bucket, following the format.

    s3://bucket_name/<root_domain>/<subdomain>/*

This needs to match with the provided `aliases`.

### How to add new static site.

Just add a new value to the aliases field at the module definition.

    ```
    module "static_sites" {
      bucket  = BUCKET_NAME
      aliases = ["foo.example.com", "bar.example.com"]
    }
    ```

Upload all foo resources to s3_bucket/foo and bar resources to s3_bucket/bar.

---

## Gotchas

- All the resources in this module must be defined in us-east-1 because of
  lambda restrictions.
- Aliases must all have the same domain.

### Destroying this requires a manual two step process.

You will get this error upon running destroy the first time. Lambdas cannot be
destroyed until their associations are destroyed so you must run destroy again
after the cloudfront distribution destroy fully propogated.

```
Error: Error deleting Lambda Function: InvalidParameterValueException: Lambda was unable to delete <arn> because it is a replicated function. Please see our documentation for Deleting Lambda@Edge Functions and Replicas.
```

---

## Development

### How to update the static_sites AWS lambda function.

When updating lambda function follow the suggestion in this [lambda edge function issues](https://github.com/hashicorp/terraform-provider-aws/issues/1721#issuecomment-614827359).

1.  `terraform state rm <lambda>`
2.  `terraform apply`
3.  Go to console and remove old lambda function manually in aws.

### How to debug the static_sites AWS lambda function.

Go to cloudwatch logs -> log groups, switch regions until you see yours. There's
no aggregate log setup.

    ex.
    https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#logsV2:log-groups
