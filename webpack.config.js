/* eslint-disable */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const env = process.env.NODE_ENV || 'development';

const plugins = [
    new CleanWebpackPlugin(['dist/*.*'], {
        exclude: [],
        verbose: true,
        dry: false,
    }),
    new HtmlWebpackPlugin({
        title: 'Abyss the Roguelike',
        template: './template.html',
        filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[chunkhash].css',
    }),
];

module.exports = {
    mode: env,
    entry: {
        app: path.join(__dirname, '/src/scripts/entry.ts'),
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].[chunkhash].bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
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
                test: /\.js|jsx/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.ts|tsx/,
                loader: 'awesome-typescript-loader',
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
                use: [
                    {loader: 'file-loader'},
                ],
            },
        ],
    },
    devtool: env === 'development' ? 'eval-source-map' : undefined,
    plugins,
};
