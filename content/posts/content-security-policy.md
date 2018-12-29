---
title: "Content Security Policy"
date: 2018-12-29T17:11:00Z
draft: false
tags: 
  - security
---
Running this site via the excellent [Security Headers](https://securityheaders.com) security tool results in the following report summary:

![Initial Security Report Summary](no-csp-header.2bd14f76cc0f0c18936e07ffb1ffdc750933faff618ad3fb6991a0963b678fb1.png)

An A rating is pretty good, putting it within the top 25% receiving that rating. I would rather achieve the A+ rating, putting it within the top 3% 😁

What is missing is a `Content-Security-Policy` header, so let us see what can be done.

## What is it?
Not being a front-end web engineer I was not immediately familiar with this initiative, so embarked on research into the details. Good starting places are:

* [Content Security Policy - An Introduction](https://scotthelme.co.uk/content-security-policy-an-introduction/) by Scott Helme, the author of the Security Headers tool
* [Content Security Policy (CSP) Quick Reference Guide](https://content-security-policy.com/)

To quote Scott's article:

> Content Security Policy is delivered via an HTTP response header, much like HSTS, and defines approved sources of content that the browser may load. It can be an effective countermeasure to Cross Site Scripting (XSS) attacks and is also widely supported and usually easily deployed.

## Setting the header
As I am using nginx to serve my static site the answer to this is pretty straightforward. In my custom `nginx.conf` I can add an additional header using:

```
add_header Content-Security-Policy "<policy>";
```

The **big** question is what should the `<policy>` be?

## How to determine the policy?
This site is generated using [Hugo](https://gohugo.io), which I imagined would be 'doing the right thing'. Ergo, I figured a good starting place would be to define the following `Content-Security-Policy`:

```
add_header Content-Security-Policy "default-src 'self'";
```

Opening the site in Chrome with the developer tools, showed the following errors on the homepage:

![Chrome Console Errors at root](chrome-console-root.b390cd04196613b41b9d002d3a2bf34ba01210876ae139d8e46ea2e99af53fab.png)

The second error is occuring because the following `<script>` is not being allowed to execute, due to the CSP:

```js
<script>let haveHeader = false;</script>
```

As suggested by the error message, I added the hash to the CSP for this particular script:

```
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'sha256-mzxFK7/AUlIhalqxiKcyRO9mSXWeALlmGjRumxphi9M='";
```

Refreshing the page fixed these errors 👍🏻. Next, I visited [about me](/about) and got 3 more errors in the console:

![Chrome Console Errors on About Me](chrome-console-about-me.8c649fab3828886a61abc5abb56b47c7faebcdf32579e3bd88359d8c82733106.png)

Interestingly, the latter two errors are caused by a very similar script as above. However, this time `haveHeader` is being set to `true`. Surely enough added the suggested hash to the CSP resolved these.

Unfortunately, adding the suggested hash for the `style-src` did not resolve that error. I am unsure why, so I have temporarily gone with the second suggestion of adding `unsafe-inline`. Navigating around the rest of the site did not result in any more console errors due to blocked content. This leaves us with an initial `Content Security Policy` of:

```
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'sha256-mzxFK7/AUlIhalqxiKcyRO9mSXWeALlmGjRumxphi9M=' 'sha256-AnD4MU8ryLQfUOxyB+K8iDV82R0rMK6os4wCSP8Cqqo='; style-src 'self' 'unsafe-inline';";
```

## Wrapping up
Having gone through this exercise, let's re-run the security header check and see what the rating now is:

![Latest Security Report Summary](csp-header.0af1c14d38d813385579bfd2296fc1360655f0dcfeb8f0a49dddddcc1181c71f.png)

An A+ rating - excellent... This earns us a spot in the 'Hall of Fame', albeit temporarily:

![Security Headers Hall of Fame](hall-of-fame.02414b59c3f6a5af9f846e931fc59ba8659597394f6c4db2d5ca7b38012cb140.png)

Obviously should the scripts for setting `hasHeader` change this CSP will break. In addition, I am not entirely thrilled by having `unsafe-inline` for `style-src`. Therefore, I will reach out to the author of the theme I am using to find out if there is a better way™