const { transform } = require("@formatjs/ts-transformer");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Webpack = require("webpack");

module.exports = {
  output: {
    clean: true,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              getCustomTransformers() {
                return {
                  before: [
                    transform({
                      overrideIdFn: "[sha512:contenthash:base64:6]",
                    }),
                  ],
                };
              },
            },
          },
        ],
      },
      {
        test: /lang\/[a-z_-]+\.json$/i,
        type: "json",
        use: [
          {
            loader: "shell-loader",
            options: {
              script:
                "cat > /tmp/lang.json && formatjs compile /tmp/lang.json --ast",
            },
          },
        ],
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
    new Webpack.EnvironmentPlugin({
      /**
       * API root without trailing slash, e.g. https://example.com/api
       */
      API_ROOT: "",

      /**
       * Whether to use the mock service worker instead of the real API
       */
      API_USE_MOCK: true,
    }),
  ],
  devServer: {
    historyApiFallback: true,
  },
};
