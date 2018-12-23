---
title: "Signing Git Commits"
date: 2018-12-23T21:20:53Z
draft: true
featuredImg: ""
tags: 
  - tag
---

signing git commits with GitLab

Signing commits
https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/

1. Install GPG Suite 2017.1 from https://gpgtools.org
2. After install:
  - Name
  - Email
  - Password (1Password)
  - Advanced
    - Key type: RSA and RSA
    - Length: 4096
    - Uncheck 'Key expires'
3. Export and 'Include secret key in exported file', store in 1Password
4. Make git use gpg2:
  - git config --global gpg.program gpg2

+++ Create new iTerm session

5. Add to your GitLab account: https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/#adding-a-gpg-key-to-your-account
6. Associate GPG key with git: https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/#associating-your-gpg-key-with-git
7. Sign all commits with:
  - git config --global commit.gpgsign true
8. Restart SourceTree
9. That's it!


- subkeys
- personal account
- email signing
