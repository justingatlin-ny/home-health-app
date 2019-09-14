require("dotenv").config({ 
  encoding: 'utf8',
  debug: (process.env.DOT_ENV_DEBUG==='true' ? process.env.DOT_ENV_DEBUG : false)});
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  entry: ["@babel/polyfill", "./src/index.js"],
  mode: isDevelopment ? "development" : "production",
  watch: isDevelopment,
  watchOptions: {
    ignored: ["node_modules", "server", "uploads", "buiild"]
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
    path: path.resolve(__dirname, "build/public"),
    publicPath: "./",
    filename: "bundle.js"
  },
  stats: "errors-only",
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
