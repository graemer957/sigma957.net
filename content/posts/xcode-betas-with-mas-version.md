---
title: "Xcode betas with MAS version"
date: 2019-06-04T19:00:00Z
draft: false
tags: 
  - xcode
---
I have used a system for keeping the Mac App Store (MAS) version of Xcode alongside the latest Xcode beta that I thought might be worth sharing.

Firstly, I permit the MAS to install Xcode in its default location (`/Applications`).

I then create a folder called "Xcode betas" also under `/Applications` for the beta versions.

The trick so that the MAS does not upgrade/touch the wrong version of Xcode is to add this folder into the Spotlight Privacy tab like this:

![Spotlight Privacy](spotlight-privacy.7db2fd7e1a5fcb962ed8a442dcdb7f1932d43cfbb6a1b9cebb5870c505188ccd.png)
