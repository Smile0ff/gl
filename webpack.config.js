const { resolve, join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT = resolve('.');
const SRC = join(ROOT, 'src');

const config = {
  mode: 'development',
  entry: [
    'babel-polyfill',
    join(SRC, 'app/index.js'),
  ],
  output: {
    path: join(ROOT, 'build'),
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.glsl'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [
          join(ROOT, 'node_modules'),
        ],
        loader: 'babel-loader',
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'shader-loader',
        options: {
          glsl: {
            chunkPath: resolve("/glsl/chunks")
          }
        }
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
      title: 'WebGL',
      template: join(SRC, 'app/index.html'),
      filename: 'index.html',
    }),
  ],
  devtool: 'cheap-source-map',
};

module.exports = config;
