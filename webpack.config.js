import path from 'path';
import webpack from 'webpack';

const config = {
  disableHostCheck: true,
  entry: path.resolve(__dirname, 'js', 'app.js'),
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'js'),
    ]
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.js$/
      }
    ],
  },
  output: {
    filename: 'app.js',
    path: '/',
    publicPath: '/js/'
  }
};

module.exports = config;
