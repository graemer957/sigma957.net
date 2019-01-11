---
title: "Signing Git Commits"
date: 2019-01-10T16:37:00Z
draft: false
tags:
  - git
  - security
---
Not sure about you, but I often wondered where the 'Verified' badge came from on git commits in the GitLab:

![Signed Commits in GitLab](signed-commits-on-gitlab.d45e047fc0a74ee22d2ffbb74379a154ef7e70e0d29f8ab001346e6018cdca68.png)

...and GitHub web UIs:

![Signed Commits in GitHub](signed-commits-on-github.4a307385f5301ef6b106673e4c546d64eeffa6112792042b622d5ec7937eb1b9.png)

On both sites clicking the 'Verified' button opens a panel that explains that the commit was signed with a verified signature. Helpfully, they both also provide links to follow on how to set it up. If you want to see either of those they are:

* [Signing commits with GPG](https://gitlab.com/help/user/project/repository/gpg_signed_commits/index.md) from GitLab. I actually found two links to this article, the only difference I can see is the styling.
* A list of articles for [Managing commit signature verification](https://help.github.com/articles/managing-commit-signature-verification/) on GitHub

This blog post is the distilled process I followed to configure them both.

## Generating a GPG key
As I did not have an existing GPG key, I needed to generate one. However, if you already have one you can skip this section.

1. I chose to install the excellent [GPG Suite](https://gpgtools.org) for macOS to get the GPG toolchain.
2. After the installation, you are prompted to create a new key. I filled out the dialogue box in the following way:

![GPG Keychain for macOS](gpg-keychain-for-macos.4bf36b4b6989dfa4d1c083a84856080fa1ce333a312eebd4724a9fc6baad041e.png)
3. After generating the key, I wanted to make a backup immediately. To do this you can export, by right-clicking and choosing the option 'Include secret key in exported file'. This file can then be put into your password manager of choice, in my case [1Password](https://1password.com/).

At this stage, you could also go ahead and generate additional GPG keys, eg, for your work email address.

## Configuring git
1. Firstly, we need to configure git to use the `gpg` tool for signing. That is easy enough with:
```bash
git config --global gpg.program gpg
```

2. For me, I want every future commit being signed. This saves having to add `-S` to each `git commit` command. If you are the same, you can tweak your git config with:
```bash
git config --global commit.gpgsign true
```

3. git needs to know the signing key to use. Start by getting a list of all your keys[^1]:
```bash
gpg --list-secret-keys --keyid-format LONG
```
```
sec   rsa4096/30F2B65B9246B6CA 2017-08-18 [SC]
          D5E4F29F3275DC0CDA8FFC8730F2B65B9246B6CA
uid                   [ultimate] Mr. Robot <your_email>
ssb   rsa4096/B7ABC0813E4028C0 2017-08-18 [E]
```

4. You can see the signing key in the output above is the hex output after 'rsa4096', ie `30F2B65B9246B6CA`. My global git config uses my personal email address unless overridden by any specific project. Therefore it makes sense to also use my personal GPG key:
```bash
git config --global user.signingkey 30F2B65B9246B6CA
```

5. If you want to override for a particular project that can be easily achieved by adding the following into the local `.git/config`:
```
[user]
	name = Graeme Read
	email = graeme@work
	signingkey = 1234567890ABCDEF9
```

From this point on, each time you use `git commit -m <commit message>` the commit will be also be signed.

No doubt you are using a git GUI, so you will be pleased to know this configuration should 'just work'. If you are on the lookout for one, I would highly recommend the git client [Fork](https://git-fork.com/) for macOS and Windows.

## Adding to GitLab
1. Navigate to your Settings (menu top right) and then to [GPG keys](https://gitlab.com/profile/gpg_keys)

2. Copy and paste your PGP public key block into the text field. This can be found in the `.asc` file we exported above. You need to include everything including the header and footer:
```
-----BEGIN PGP PUBLIC KEY BLOCK-----
<your public key block>
-----END PGP PUBLIC KEY BLOCK-----
```
For example[^1]:
![GitLab PGP block in text field](gitlab-pgp-block-in-text-field.6238c1072b5affdcc1a6d22560e11460943f53d4d14d9b935d6e12704e02eff8.png)

3. Lastly, click on the 'Add Key' and you should be greeted with the following[^1] which confirms your key is added and valid:
![GitLab PGP key adde](gitlab-pgp-key-added.34026d669eb694f11027c5f255c8ef9a5c79f51710921547ee55cbb40b2e6cdb.png)

## Adding to GitHub
The process is extremely similar to GitLab's:

1. Navigate to Settings (menu top right) and then to [SSH and GPG keys](https://github.com/settings/keys)

2. Click `New GPG Key`

3. Copy and paste your PGP public key block and then click `Add GPG key`

## Wrapping Up
That's it! Next time you make a commit to a git project `gpg` will sign the commit using the specified key. After you push the changes to GitLab or GitHub you should see the 'Verified' badge.

Feel free to get in contact if you have any questions.

---

[^1]: Examples are borrowed from the GitLab instructions