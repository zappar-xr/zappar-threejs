/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.base');

baseConfig.entry = {
    imageTrackingTest: "./tests/image-tracking.ts",
    instantTrackingTest: "./tests/instant-tracking.ts",
    faceTrackingTest: "./tests/face-tracking.ts",
    faceLandmarkTest: "./tests/face-landmark.ts",
    headMaskTest: "./tests/head-mask.ts"
}

baseConfig.output = {
    filename: "[name].js",
    path: __dirname + 'test-dist'
}
baseConfig.devtool = 'eval-cheap-source-map';

baseConfig.plugins = [
    new HtmlWebpackPlugin({
        template: './tests/index.html',
        filename: 'image-tracking.html',
        favicon: "./tests/assets/favicon.png",
        title: 'Zappar Universal AR',
        chunks: ['imageTrackingTest']
    }),
    new HtmlWebpackPlugin({
        template: './tests/index.html',
        filename: 'instant-tracking.html',
        favicon: "./tests/assets/favicon.png",
        title: 'Zappar Universal AR',
        chunks: ['instantTrackingTest']
    }),
    new HtmlWebpackPlugin({
        template: './tests/index.html',
        filename: 'face-tracking.html',
        favicon: "./tests/assets/favicon.png",
        title: 'Zappar Universal AR',
        chunks: ['faceTrackingTest']
    }),
    new HtmlWebpackPlugin({
        template: './tests/index.html',
        filename: 'face-landmark.html',
        favicon: "./tests/assets/favicon.png",
        title: 'Zappar Universal AR',
        chunks: ['faceLandmarkTest']
    }),
    new HtmlWebpackPlugin({
        template: './tests/index.html',
        filename: 'head-mask.html',
        favicon: "./tests/assets/favicon.png",
        title: 'Zappar Universal AR',
        chunks: ['headMaskTest']
    })
];

baseConfig.devServer = {
    contentBase: './test-dist',
    https: true,
    host: '0.0.0.0',
    open: true,
    hot: true
};

baseConfig.output.path = path.resolve(__dirname, 'test-dist');

module.exports = baseConfig;
