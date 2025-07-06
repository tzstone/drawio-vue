const path = require("path");

const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const webpack = require("webpack");
const WorkerPlugin = require("worker-plugin");
const isProduction = process.env.NODE_ENV === "production";
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
  productionSourceMap: false,
  runtimeCompiler: true,
  configureWebpack: (config) => {
    const options = {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
      },
      plugins: [new WorkerPlugin()],
      // optimization: {
      //   minimizer: [
      //     new TerserWebpackPlugin({
      //       terserOptions: {
      //         compress: {
      //           //  warnings: true,
      //           drop_console: ['log'],
      //           drop_debugger: true,
      //           // pure_funcs: ['console.log'], // 删除console
      //         },
      //       },
      //     }),
      //   ],
      // },
    };

    if (process.env.NODE_ENV === "development") {
      options.plugins.push(
        new SpeedMeasurePlugin(),
        new HardSourceWebpackPlugin()
        // new webpack.NormalModuleReplacementPlugin(/src\/router\/config\.ts/, './dev.config.ts')
      );
    }

    // config.optimization.minimizer[0].options.terserOptions.compress.arrows = true;
    config.optimization.minimizer[0].options.terserOptions.compress.drop_console =
      ["log"];
    // config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = false;

    return options;
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/assets/svg")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/svg"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    if (isProduction) {
      config.plugins.delete("prefetch");
      // config.optimization.minimizer('terser').tap((args) => {
      //   // args[0].terserOptions.compress.drop_console = true;
      //   args[0].terserOptions.compress.drop_console = ['log'];
      //   // args[0].terserOptions.compress.pure_funcs = ['console.log'];
      //   // args[0].terserOptions.compress.drop_debugger = true;
      //   return args;
      // });
    }
  },
};
