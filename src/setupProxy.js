const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/ajax',
    createProxyMiddleware({
      target: 'http://localhost:7000',
      changeOrigin: true
    })
  )
}
