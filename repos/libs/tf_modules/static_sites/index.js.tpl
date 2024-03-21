'use strict'
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

function cleanHost(host) {
  return host.replace(/^https?:\/\//, '')
}

// origin request handler
module.exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request
  // either get it from the origin header or the host header
  let requestHost =
    (request.headers.origin && request.headers.origin[0].value) ||
    request.headers.host[0].value
  requestHost = cleanHost(requestHost)

  console.log('------------ event')
  console.log(JSON.stringify(event, null, 2))
  console.log('------------ request')
  console.log(JSON.stringify(request, null, 2))
  console.log(`domainName = ` + JSON.stringify(request.origin))
  console.log(`original host = ` + requestHost)
  console.log(`original uri = ` + request.uri)

  if (requestHost.split('.').length <= 2) {
    requestHost = 'www.' + requestHost
    console.log(`add www to host = ` + requestHost)
  }

  // if not trying to get a file then assume clientside routing
  if (request.uri.indexOf('.') === -1) {
    const testCandidate = requestHost + request.uri + `/index.html`
    console.log(`uri does not contain . checking s3 for = ` + testCandidate)

    return s3
      .headObject({
        Bucket: '${S3_BUCKET_NAME}',
        Key: testCandidate,
      })
      .promise()
      .then(
        // If index.html exists for the route
        () => {
          console.log(`test candidate was found = ` + testCandidate)
          request.uri = '/' + testCandidate
          console.log(`transformed uri (test candidate found) ` + request.uri)
          callback(null, request)
        },
        // If it doesn't then assume client-side routing
        (e) => {
          console.log(e)
          console.log(`test candidate was NOT found = ` + testCandidate)
          request.uri = `/` + requestHost + `/index.html`
          console.log(`transformed uri (test candidate not found) ` + request.uri)
          callback(null, request)
        }
      )
  }
  request.uri = `/` + requestHost + request.uri
  console.log(`transformed uri` + request.uri)
  callback(null, request)
}

