---
title: "WIP: SSH via Cloudflare Access"
date: 2019-01-22T12:03:00Z
draft: true
tags:
  - cloudflare
---
Installing cloudflared
1. https://developers.cloudflare.com/argo-tunnel/downloads/
	- 64bit DEB
2. scp to host
3. sudo apt install ./cloudflared-stable-linux-amd64.deb
4. Install cloudflared locally (cloudflared version 2020.3.1 (built 2020-03-27-1737 UTC))
5. `cloudflared login`:
```
A browser window should have opened at the following URL:

https://dash.cloudflare.com/argotunnel?callback=...

If the browser failed to open, please visit the URL above directly in your browser.
INFO[0031] Waiting for login...
You have successfully logged in.
If you wish to copy your credentials to a server, they have been saved to:
/Users/graemer/.cloudflared/cert.pem
```
6. Create access policy
   Application Name: <hostname>
   Subdomain: <hostname>
   Session Duration: 15 Minutes
   Policies:
     1.
       Policy Name: Permit SSH
       Decision: Allow
       Include: Emails: graeme@sigma957.net
7. Copy cert.pem to server
9. cloudflared tunnel --hostname vir.sigma957.net --url ssh://localhost:22 --origincert cert.pem

<interatively running>

10. Generate a new "Short-Lived Certificate" via the Access dashboard, selecting your application (virtual machine name) from the dropdown
11. Create user on machine with username that matches name before @ from step 6. Add to docker group. Edit `/etc/sudoers.d/...` to include new user.
## Saving CA public key
12. cd /etc/ssh
13. sudo vi ca.pub
...paste in public key from step 10
14. sudo vi sshd_config
Find `# PubkeyAuthentication yes` and remove `#`
Add line below `TrustedUserCAKeys /etc/ssh/ca.pub`
15. Restart SSH Server with `sudo service ssh restart`
16. Locally `cloudflared access ssh-config --hostname vir.sigma957.net --short-lived-cert` and add output to `~/.ssh/config`

```
Add to your /Users/graemer/.ssh/config:

Host vir.sigma957.net
  ProxyCommand bash -c '/usr/local/bin/cloudflared access ssh-gen --hostname %h; ssh -tt %r@cfpipe-vir.sigma957.net >&2 <&1'

Host cfpipe-vir.sigma957.net
  HostName vir.sigma957.net
  ProxyCommand /usr/local/bin/cloudflared access ssh --hostname %h
  IdentityFile ~/.cloudflared/vir.sigma957.net-cf_key
  CertificateFile ~/.cloudflared/vir.sigma957.net-cf_key-cert.pub
```

17. 





cloudflared tunnel --hostname vir.sigma957.net --url ssh://localhost:22 --origincert cert.pem


Mar 31 15:10:46 vir cloudflared[32447]: time="2020-03-31T15:10:46Z" level=info msg="Version 2020.3.1"


Locally
10. cloudflare version & update
11. cloudflared access ssh-config --hostname g-aws.sigma957.net
	...copy output to ~/.ssh/config
Server
12. cd /etc/cloudflared
13. sudo mv ~ec2-user/cert.pem .
14. sudo chown root: cert.pem
15. sudo chmod 600 cert.pem
16. sudo vi config.yml
	hostname: g-aws.sigma957.net
	url: ssh://localhost:22
17. sudo chmod 600 config.yml
18. sudo su -
19. cloudflared service install
20. systemctl status cloudflared
21. systemctl start cloudflared

---

[ec2-user@g-aws ~]$ cloudflared version
> cloudflared version 2019.10.4 (built 2019-10-21-1955 UTC)

> cloudflared version 2020.3.1 (built 2020-03-27-1737 UTC)

---

See
	- https://developers.cloudflare.com/access/ssh/protecting-ssh-server/
	- https://developers.cloudflare.com/access/ssh/short-live-cert-server/
