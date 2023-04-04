---
title: "WIP: SSHFP"
date: 2019-01-22T12:03:00Z
draft: true
tags:
  - cloudflare
  - dns
---
On server:

```
ssh-keygen -r <hostname>
```

...where <hostname> is the name of your host. For example "jerry"

Example output:
```
jerry IN SSHFP 1 1 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
jerry IN SSHFP 1 2 bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
jerry IN SSHFP 2 1 cccccccccccccccccccccccccccccccccccccccc
jerry IN SSHFP 2 2 dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
jerry IN SSHFP 3 1 eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
jerry IN SSHFP 3 2 ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
jerry IN SSHFP 4 1 gggggggggggggggggggggggggggggggggggggggg
jerry IN SSHFP 4 2 hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
```

Add entry into DNS:

```
resource "cloudflare_record" "sshfp-aw-d" {
  domain   = "sigma957.net"
  name     = "jerry"
  data     = {
    "algorithm" = 3,
    "type" = 2,
    "fingerprint" = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  }
  type     = "SSHFP"
  ttl      = 1
}
```

SSHFP on Cloudflare: https://blog.cloudflare.com/additional-record-types-available-with-cloudflare-dns/

Note only adding entry for algorithm 3 with type 2, ie, "ECDSA Public Key with SHA-256 Fingerprint". For more info check the RFCs:
* https://tools.ietf.org/html/rfc4255#section-3.1.1
* https://tools.ietf.org/html/rfc6594#section-5.3.2

- Connecting via Cloudflare Access needs entry in /etc/hosts to keep origin IP hidden.

- Also slight downside is configuration in ~/.ssh/config needs to use full hostname for it to be validated properly

```
Host jerry.sigma957.net
    User ec2-user
    IdentityFile ~/.ssh/jerry.pem
    ProxyCommand /usr/local/bin/cloudflared access ssh --hostname jerry.sigma957.net
    VerifyHostKeyDNS yes
    StrictHostKeyChecking yes
```

Validate entry:
`dig jerry.sigma957.net sshfp`

