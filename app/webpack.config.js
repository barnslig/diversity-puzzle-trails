const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Webpack = require("webpack");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = (env, argv) => {
  const config = {
    output: {
      clean: true,
      publicPath: "/",
      chunkFilename: "javascripts/chunks/[chunkhash].[name].js",
      filename: "javascripts/[contenthash].[name].js",
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|svg)$/i,
          type: "asset/resource",
        },
        {
          test: /\.tsx?$/,
          use: ["babel-loader"],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
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
        "@formatjs/icu-messageformat-parser":
          "@formatjs/icu-messageformat-parser/no-parser",
      },
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react",
          },
        },
      },
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "public" }],
      }),
      new HtmlWebpackPlugin({
        title: "Diversity Puzzle Trails",
        meta: {
          "theme-color": "#1976d2",
        },
      }),
      new Webpack.EnvironmentPlugin({
        /**
         * API root without trailing slash, e.g. https://example.com/api
         */
        API_ROOT: "",

        /**
         * Whether to use the mock service worker instead of the real API
         */
        API_USE_MOCK: false,
      }),
      new MiniCssExtractPlugin(),
    ],
    devServer: {
      historyApiFallback: true,
      hot: true,
    },
  };

  if (argv.mode === "production") {
    config.plugins.push(
      new WorkboxPlugin.GenerateSW({
        exclude: [
          /.+LICENSE\.txt$/,
          "mockServiceWorker.js",
          "robots.txt",
          "_redirects",
          "manifest.json",
        ],
      })
    );
  }

  return config;
};
