/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-restricted-syntax */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackCdnPlugin = require("webpack-cdn-plugin");
const fetch = require("node-fetch");
const ESLintPlugin = require("eslint-webpack-plugin");
const { getTemplates, generateStandalone } = require("./webpack.helper");
const baseConfig = require("./webpack.config.base");
const getStandaloneVersions = require("./standalone-versions");

//* To add an extra test this script does not need to be modified.*
//* Please read CONTRIBUTING.MD *
module.exports = async (env) => {
  const entries = {};
  baseConfig.plugins = [];
  baseConfig.plugins.push(
    new ESLintPlugin({
      fix: true,
      extensions: ["ts", "tsx"],
      exclude: ["node_modules", "tests"],
    })
  );

  generateStandalone();

  const getPlugin = (testType, template, chunk, modules) => {
    const plugins = [];

    if (modules) {
      // eslint-disable-next-line guard-for-in
      for (const key in modules) {
        plugins.push(
          new HtmlWebpackPlugin({
            template: `./tests/html-templates/${template.template_id}.html`,
            filename: `./pages/${testType}/${template.pageName}-${key}.html`,
            favicon: "./tests/assets/favicon.png",
            title: "Zappar UAR ThreeJS",
            chunks: [chunk],
            cdnModule: key,
          })
        );
      }
    } else {
      plugins.push(
        new HtmlWebpackPlugin({
          template: `./tests/html-templates/${template.template_id}.html`,
          filename: `./pages/${testType}/${template.pageName}.html`,
          favicon: "./tests/assets/favicon.png",
          title: "Zappar UAR ThreeJS",
          chunks: [chunk],
          cdnModule: false,
        })
      );
    }
    return plugins;
  };

  const setupHtmlWebpackPlugin = (opts) => {
    for (const template of getTemplates(opts)) {
      const chunk = `${opts.templateType}-${template.pageName}`;
      entries[chunk] = `./tests/${opts.templateType}/${template.fullFileName}`;
      const plugins = getPlugin(opts.templateType, template, chunk, opts.modules);
      plugins.forEach((plugin) => baseConfig.plugins.push(plugin)); // todo
    }
  };

  baseConfig.plugins.push(
    new CopyPlugin({
      patterns: [{ from: "./umd", to: "./standalone/" }],
    })
  );

  let CDN_URL = "../../../standalone/zappar-threejs.js";
  if (env.POST_TEST) {
    const CDN_RESPONSE = await fetch("https://libs.zappar.com/zappar-threejs/latest.json");
    const CDN_DATA = await CDN_RESPONSE.json();
    CDN_URL = CDN_DATA.cdn;
  }

  const modules = {};
  for (const version of getStandaloneVersions()) {
    modules[version] = [
      { name: "THREE", var: "THREE", path: "three.min.js", prodUrl: `https://cdnjs.cloudflare.com/ajax/libs/three.js/${version}/three.min.js` },
      { name: "THREE", var: "THREE", path: "three.min.js", prodUrl: CDN_URL }, //* Hacky way to load in our local script.
    ];
  }

  // *Setup Manual and Jest Tests*
  const builds = [
    {
      templateType: "jest/module",
      extension: ".ts",
    },
    {
      templateType: "manual",
      extension: ".ts",
    },
    {
      templateType: "jest/generated-standalone",
      extension: ".js",
      modules,
    },
  ];

  builds.forEach(setupHtmlWebpackPlugin);

  const injectPlugin = new WebpackCdnPlugin({
    modules: builds[2].modules,
  });

  baseConfig.plugins.push(injectPlugin);

  baseConfig.entry = entries;

  baseConfig.output = {
    filename: "js/[name].js",
    path: `${__dirname}test-dist`,
  };

  baseConfig.devtool = "eval-cheap-source-map";

  baseConfig.devServer = {
    static: "./test-dist",
    https: true,
    host: "0.0.0.0",
    open: false,
    hot: true,
    port: 8081,
  };

  baseConfig.output.path = path.resolve(__dirname, "test-dist");

  return baseConfig;
};
// = baseConfig;
