const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  output: {
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    alias: {
      "@zxing/library": "@zxing/library/esm/index.js",
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public" }],
    }),
    new HtmlWebpackPlugin({
      title: "Diversity Puzzle Trails",
    }),
  ],
  devServer: {
    historyApiFallback: true,
  },
};
