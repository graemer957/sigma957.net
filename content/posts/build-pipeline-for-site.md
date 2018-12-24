---
title: "Build Pipeline for Site"
date: 2018-12-23T23:22:00Z
draft: false
tags: 
  - gitlab
  - docker
  - devops
---
For the last several years I have been steadily increasing my usage of [GitLab](https://gitlab.com). Probably like all of you, I am pleasantly surprised by the wealth of features and the speed at which new ones are added.

Sure, at times, I have been a little disappointed by the reliability of the hosted solution, but since their move to GCP earlier this year I have to say the situation is much improved.

Two of the features I make heavy use of is the CI pipeline and Docker Registry.

## Docker Registry
By simply creating a new GitLab project you automatically get a private Docker Registry to host related images. The accessibility to this registry depends on how you have configured your project. The majority of my repositories are private, which only permit access to users I give access too. However, you can also choose to create a public project that will have a public registry.

Why not just use [Docker Hub](https://hub.docker.com/)? No particular reason, but I really like everything project-related being together in one place.

## CI Pipeline
By simply adding a `.gitlab-ci.yml` file to your project you can benefit from CI for any number of tasks. Eg, running project tests, building Docker Images or even deploying to staging/production.

To give you a concrete example, this site is currently built using the following `.gitlab-ci.yml` file:

```yml
variables:
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_NAME

stages:
  - build

build:
  stage: build
  image: docker:latest
  services:
   - docker:dind
  tags:
    - docker
  only:
    - tags
  before_script:
    - docker login -u gitlab-ci-token -p $CI_JOB_TOKEN registry.gitlab.com
  script:
    - docker build --no-cache --pull -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
```

In a nutshell:

* One stage pipeline called 'build'
* Use Docker in Docker to build Docker Image
* Only run on a shared runner that has the `docker` tag
* Login to the private Docker Registry hosted by GitLab
* Build and push the resulting Docker Image

## Docker Image
I plan to cover more details about this website in future posts, but in the meantime, you may be interested in what is in said Docker Image:

```Dockerfile
# Build website using Hugo
FROM registry.gitlab.com/graemer957/hugo AS builder
WORKDIR /site
COPY . .
RUN hugo

# Use nginx for serving
FROM nginx:1.14.2-alpine
COPY --from=builder /site/public/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
```

Breaking this down:

1. Build the website using a [custom Docker Image](https://gitlab.com/graemer957/hugo) containing [Hugo](https://gohugo.io)
2. Use nginx for serving the site
3. Copy the statically built site content for
4. Provide a custom `nginx.conf`

Any questions? Feel free to get in touch.