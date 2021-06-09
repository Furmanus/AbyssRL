/* eslint-disable */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    title: 'Abyss the Roguelike',
    template: 'src/template.html',
    filename: 'index.html',
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[hash].css',
  }),
];

module.exports = (env) => {
  const { mode, watch } = env;

  return {
    entry: {
      app: path.join(__dirname, '/src/scripts/entry.ts'),
    },
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].[hash].bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.json'],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.ts|tsx/,
          loader: 'ts-loader',
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'less-loader',
            },
          ],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [{ loader: 'file-loader' }],
        },
      ],
    },
    devtool: mode === 'development' ? 'eval-source-map' : 'hidden-source-map',
    watch,
    mode,
    plugins,
  };
};
