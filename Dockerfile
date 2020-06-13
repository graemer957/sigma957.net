# Build website using Hugo
FROM registry.gitlab.com/graemer957/hugo AS builder

ARG DOMAIN

WORKDIR /site
COPY . .
RUN hugo version
RUN hugo -b $DOMAIN

# Deploy to Cloudflare Worker using wrangler
FROM registry.gitlab.com/graemer957/wrangler

ARG CF_ACCOUNT_ID
ARG CF_API_TOKEN
ARG CF_ZONE_ID
ARG SITE

WORKDIR /site
COPY --from=builder "site/workers-site" "workers-site/"
COPY --from=builder "site/wrangler.toml" "."

# Website content from hugo
COPY --from=builder "site/public" "public/"

RUN wrangler publish -e $SITE
