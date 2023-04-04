---
title: "Switching Themes"
date: 2023-04-04T11:37:48+01:00
draft: false
toc: false
images:
tags: 
  - hugo
---

I've been using the [hermit](https://github.com/Track3/hermit) theme for Hugo since creating this blog in 2018. Since then the number of updates to that theme have dwindled, so in the last few weeks I've been trying out some other minimilistic themes. Selecting [m10c](https://github.com/vaga/hugo-theme-m10c) as best suited for me.

This post covers the process to switch from one theme to the other.

1. Updated `.gitignore` from [https://gitignore.io](https://www.toptal.com/developers/gitignore/api/hugo). You will note I only selected Hugo from what is available, but you may want to add your IDE of choice to the list.

2. Add the new theme as a git submodule using:
```bash
git submodule add https://github.com/vaga/hugo-theme-m10c.git themes/m10c
```

3. Delete the old theme under `themes/hermit`. This was not added as a git submodule at the time.

4. Update the `config.toml` with correct parameters for the new theme. Check out the `README.md` and `exampleSite` for details.

5. Added avatar image for the new theme.

6. Updated the favicons. Should out to [https://realfavicongenerator.net](https://realfavicongenerator.net) for making this easy.
