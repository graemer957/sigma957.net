---
title: "Terraform and Cloudflare"
date: 2018-12-26T20:16:00Z
draft: false
tags: 
  - cloudflare
  - terraform
---
This is my second blog post in the series on how to accelerate and protect your website using Cloudflare. Part 1 was on [DNS hosting and registrar](../cloudflare-dns-hosting-and-registrar).

In this blog post, we are going to cover using [Terraform](https://www.terraform.io/) with [Cloudflare](https://www.cloudflare.com).

## Terraform
If you have no come across Terraform yet, it allows you to write 'Infrastructure as Code'. That may sound a bit abstract, but it doesn't take much to get going and really see the benefits.

For starters, you need the CLI [installed](https://www.terraform.io/downloads.html). On my Mac, I use [homebrew](https://brew.sh/) so it is as simple as 'brew install terraform'. Once installed `terraform version` should return:

> Terraform v0.11.11

The infrastructure code you will write is written in HCL ([HashiCop Language](https://github.com/hashicorp/hcl)) in files ending `.tf`. For example, let's say you wanted a bunch of AWS instances, you could create `aws.tf` with the following contents:

```hcl
resource "aws_instance" "app" {
  count         = 5
  ami           = "ami-408c7f28"
  instance_type = "t1.micro"
}
```

...and what about a load balancer in front of them?

```hcl
resource "aws_elb" "frontend" {
  name = "frontend-load-balancer"
  listener {
    instance_port     = 8000
    instance_protocol = "http"
    lb_port           = 80
    lb_protocol       = "http"
  }
  instances = ["${aws_instance.app.*.id}"]
}
```

Now this `aws.tf` 'code' could be committed into git, allowing you to track infrastructure changes over time. Maybe you would also want any changes to be peer reviewed? A college could pull this change and run `terraform plan`[^1] to see the proposed changes to your infrastructure. Pretty neat huh?

## Cloudflare
Terraform has this concept of 'providers'. They allow 3rd parties to write plugins enabling you to write HCL for configuring their specific services. Naturally, Cloudflare has their own provider. You can read their full documentation [here](https://www.terraform.io/docs/providers/cloudflare/index.html).

So let's start with configuring said provider:

```hcl
provider "cloudflare" {
  # email pulled from $CLOUDFLARE_EMAIL
  # token pulled from $CLOUDFLARE_TOKEN
}
```

...and save this as `cloudflare.tf`. Next run `terraform init` to download the provider ready to start making changes.

You will note that I have chosen to keep the email and token outside of my `.tf` file. Ergo, I need to set `CLOUDFLARE_EMAIL` and `CLOUDFLARE_TOKEN` before invoking any further `terraform` commands. This is useful if you are going to use CI for automating deployments (see [Build Pipeline for Site](../build-pipeline-for-site)) 😉

### CNAMEs
Next up I declare a variable to hold all of the domains I want to configure using Terraform. I have found it useful to declare, even if you only have a single domain as it keeps your configurations consistent. In this example I have three domains for my 'awesomeapp':

```hcl
variable "all_domains" {
  description = "All domains for my awesome app"
  type        = "list"
  default     = [
    "awesomeapp.com",
    "awesomeapp.net",
    "awesome.app"
  ]
}
```

Now I want to ensure that my domains have a dressed (eg, 'www.awesome.app`) and naked (eg, 'awesome.app') CNAMEs for my website:

```hcl
resource "cloudflare_record" "www" {
  count   = "${length(var.all_domains)}"
  domain  = "${element(var.all_domains, count.index)}"
  name    = "www"
  value   = "<origin server>"
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "naked" {
  count   = "${length(var.all_domains)}"
  domain  = "${element(var.all_domains, count.index)}"
  name    = "${element(var.all_domains, count.index)}"
  value   = "<origin server>"
  type    = "CNAME"
  proxied = true
  ttl     = 1
}
```

At this stage, we can apply the changes using `terraform apply`. Running this command will use the Cloudflare API to ascertain what changes need to be applied and then offer you the change to accept or reject them. Assuming your domain had no DNS entries beforehand and you accepted the changes, your [Cloudflare Dashboard](https://dash.cloudflare.com) will now look like this:

![CNAMEs in Cloudflare Dashboard](cnames-for-website.7d76ccf960bab741e6c02952fb29410ca0b77de5e8c4e8f544d9fa10d47493be.png)

Better still, that single invocation actually set the same entries up on all three of your domains hosted with Cloudflare. You can use the domain switcher to see them.

You will note that I used a placeholder of `<origin server>` for the CNAME alias above. This could be a fixed value, or indeed you may have used the AWS, Linode, Digital Ocean, etc, Terraform provider to create the instance beforehand and use another variable.

### Page Rules
I like my website to be addressed without the 'www', ie, https://sigma957.net. As an added benefit Cloudflare will flatten the CNAME at the apex, potentially saving the DNS resolver another roundtrip!

To help users and browsers remember my preference, I want to configure a redirect between https://www.sigma957.net and https://sigma957.net. This can be easily achieved using a page rule:

```hcl
resource "cloudflare_page_rule" "www" {
  zone     = "sigma957.net"
  target   = "www.sigma957.net/*"
  priority = 1

  actions = {
    forwarding_url = {
      url         = "https://sigma957.net/$1"
      status_code = 301
    }
  }
}
```

To test this works as expected, we can use `curl -I https://www.sigma957.net`:

```
HTTP/2 301
date: Wed, 26 Dec 2018 12:04:41 GMT
cache-control: max-age=3600
expires: Wed, 26 Dec 2018 13:04:41 GMT
location: https://sigma957.net/
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
server: cloudflare
cf-ray: 48fba6ae7eb8a719-DUB
```

As you can see, anytime the user hits a URL at https://www.sigma957.net they are redirected using an HTTP 301 (Moved Permanently) to the same URL on https://sigma957.net (_NOTE:_ The `*` wildcard and the `$1` reference). What is fantastic about using a page rule for this is that it happens on the Cloudflare CDN Edge nodes, which for most people will be really close to their location.

## Other Resources
The Cloudflare Terraform provider also allows you to configure other DNS records like A, MX or TXT and even other resources like zone settings. I plan to cover the latter in another blog post soon™.

**UPDATE**: Please see the blog post [Cloudflare protection, security and acceleration](../cloudflare-protection-security-and-acceleration) for more information.

---

[^1]: For the sake of brevity, and because there are better guides, I am skipping over how the state is shared 😀