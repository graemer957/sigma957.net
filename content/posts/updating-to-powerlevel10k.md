---
title: "Updating to Powerlevel10k"
date: 2023-11-25T05:33:00Z
draft: false
tags: 
  - shell
  - zsh
---
Sometime in the last year I upgraded my [terminal](../supercharging-your-terminal) to use [Powerlevel10k](https://github.com/romkatv/powerlevel10k) and forgot to blog about it ☺️

The primary driver for me is the increased speed of the terminal prompt, see the section in the project's README about [Uncompromising performance](https://github.com/romkatv/powerlevel10k#uncompromising-performance).

The installation steps when using [Oh My Zsh](https://github.com/romkatv/powerlevel10k#oh-my-zsh) on the project's page are clear enough, however I also want to record my answers to running `p10k configure`:

1. Install Meslo Nerd Font?
   > No. Use the current font.

   I prefer the [Roboto Mono Light for Powerline](../supercharging-your-terminal) font.

2. Does this look like a diamond (rotated square)?
   > Yes.

3. Does this look like a lock?
   > No.

   I suspect this is because I do not have [fontawesome](https://fontawesome.com) installed.

4. Let's try another one. Does this look like a lock?
   > No.

5. Prompt Style
   > Rainbow.

6. Character Set
   > Unicode.

7. Show current time?
   > No.

8. Prompt Separators
   > Angled.

9. Prompt Heads
   > Sharp.

10. Prompt Tails
    > Flat.

11. Prompt Height
    > One line.

12. Prompt Spacing
    > Compact.

13. Prompt Flow
    > Concise.

14. Enable Transient Prompt?
    > No.

15. Instant Prompt Mode
    > Verbose (recommended).

    This is the primary reason for wanting to switch - no prompt lag! See [How do I configure instant prompt?](https://github.com/romkatv/powerlevel10k/blob/master/README.md#how-do-i-configure-instant-prompt) for a longer explanation of the different options and caveats.

Enjoy the increased productivity 🚀