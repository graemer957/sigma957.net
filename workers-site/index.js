import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

// See:
// - https://scotthelme.co.uk/security-headers-cloudflare-worker/
// - https://developer.mozilla.org/en-US/docs/Web/API/Response/headers
// - https://developers.cloudflare.com/workers/reference/apis/response/
let securityHeaders = {
  "X-Frame-Options": "SAMEORIGIN",
  "X-Xss-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Feature-Policy": "accelerometer 'none'; camera 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; payment 'none'; usb 'none'",
  "Content-Security-Policy": "default-src 'self' https://cloudflareinsights.com/cdn-cgi/rum; script-src 'self' https://static.cloudflareinsights.com/beacon.min.js; report-uri https://sigma957.report-uri.com/r/d/csp/reportOnly"
}

async function addHeaders(response) {
  let headers = new Headers(response.headers)

  Object.keys(securityHeaders).forEach(name => {
    headers.set(name, securityHeaders[name])
  })

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  })
}

async function handleEvent(event) {
  const url = new URL(event.request.url)
  let options = {}

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }
    // return await getAssetFromKV(event, options)

    // Add security headers as recommended by securityheaders.io
    let response = await getAssetFromKV(event, options)
    return addHeaders(response)
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 })
  }
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
function handlePrefix(prefix) {
  return request => {
    // compute the default (e.g. / -> index.html)
    let defaultAssetKey = mapRequestToAsset(request)
    let url = new URL(defaultAssetKey.url)

    // strip the prefix from the path for lookup
    url.pathname = url.pathname.replace(prefix, '/')

    // inherit all other props from the default request
    return new Request(url.toString(), defaultAssetKey)
  }
}