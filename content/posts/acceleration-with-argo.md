---
title: "Acceleration With Cloudflare Argo"
date: 2019-01-14T12:21:00Z
draft: false
tags:
  - cloudflare
  - performance
---
So far on this blog, I have only discussed Cloudflare offerings that have carried no cost. Today, I would like to explore the first of their excellent paid services - [Cloudflare Argo](https://www.cloudflare.com/products/argo-smart-routing/).

When a visitor to the site requests a page that is not in the cache of the Cloudflare CDN edge node closest to them, a roundtrip needs to be made to the origin. Normally this would be made over the public Internet, taking whichever route traffic happened to be advertised at the time. There is no guarantee that the route chosen is going to be reliable or uncongested. This is perfectly 'normal' for Internet traffic. In fact, this is exactly why TCP was designed - to guarantee packet delivery over the unknown. In the case that a packet fails to reach its destination, it will be re-sent until successfully received. However, this obviously introduces an extra delays for the visitor.

With Argo Smart Routing, Cloudflare takes control of the route from the edge node to the origin by using their own data centres and network. They use real-time information to ascertain the best route to take at any given time. The last hop is then from the data centre closest to the origin back over the public Internet - reducing the amount of dropped packets and improving performance. Sadly, I could not find detailed technical information about how the data flows inside the Cloudflare network, ie, persistent HTTP/2 connections between data centres, some proprietary protocol or maybe even QUIC?

When enabling Argo there are two additional benefits:

* Tiered Caching - which, from what I understand, uses any cached data in nearby data centres to avoid the roundtrip to the origin
* [Tunnelling](https://developers.cloudflare.com/argo-tunnel/) - I plan on covering in other in-depth blog posts as there are some really cool things you can do 🤓

The cost of Argo is $5 (~£3.96) per month for the first 1 GB of traffic and then an additional $0.10 (~£0.08) per gigabyte. Examples of costs per month:

| Traffic | Argo Feature | Bandwidth charge | Total   |
|:-------:|:------------:|:----------------:|:-------:|
| 1 GB    | $5           | $0               | $5      |
| 100 GB  | $5           | $10              | $15     |
| 500 GB  | $5           | $50              | $50     |
| 2 TB    | $5           | $204.80          | $209.80 |

However I look at it, that is extremely good value!

So, what about the performance gains? To answer this question, I ran a series of tests using the [Pingdom Website Speed Test](https://tools.pingdom.com/) as they have test locations dotted around the globe. My testing methodology was as follows:

1. Using the [Cloudflare Dashboard](https://dash.cloudflare.com/) purge the entire cache
2. Wait 1 minute (Cloudflare advise at least 30 seconds)
3. Run speed test from the next location
4. Validate the `cf-cache-status` header of each request to ensure it was fetched from the origin. More information about this header is in the Cloudflare Support article titled '[What do the various Cloudflare cache responses (HIT, Expired, etc.) mean?](https://support.cloudflare.com/hc/en-us/articles/200168266-What-do-the-various-CloudFlare-cache-responses-HIT-Expired-etc-mean-)'
5. Record results and repeat for next location

I then enabled Argo and re-ran the test from each location again. Here are my results:

| Test from                            | Before (s) | After (s) | Change |
|:-------------------------------------|:----------:|:---------:|:------:|
| Asia - Japan - Tokyo                 | 2.25       | 2.01      | 10.67% |
| Europe - Germany - Frankfurt         | 0.333      | 0.149     | 55.26% |
| Europe - United Kingdom - London     | 0.932      | 0.174     | 81.33% |
| North America - USA - Washington D.C | 1.07       | 0.962     | 10.09% |
| North America - USA - San Francisco  | 1.76       | 1.31      | 25.57% |
| Pacific - Australia - Sydney         | 3.18       | 2.68      | 15.72% |
| South America - Brazil - São Paulo   | 1.76       | 1.5       | 14.77% |

The results from Europe are a little confusing given that my origin is based in London! I would have expected the largest gains from furthest away. Normally I would repeat each test at least 3 times, but kept hitting rate limits in the testing tool. Time permitting I may dig deeper into performance testing at some point in the future. That being said I feel the improvements are impressive.

Under the Analytics > Performance section of the [Cloudflare Dashboard](https://dash.cloudflare.com/) is a detailed breakdown of origin and geographical response times, alas I have not waited long enough for mine to appear yet:

![Argo analytics pending from Dashboard](argo-analytics-pending-from-dashboard.0658883e177946107643b0c159dc040a6514957c0c9a6a6b8436c14dce8529af.png)

I will update this post when the information is available 🙂

If you are wondering what it took to gain these performance benefits, you will be pleased to know it was as simple as flicking a switch:

![How to enable Argo](how-to-enable-argo.6281ce4c1b4529dc859d910f431fea10439f5d22860e0864d78caf370f20fd70.png)

🚀🚀🚀

Feel free to get in contact if you have any questions.