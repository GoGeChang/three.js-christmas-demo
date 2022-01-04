const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin  } = require("clean-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js"
  },
  module: {
    rules: [
      { test: /\.css$/, use: "css-loader" },
      { test: /\.ts$/, use: "ts-loader" },
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  devServer: {
    static: './dist',
    port:8099,
    hot: true,
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'mesh',
      template: "./index.html"
    }),
   new CleanWebpackPlugin ()
  ],
  
  stats: "errors-warnings",
  
}
