---
title: "DNS Hosting and Registrar"
date: 2018-12-24T17:16:03Z
draft: false
tags: 
  - cloudflare
  - dns
---
I think the first service I wanted to make use of from [Cloudflare](https://www.cloudflare.com) was their DNS hosting. This is because DNS is such a critical component and actually plays a large part in the performance of one's online presence.

When I have purchased a domain in the past, I have left its hosting on the registrar in question. Most of the time this was a company based here in the UK, not giving it a second thought. In reality, I had made a critical mistake!

Let's say I was hosting the API of my latest iOS app at api.myapp.com. Each time a client looked up this address, that could cause[^1] a roundtrip to my registrar's DNS server. Now let's say my users are based on the west coast of America - that is a transatlantic round trip!

## Cloudflare DNS
Cloudflare operates the [fastest authoritative](https://www.dnsperf.com/) DNS servers on the Internet. If that was not enough they also help [ISC](https://www.isc.org/) operate the [F-Root nameserver](https://blog.cloudflare.com/f-root/). Guess what? Also the fastest!

This is all achieved thanks to their [Anycast](https://en.wikipedia.org/wiki/Anycast) network and hosting at their 155+ data centres located around the world. I would highly recommend reading the [full details](https://www.cloudflare.com/dns/).

So now user can resolve api.myapp.com in sub-15ms vs 100ms plus! Not only that, but Cloudflare also protect your zone using their world-class DDoS protection! You may be wondering how much all this performance and security is all going to cost?

...it is **completely free!!** To get started, head to [signing up](https://dash.cloudflare.com/sign-up) where you will be guided through the whole process.

## Registrar
As if that was not enough, Cloudflare [recently announced](https://blog.cloudflare.com/using-cloudflare-registrar/) their entry into the [registrar](https://www.cloudflare.com/products/registrar/) business. What really stands out to me is their commitment to protecting their users **and** keep costs down. They are offering this service at wholesale prices. For me, this works out to be roughly half the cost per year than I was paying before. No-brainer!

I am lucky enough to have a place in the early access programme and have already moved this domain over to them. As an added bonus I now have [DNSSEC](https://en.wikipedia.org/wiki/Domain_Name_System_Security_Extensions) enabled. This was not possible before, because my registrar did not support it.

Alas, not all my domains are supported. Eg, the `.co.uk` and `.app` TLDs. That being said I have complete faith that this will not take long.

---

[^1]: The answer could be cached somewhere more locally but in worst case scenario.