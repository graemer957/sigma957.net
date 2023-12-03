---
title: "WIP: Terraform mess (part 2"
date: 2020-03-29T19:06:00Z
draft: true
tags:
  - terraform
---
Recap from part 1:

> Error: Failed to instantiate provider "cloudflare" to obtain schema: Incompatible API version with plugin. Plugin version: 4, Client versions: [5]

Add version to .tf file:

```
version = "~> 1.0"
```

Update to latest version of the 1.x provider using `terraform init -upgrade`

---

# Fix validation warnings

Running `terraform validate` we have two different validation warnings to fix before upgrading to version 2.x2 of the provider. Both warnings provide hints how to fix, but I will summerise...

```
Warning: Quoted type constraints are deprecated

  on cloudflare.tf line 10, in variable "all_domains":
  10:   type        = "list"

Terraform 0.11 and earlier required type constraints to be given in quotes,
but that form is now deprecated and will be removed in a future version of
Terraform. To silence this warning, remove the quotes around "list" and write
list(string) instead to explicitly indicate that the list elements are
```

Change `type = "list"` to read `type = list(string)` on line 10. Next warning:

```
Warning: Interpolation-only expressions are deprecated

  on cloudflare.tf line 20, in resource "cloudflare_zone_settings_override" "settings":
  20:   count = "${length(var.all_domains)}"

Terraform 0.11 and earlier required all non-constant expressions to be
provided via interpolation syntax, but this pattern is now deprecated. To
silence this warning, remove the "${ sequence from the start and the }"
sequence from the end of this expression, leaving just the inner expression.

Template interpolation syntax is still used to construct strings from
expressions when the template includes multiple interpolation sequences or a
mixture of literal strings and interpolations. This deprecation applies only
to templates that consist entirely of a single interpolation sequence.

(and 18 more similar warnings elsewhere)
```

Remove `"${` and `}"` around expressions. Mostly a simple find and replace with nothing. Re-running `terraform validate` now results in:

> Success! The configuration is valid.

🎉

# Upgrading to use version 2.x of provider

Let's migrate to v2.x of the Cloudflare terraform provider. At the top update the version to read:


```
provider "cloudflare" {
  # email pulled from $CLOUDFLARE_EMAIL
  # token pulled from $CLOUDFLARE_API_KEY
  version = "~> 2.0"
}
```

Note that `CLOUDFLARE_TOKEN` has been replaced by `CLOUDFLARE_API_KEY`, so you will need to update any deployment tasks accordingly.

In order to update the provider we need to run `terraform init -upgrade`:

```
Initializing the backend...

Initializing provider plugins...
- Checking for available provider plugins...
- Downloading plugin for provider "cloudflare" (terraform-providers/cloudflare) 2.5.0...

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

Re-running the validate now produces a lot of errors. I found these fall into two categories.

## Error: Missing required argument

```
  on cloudflare.tf line 19, in resource "cloudflare_zone_settings_override" "settings":
  19: resource "cloudflare_zone_settings_override" "settings" {

The argument "zone_id" is required, but no definition was found.
```

Previously I was supplying the `name` of the domain, but now `zone_id` is required. This can be found Cloudflare Dashboard > Overview, on right side. I suggest defining a new variable with the `zone_id` at the top of your confirmation, like this:

```
variable "zone_id" {
  type = string
  description = "Zone ID for the domain being configured. Can be found Cloudflare Dashboard > Overview, on right side"
  default = "..."
}
```

So where previously I had:

```
resource "cloudflare_zone_settings_override" "settings" {
  count = length(var.all_domains)
  name  = element(var.all_domains, count.index)
  settings {
    ssl = "strict"
  }
}
```

This now becomes:

```
resource "cloudflare_zone_settings_override" "settings" {
  zone_id = var.zone_id
  settings {
    ssl = "strict"
  }
}
```

## Error: Unsupported argument

```
  on cloudflare.tf line 38, in resource "cloudflare_record" "fm1":
  38:   domain  = element(var.all_domains, count.index)

An argument named "domain" is not expected here.
```

Currently I am declaring a `cloudflare_record` like this:

```
resource "cloudflare_record" "fm1" {
  zone_id = var.zone_id
  count   = length(var.all_domains)
  domain  = element(var.all_domains, count.index)
  name    = "fm1._domainkey"
  value   = "fm1.yourdomain.net.dkim.fmhosted.com"
  type    = "CNAME"
  proxied = false
}
```

But the `domain`  is no longer needed as we are now supplying a `zone_id`. So this can be simplified to:

```
resource "cloudflare_record" "fm1" {
  zone_id = var.zone_id
  name = "fm1._domainkey"
  value = "fm1.yourdomain.net.dkim.fmhosted.com"
  type = "CNAME"
  proxied = false
}
```

A final run of `terraform validate` to confirm:

> Success! The configuration is valid.

🍻
