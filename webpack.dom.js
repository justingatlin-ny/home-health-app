require('./utils/manageDotEnv');

const fs = require('fs');
const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  entry: ["@babel/polyfill", "./src/index.js"],
  mode: isDevelopment ? "development" : "production",
  watch: isDevelopment,
  watchOptions: {
    ignored: ["node_modules", "server", "uploads", "htdocs"]
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, 'htdocs', 'public'),
    publicPath: "./",
    filename: "bundle.js"
  },  
  stats: process.env.WEBPACK_ERRORS || "errors-only",
  devtool: isDevelopment ? "inline-source-map" : "",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      title: "Upload Documents",
      template: "./src/index.html",
      filename: "./index.html" //relative to root of the application
    })
  ]
};
