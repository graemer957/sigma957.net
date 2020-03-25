# Build website using Hugo
FROM registry.gitlab.com/graemer957/hugo AS builder

WORKDIR /site
COPY . .
RUN hugo version
RUN hugo

# Use nginx for serving
FROM nginx:1.16.1-alpine
LABEL maintainer="Graeme Read <graeme@sigma957.net>"
LABEL description="Website for sigma957.net"

RUN apk add --update \
    bash \
    build-base \
    && rm -rf /var/cache/apk/*

# Website content
COPY --from=builder /site/public/ /usr/share/nginx/html/

# nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
