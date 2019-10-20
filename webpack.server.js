const path = require("path");
const webpack = require("webpack");

const isDevelopment = process.env.NODE_ENV === "development";

// console.log(`isDevelopment: ${isDevelopment} - WEBPACK_ERRORS: ${process.env.WEBPACK_ERRORS}`);
const envs = require('./utils/manageDotEnv')();
const plugins = [
  new webpack.DefinePlugin(envs)
]

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

  devtool: "",
  target: "node",
  stats: "normal",
  plugins
};
