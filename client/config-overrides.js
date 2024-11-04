const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    "stream": require.resolve("stream-browserify"),
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "crypto": require.resolve("crypto-browserify"),
    "vm": require.resolve("vm-browserify")
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]);
  return config;
};
