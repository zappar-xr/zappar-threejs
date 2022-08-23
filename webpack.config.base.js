/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "umd"),
    filename: "zappar-threejs.js",
    library: "ZapparThree",
    libraryTarget: "umd",
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".wasm"],
  },
  plugins: [],
  devServer: {
    static: "./dist",
    client: {
      overlay: false,
    },
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(zpt|png|gif|glb|gltf|jpe?g|ogg|mp3|obj|fbx|wav|ttf|fnf|woff|stl|mp4|hdr|webm)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets",
              name: "[sha256:hash:base64:16].[ext]",
            },
          },
        ],
      },
    ],
  },
};
