require('./utils/manageDotEnv');

const path = require("path");
const webpack = require("webpack");

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  watch: isDevelopment,
  watchOptions: {
    ignored: ["node_modules", "htdocs", "logs", "src"]
  },
  entry: ["@babel/polyfill", "./server/index.js"],
  output: {
    path: path.resolve(__dirname, "htdocs/"),
    publicPath: "/htdocs/public",
    filename: "server-bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    modules: [
      "node_modules",
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "server")
    ]
  },

  devtool: isDevelopment ? "source-map" : "",
  target: "node",
  stats: process.env.WEBPACK_ERRORS || "errors-only",
  plugins: []
};
