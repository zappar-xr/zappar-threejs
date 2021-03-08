const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    simple: "./puppeteer/module/simple.ts",
    face: "./puppeteer/module/face.ts"
  },
  devtool: 'inline-source-map',
  output: {
    filename: "[name].js",
    path: __dirname + '/puppeteer-dist'
    },
  plugins: [
    new HtmlWebpackPlugin({
        template: 'puppeteer/module/index.html',
        filename: 'simple.html',
        chunks: ['simple']
    }),
    new HtmlWebpackPlugin({
        template: 'puppeteer/module/index.html',
        filename: 'face.html',
        chunks: ['face']
    }),
    new webpack.IgnorePlugin(/^fs$/)
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".wasm"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader", options: { configFile: "tsconfig.puppeteer.json" }},
      {
        test: /zcv\.wasm$/,
        type: "javascript/auto",
        loader: "file-loader"
      }
    ]
  },
  devServer: {
        contentBase: './puppeteer-dist',
        https: true,
        hot: false,
        inline: false,
        host: '0.0.0.0'
    }
};