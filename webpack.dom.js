const fs = require('fs');
const path = require("path");

const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  entry: ["@babel/polyfill", "./src/index.js"],
  mode: isDevelopment ? "development" : "production",
  watch: isDevelopment,
  watchOptions: {
    ignored: ["node_modules", "htdocs", "logs", "server", "uploads"]
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
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, 'htdocs', 'public'),
    publicPath: "./",
    filename: "bundle.js"
  },
  stats: "errors-only",
  devtool: "source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {from:'src/images',to:'images'} 
  ]),
    new webpack.DefinePlugin(require('./utils/manageDotEnv')())
  ]
};
