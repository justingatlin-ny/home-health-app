const dotenv = require("dotenv");
const path = require("path");
const webpack = require("webpack");

const envFile = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);

const dotenvConfig = {
  path: envFile,
  debug: true
};

const dotenvResult = dotenv.config(dotenvConfig);

if (dotenvResult.error) throw dotenvResult.error;

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  watch: isDevelopment,
  watchOptions: {
    ignored: ["node_modules"]
  },
  entry: "./server/index.js",
  output: {
    path: path.resolve(__dirname, "build/"),
    publicPath: "/build/public",
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
  stats: "errors-only",
  plugins: []
};
