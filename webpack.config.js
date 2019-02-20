const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const env = process.env.NODE_ENV || 'development';

const plugins = [
    new CleanWebpackPlugin(['dist/*.*'], {
        exclude: [],
        verbose: true,
        dry: false
    }),
    new HtmlWebpackPlugin({
        title: 'Abyss the Roguelike',
        template: './template.html',
        filename: '../index.html'
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css'
    })
];

module.exports = {
    mode: env,
    entry: {
        app: ['@babel/polyfill', path.join(__dirname, '/src/scripts/entry.js')],
        vendors: ['rot-js', 'react', 'react-dom']
    },
    devtool: 'eval-source-map',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].[chunkhash].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js|jsx/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    },
    plugins
};