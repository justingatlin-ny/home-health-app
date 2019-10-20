const fs = require('fs');
const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "development";

console.log(`isDevelopment: ${isDevelopment}`);

module.exports = {
  entry: ["@babel/polyfill", "./src/index.js"],
  mode: isDevelopment ? "development" : "production",
  watch: isDevelopment,
  // watchOptions: {
  //   ignored: ["node_modules", "server", "uploads", "htdocs"]
  // },
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
  stats: "normal",
  devtool: "",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(require('./utils/manageDotEnv')())
  ]
};
