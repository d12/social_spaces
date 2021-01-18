const { environment } = require("@rails/webpacker");

const webpackMerge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

const typescript = require("./loaders/typescript");
environment.loaders.prepend("typescript", typescript);
environment.loaders.delete("nodeModules");

const webpackerDefaultWebpackConfig = environment.toWebpackConfig().toObject()

const mergeData = {
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

const mergeStrategies = {
  'resolve.modules': 'replace',
}

const mergedWebpackConfig = webpackMerge.smartStrategy(mergeStrategies)(
  webpackerDefaultWebpackConfig,
  mergeData
)

module.exports = mergedWebpackConfig;