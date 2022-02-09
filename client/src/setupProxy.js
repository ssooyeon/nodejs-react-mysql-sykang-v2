const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/weather", {
      target: "http://apis.data.go.kr",
      pathRewrite: {
        "^/weather": "",
      },
      changeOrigin: true,
    })
  );
};
