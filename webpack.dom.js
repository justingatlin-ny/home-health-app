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
  entry: "./src/index.js",
  mode: isDevelopment ? "development" : "production",
  watch: isDevelopment,
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
    publicPath: "/build/public",
    filename: "bundle.js"
  },
  stats: "errors-only",
  devtool: isDevelopment ? "source-map" : "",
  plugins: [new webpack.HotModuleReplacementPlugin()]
};
