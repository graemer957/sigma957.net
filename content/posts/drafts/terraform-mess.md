---
title: "WIP: Terraform mess"
date: 2020-03-22T12:03:00Z
draft: true
tags:
  - terraform
---
Not used terraform in a while... brew updated terraform on my machine to `v0.12.7`. I have cloudflare provider `v1.9.0`. Come to make update:

```
Error: Failed to instantiate provider "cloudflare" to obtain schema: Incompatible API version with plugin. Plugin version: 4, Client versions: [5]
```

np, let's upgrade provider... `terraform init -upgrade`:

```
* provider.cloudflare: version = "~> 2.4"
```

Quick check to make sure everything is still OK with `terraform validate`:

```
Error: Missing required argument

  on cloudflare.tf line 18, in resource "cloudflare_zone_settings_override" "settings":
  18: resource "cloudflare_zone_settings_override" "settings" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 20, in resource "cloudflare_zone_settings_override" "settings":
  20:   name  = "${element(var.all_domains, count.index)}"

An argument named "name" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 37, in resource "cloudflare_record" "fm1":
  37: resource "cloudflare_record" "fm1" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 39, in resource "cloudflare_record" "fm1":
  39:   domain  = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 46, in resource "cloudflare_record" "fm2":
  46: resource "cloudflare_record" "fm2" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 48, in resource "cloudflare_record" "fm2":
  48:   domain  = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 55, in resource "cloudflare_record" "fm3":
  55: resource "cloudflare_record" "fm3" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 57, in resource "cloudflare_record" "fm3":
  57:   domain  = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 64, in resource "cloudflare_record" "mesmtp":
  64: resource "cloudflare_record" "mesmtp" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 66, in resource "cloudflare_record" "mesmtp":
  66:   domain  = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 73, in resource "cloudflare_record" "www":
  73: resource "cloudflare_record" "www" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 75, in resource "cloudflare_record" "www":
  75:   domain  = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 83, in resource "cloudflare_record" "naked":
  83: resource "cloudflare_record" "naked" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 85, in resource "cloudflare_record" "naked":
  85:   domain  = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 96, in resource "cloudflare_page_rule" "naked":
  96: resource "cloudflare_page_rule" "naked" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 97, in resource "cloudflare_page_rule" "naked":
  97:   zone     = "sigma957.net"

An argument named "zone" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 107, in resource "cloudflare_page_rule" "www":
 107: resource "cloudflare_page_rule" "www" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 108, in resource "cloudflare_page_rule" "www":
 108:   zone     = "sigma957.net"

An argument named "zone" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 123, in resource "cloudflare_record" "in1":
 123: resource "cloudflare_record" "in1" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 125, in resource "cloudflare_record" "in1":
 125:   domain   = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 132, in resource "cloudflare_record" "in2":
 132: resource "cloudflare_record" "in2" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 134, in resource "cloudflare_record" "in2":
 134:   domain   = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 144, in resource "cloudflare_record" "dmarc":
 144: resource "cloudflare_record" "dmarc" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 146, in resource "cloudflare_record" "dmarc":
 146:   domain   = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 153, in resource "cloudflare_record" "spf":
 153: resource "cloudflare_record" "spf" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 155, in resource "cloudflare_record" "spf":
 155:   domain   = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 162, in resource "cloudflare_record" "sshfp-g-aws-d":
 162: resource "cloudflare_record" "sshfp-g-aws-d" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 164, in resource "cloudflare_record" "sshfp-g-aws-d":
 164:   domain   = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 175, in resource "cloudflare_record" "sshfp-g-aws":
 175: resource "cloudflare_record" "sshfp-g-aws" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 177, in resource "cloudflare_record" "sshfp-g-aws":
 177:   domain   = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.


Error: Missing required argument

  on cloudflare.tf line 188, in resource "cloudflare_record" "sshfp-aw-d":
 188: resource "cloudflare_record" "sshfp-aw-d" {

The argument "zone_id" is required, but no definition was found.


Error: Unsupported argument

  on cloudflare.tf line 190, in resource "cloudflare_record" "sshfp-aw-d":
 190:   domain   = "${element(var.all_domains, count.index)}"

An argument named "domain" is not expected here.
```

Doh - what!? This upgrade went from `v1.9.0` to `v2.4.1` - a pretty big jump. Let's pin our provider to something v1 compatible:

```
provider "cloudflare" {
  version = "~> 1.0"
}
```

After running `terraform init -upgrade` again we now have `v1.18.1`. Revalidating still results in a failure:

```
Error: Unsupported argument

  on cloudflare.tf line 102, in resource "cloudflare_page_rule" "naked":
 102:   actions = {

An argument named "actions" is not expected here. Did you mean to define a
block of type "actions"?
```

Reading the [change log of the cloudflare terraform provider](https://github.com/terraform-providers/terraform-provider-cloudflare/blob/master/CHANGELOG.md), it's not clear when this breaking change was made. However, a quick scan of the [cloudflare_page_rule](https://www.terraform.io/docs/providers/cloudflare/r/page_rule.html) reveals that:

```
actions = {
    cache_level = "cache_everything"
    edge_cache_ttl = 2419200
}
```

...should become...

```
actions {
    cache_level = "cache_everything"
    edge_cache_ttl = 2419200
}
```

A simple case of removing the `=`. Revalidating the configuration again:

```
Warning: "zone": [DEPRECATED] `zone` is deprecated in favour of explicit `zone_id` and will be removed in the next major release

  on cloudflare.tf line 97, in resource "cloudflare_page_rule" "naked":
  97: resource "cloudflare_page_rule" "naked" {



Warning: "zone": [DEPRECATED] `zone` is deprecated in favour of explicit `zone_id` and will be removed in the next major release

  on cloudflare.tf line 108, in resource "cloudflare_page_rule" "www":
 108: resource "cloudflare_page_rule" "www" {


Success! The configuration is valid, but there were some validation warnings as shown above.
```
From:
```
Terraform v0.11.14
+ provider.cloudflare v1.9.0
```

To:
```
Terraform v0.12.24
+ provider.cloudflare v1.18.1
```

Revalidating I still have some work to do:

```
Warning: Quoted type constraints are deprecated

  on cloudflare.tf line 10, in variable "all_domains":
  10:   type        = "list"

Terraform 0.11 and earlier required type constraints to be given in quotes,
but that form is now deprecated and will be removed in a future version of
Terraform. To silence this warning, remove the quotes around "list" and write
list(string) instead to explicitly indicate that the list elements are
strings.


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

(and 31 more similar warnings elsewhere)


Warning: "zone": [DEPRECATED] `zone` is deprecated in favour of explicit `zone_id` and will be removed in the next major release

  on cloudflare.tf line 97, in resource "cloudflare_page_rule" "naked":
  97: resource "cloudflare_page_rule" "naked" {

(and one more similar warning elsewhere)

Success! The configuration is valid, but there were some validation warnings as shown above.
```

😅