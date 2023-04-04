---
title: "WIP: Tunnel host via SSH"
date: 2020-03-22T12:03:00Z
draft: true
tags:
  - 
---

Tunnel host via SSH
-------------------
git.wwe.com:443 -> AWS account 1 -> AWS account 2

1. Add new IP address to `lo0`:

sudo ifconfig lo0 alias 127.0.0.2

2. Edit /etc/hosts:

127.0.0.2	git.wwe.com

3. Create SSH tunnel:

sudo ssh -L 127.0.0.2:443:git.wwe.com:443 ec2-user@3.249.209.212 -i ~graemer/.ssh/prodops.pem

- create tunnel listening on port 443 on IP 127.0.0.2 only
- end of tunnel goes to git.wwe.com:443
- via gitlab-runner-3 using PEM file in my home directory

---

GitLab
------
sudo ssh -L 127.0.0.3:80:localhost:80 ec2-user@54.72.109.49 -i ~graemer/.ssh/prodops.pem
