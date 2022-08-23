/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const baseConfig = require("./webpack.config.base");

baseConfig.externals = {
  three: "THREE",
};
baseConfig.entry = "./src/index-standalone.ts";

delete baseConfig.devtool;
module.exports = baseConfig;
