module.exports = {
    entry: ['babel-polyfill', __dirname + '/src/scripts/entry.js'],
    devtool: "eval-source-map",
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            }
        ]
    }
};