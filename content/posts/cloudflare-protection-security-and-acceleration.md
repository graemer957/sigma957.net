---
title: "Cloudflare protection, security and acceleration"
date: 2019-01-09T16:23:00Z
draft: false
tags:
  - cloudflare
  - security
  - performance
---
I use [Cloudflare](https://www.cloudflare.com) on this site for protection, security and also acceleration. In the following sections, we can drill into the details of each.

## Protection
You may recall from my [DNS Hosting and Registrar](../cloudflare-dns-hosting-and-registrar) blog post that I use the Cloudflare authoritative DNS servers for my domain. I consider this to be the start of their protection services. Not only does it mean name resolution is secure and fast, but the CDN they offer protects my origin from the outside world. Currently, my origin server is connected to the Internet via an IPv4 address, but only Cloudflare know what that address is. If you were to perform a `dig sigma957.net` you would see:

```
sigma957.net.        300    IN    A    104.18.38.120
sigma957.net.        300    IN    A    104.18.39.120
```

These IP addresses are operated and belong to Cloudflare. Further still, if you queried for IPv6 addresses with `dig sigma957.net AAAA` you would see:

```
sigma957.net.        300    IN    AAAA    2606:4700:30::6812:2778
sigma957.net.        300    IN    AAAA    2606:4700:30::6812:2678
```

Which is really cool, because this means the site is available via IPv6, even though my origin is not 👏🏻

You may be wondering where in the world these IP addresses are located. They actually belong to the [global AnyCast network](https://www.cloudflare.com/network/) that Cloudflare operate. At the time of writing, they operate 165 data centres around the world, meaning that chances are it's only a short hop away from you. Both their CDN and DNS are exposed via this AnyCast network.

The last, but by no means, the least important part of the protection is the [Advanced DDoS Attack Protection](https://www.cloudflare.com/ddos/) offered. This includes UDP amplification attacks and DNS/HTTP floods. What I really appreciate, and find incredible, is that not only is this offered **for free**, but it is also completely unmetered!

## Security
Internally in their CDN, Cloudflare configures and operate nginx as a caching proxy. I have no idea if it's the open source version, but I suspect it's a somewhat tweaked version. In fact, now that I think about it I am fairly sure I read one of their blog posts about some additional functionality or patches they have written. My point here though is that they have a secure and performant configuration applied. Also, no doubt, as the security landscape changes they are quick to react. Quicker than I would be at least 😉

As we all know in this day and age all websites should be served over TLS (HTTPS). This is made extremely easy by Cloudflare... as soon as you sign up they issue, what they call, a Universal SSL certificate for your domain. In my case, this includes a wildcard covering `*.sigma957.net` and the root, ie `sigma957.net`. This is a shared SSL certificate also covering other Cloudflare customers. Naturally, you have the option to purchase a dedicated SSL certificate if you would prefer.

It is also extremely easy for you to ensure that all traffic to your site uses HTTPS. In fact, I think this is on by default. But to be sure, I apply the following snippet in my Terraform config:

```hcl
resource "cloudflare_zone_settings_override" "settings" {
  settings {
    always_use_https = "on"
  }
}
```

So if you were to `curl -I http://sigma957.net` you would see:

```
HTTP/1.1 301 Moved Permanently
Date: Wed, 09 Jan 2019 18:27:23 GMT
Connection: keep-alive
Cache-Control: max-age=3600
Expires: Wed, 09 Jan 2019 19:27:23 GMT
Location: https://sigma957.net/
X-Content-Type-Options: nosniff
Server: cloudflare
CF-RAY: 4968f5278537a67d-DUB

HTTP/2 200
date: Wed, 09 Jan 2019 18:27:24 GMT
content-type: text/html
set-cookie: __cfduid=dda4dbcc619a549cdf0695c90056fa0cf1547058443; expires=Thu, 09-Jan-20 18:27:23 GMT; path=/; domain=.sigma957.net; HttpOnly; Secure
vary: Accept-Encoding
last-modified: Wed, 09 Jan 2019 16:11:14 GMT
vary: Accept-Encoding
expires: Wed, 09 Jan 2019 19:27:24 GMT
cache-control: max-age=3600
x-frame-options: SAMEORIGIN
x-xss-protection: 1; mode=block
content-security-policy: default-src 'self';
feature-policy: accelerometer 'none'; camera 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; payment 'none'; usb 'none'
referrer-policy: strict-origin-when-cross-origin
cf-cache-status: MISS
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
server: cloudflare
cf-ray: 4968f528aea4a6cb-DUB
```

I would highly recommend also setting up HSTS (HTTP Strict Transport Security), a policy that informs web browsers that any future visits to the site should be via HTTPS only. I have not found a way to set this via the Cloudflare Terraform provider, but it's straight forward via the Dashboard:

![HSTS Configuration](hsts-configuration.d563b8051cfc1d9807d493f01d1a2b7bd1ea0fda9efcf61040dea22b20a50e58.png)

Whilst on the subject of HSTS, I would also go ahead and check the configuration, and then preload your site via the [HSTS Preload](https://hstspreload.org/) site. This list of sites is bundled into all browsers, meaning that visitors that have never viewed your site before will do so via HTTPS first time, no matter what they type into their address bar 👍🏻

Here are all the security-related settings I apply via the `cloudflare_zone_settings_override` object, along with comments on what they do:

```hcl
resource "cloudflare_zone_settings_override" "settings" {
  settings {
    always_use_https = "on"           # Redirect HTTP to HTTPS
    automatic_https_rewrites = "on"   # If any links in HTML are insecure, rewrite them
    min_tls_version = "1.2"           # Disable insecure TLS v1.1 and below
    ssl = "strict"                    # Connect to my origin using HTTPS
    tls_1_3 = "zrt"                   # Enable TLS v1.3 with 0-RTT
  }
}
```

With these applied running a [GlobalSign SSL Server Test](https://globalsign.ssllabs.com/) results in:

![GlobalSign SSL Report](globalsign-ssl-report.6d3b999a2404074165b1d25a1a5744702bcb055fa3dba90eb3ccdbcc47037966.png)

🔐🔐🔐

## Acceleration
By default, Cloudflare's CDN will cache static assets. You can read more about which extensions they are [here](https://support.cloudflare.com/hc/en-us/articles/200172516-Which-file-extensions-does-Cloudflare-cache-for-static-content). As this is a statically generated site, I apply the following zone settings via Terraform:

```
resource "cloudflare_zone_settings_override" "settings" {
  settings {
    browser_cache_ttl = 0        # Respect existing headers
    cache_level = "simplified"   # Ignore query string when caching - may not be applicible for your site
  }
}
```

...and then in the `nginx.conf` file:

```nginx
location / {
  root   /usr/share/nginx/html;
  index  index.html;

  # Cache static assets for at least a month
  location ~* \.(png|ico|txt|svg|webmanifest|css|js)$ {
    expires 1M;
  }

  # Cache more dynamic content for 1h
  location ~* \.(html|xml)$ {
    expires 1h;
  }
}
```

Lastly, to enable caching of HTML on the edge nodes in the Cloudflare network I apply the following Page Rule:

```hcl
resource "cloudflare_page_rule" "naked" {
  zone     = "sigma957.net"
  target   = "sigma957.net/*"
  priority = 1

  actions = {
    cache_level = "cache_everything"
    edge_cache_ttl = 2419200
  }
}
```

Basically 'cache everything for a month on the edge'. If you are interested in more details, I would highly recommend reading [How do I cache static HTML?](https://support.cloudflare.com/hc/en-us/articles/200172256-How-do-I-cache-static-HTML-) by Cloudflare.

With these settings in place, this is what the site reports when scanned with [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/):

![PageSpeed Insights](pagespeed-insights.94d85c2d7df46f30dd5335c70efe4a2efa05c9496ee8457f55c5c676fda83a06.png)

🚀🚀🚀

## Conclusion
I think you will agree that making use of Cloudflare brings considerable benefits to any website. Whilst I may need to make some future tweaks to the caching of HTML and XML, overall I am very happy with the configuration as it is.

I am working on a few more blog posts about how I am going to further improve the security and performance of my origin using Cloudflare's [Argo Smart Routing](https://www.cloudflare.com/products/argo-smart-routing/). A product I have been using since it's, rather cool, beta name of 'Cloudflare Warp'.

In the meantime, feel free to get in contact if you have any questions.