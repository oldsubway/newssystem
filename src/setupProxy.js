const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  qpp.use(
    '',
    createProxyMiddleware({
      target: '',
      changeOrigin: true
    })
  )
}
