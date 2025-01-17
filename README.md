# sigma957.net

Personal website built using [Hugo](https://gohugo.io) with the [m10c](https://github.com/vaga/hugo-theme-m10c) theme.

## Initial Setup

1. `hugo new site sigma957.net`.
2. `git init`.
3. Use fork to commit.
4. Create project on GitLab and push.
5. Switch theme to `m10c` with `git clone https://github.com/vaga/hugo-theme-m10c themes/m10c` and then add `theme = "m10c"` to `config.toml`.

## Running locally

1. Clone the GitLab or GitHub repo.
2. `git submodule update --init --recursive` to pull down the theme, see: https://stackoverflow.com/a/1032653/495036.
3. `hugo server -D` to spin up server locally, whilst also reviewing drafts.

## Update theme

`git submodule update --recursive --remote`, see https://stackoverflow.com/a/1032653/495036.

## Creating favicons

Picked the infinity symbol from [icons8](https://icons8.com/icon/set/royalty-free-infinity/color) with the following custom colours:
* Dark colour - #494f5c (73, 79, 92)
* Light colour - #c6cddb (198, 205, 219)

Bit of a cheek as they only let you download a 96x96 without paying mega £££, but free is free!

With downloaded icon then used the excellent [realfavicongenerator](https://realfavicongenerator.net) site to do the magic. May have tweaked some of the options for background colours and such.
