const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = options => {
  return {
    bail: !options.isDevelopment,
    entry: path.join(__dirname, 'assets', 'javascripts', 'index.js'),
    devtool: options.isDevelopment ? 'eval-source-map' : '',
    output: {
      path: path.join(__dirname, 'source', 'javascripts'),
      filename: 'scripts.js'
    },
    module: {
      loaders: [
        {
          test: /.js$/,
          loaders: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /.scss$/,
          loader: ExtractTextPlugin.extract('css-loader!postcss-loader!sass-loader')
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(options.env || {})
      }),
      new ExtractTextPlugin(path.join(__dirname, 'source', 'stylesheets', 'styles.css')),
      options.isDevelopment ? null : new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ].filter(p => !!p),
    watch: options.isDevelopment
  };
}
