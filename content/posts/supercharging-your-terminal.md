---
title: "Supercharging Your Terminal [Updated 25/11/2023]"
date: 2018-12-25T08:58:00Z
draft: false
tags: 
  - shell
  - zsh
---
Merry Christmas everyone 🎅🏻🎄

For today's blog post, I am re-publishing an article I originally wrote for my company blog on 7th May 2017.

---

In all likelihood, since I started using a Mac, I have been using the stock Terminal with the **Pro** theme. This has mostly suited me well, but there are a handful of things I always thought could be improved.

Inspired by a [blog post](https://medium.com/salesforce-ux/iterm2-with-zsh-shell-5944ee0502ac) and a colleague at work who recently showed me their shell, reignited my interest in updating my setup. This article is the result of the steps I used to set up my terminal.

- Install the excellent [iTerm2](http://www.iterm2.com) which brings some nifty features.

- On newer versions of macOS, simply update the version of `zsh` by:
```bash
brew install zsh zsh-completions
```

- On older versions of macOS (before Catalina I believe), set up `zsh` as the default shell. Snipped from the [setup instructions](https://github.com/robbyrussell/oh-my-zsh/wiki/Installing-ZSH):
```bash
brew install zsh zsh-completions
echo "/usr/local/bin/zsh" >> /etc/shells
chsh -s $(which zsh)
```

- Install [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh#via-curl):
```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

- Download and Install [Powerline Fonts](https://github.com/powerline/fonts):
```bash
git clone git@github.com:powerline/fonts.git
./install.sh
```

- Change font used in iTerm2:
  1. Navigate to `Profiles`
  2. Then `Text`
  3. Choose `Roboto Mono Light for Powerline`
  4. Bump the default font size to `14`

- Edited my `~/.zsh` file:
  - Change `ZSH_THEME` from the default to '[powerlevel10k/powerlevel10k](https://github.com/romkatv/powerlevel10k)'
 - Add `DEFAULT_USER="<your username>"` to stop seeing **user@host**
 - Update the plugins so `plugins=(git git-flow git-extras web-search)`

- Changed colour present in iTerm2 to '[Darkside](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Darkside.itermcolors)'

---

Once all this is done, this is what your shell should look like:

![Supercharged Terminal](supercharged-terminal.00098f4453b2b35616830d7f192c7e07d4ca5821ef2cad7108102636a8e51e0d.png)

You can see the time, current working directory and git status in my prompt. Also, notice the git status showing the current branch `master`, tag `v0.3`, the `●` representing changes and lastly the `?` to signify a new file. Pretty cool, huh?

---

_Update_: Found this interesting counter [article](https://joshtronic.com/2017/02/12/you-may-not-need-oh-my-zsh/) since posting

_Update 2_: Installing the [Shell Integration](http://iterm2.com/documentation-shell-integration.html) enables extremely handy shortcuts like Cmd+Shift+A to select previous commands output and _Auto Command Completion_

_Update 3_: `zsh` is now the default shell in macOS, so clarified that switching shells only relates to the older versions

_Update 4_: Clarify font settings in iTerm2

_Update 5_: Update ZSH theme to [Powerlevel10k](../updating-to-powerlevel10k)