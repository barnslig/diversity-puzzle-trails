const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const config = require("./webpack.config");

module.exports = {
  ...config,
  mode: "production",
  plugins: [...config.plugins, new BundleAnalyzerPlugin()],
};
