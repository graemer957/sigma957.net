---
title: "MacBook Pro 2019 (T2) WiFi Issues"
date: 2025-02-21T00:00:00Z
draft: false
tags:
  - linux
---

My [laptop](https://support.apple.com/en-us/111997) is getting long in the tooth
to run macOS, so at some point in the last year, I switched it to running Linux.

I've tried running Linux on this laptop a few times, but thanks to the T2 chip
it seemed impossible until I came across [t2linux](https://wiki.t2linux.org/).

Using WiFi on this machine _seems_ to have been sketchy at best. Sometimes, it
would connect to networks just fine, but often it would simply refuse, even
though the correct password has been provided. Given I am taking it to
[Rust Nation 2025](https://www.rustnationuk.com/) for a workshop day, I really
needed it to work!

`lspci -k` tell me I have a:
```text
01:00.0 Network controller: Broadcom Inc. and subsidiaries BCM4364 802.11ac Wireless Network Adapter (rev 03)
```

The [WiFi/Bluetooth](https://wiki.t2linux.org/guides/wifi-bluetooth/) guide
has a large banner suggesting to use `iwd` as a backend until a regression
with `wpa_supplicant` v2.11 is resolved. I tried this, but still no luck.

After quite a lot of searching, I came across [this thread](https://bbs.archlinux.org/viewtopic.php?id=298025).
One of the [comments](https://bbs.archlinux.org/viewtopic.php?pid=2189161#p2189161)
talks about disabling offloading, which fixed my issue without needing to downgrade
`wpa_supplicant`.

In my case, I use `systemd`, so editing my default boot entry in
`/boot/loader/entries/arch.conf` by adding `brcmfmac.feature_disable=0x82000`
to the boot options.

I've raised a [small PR](https://github.com/t2linux/wiki/pull/615) to update the
documentation in the hope of saving time for others.
