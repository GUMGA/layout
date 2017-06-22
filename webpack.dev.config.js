const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const baseName = "gumga-layout";

module.exports = {
    entry: path.join(__dirname, 'src/components/', 'index'),
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: baseName+'.js',
        publicPath: '/dist/'
    },
    devServer: {
        inline: true,
        port: 1111
    },
    plugins: [
        new ExtractTextPlugin({
            filename: baseName+".css",
            allChunks: true
        }),
        new WebpackShellPlugin({onBuildEnd:['node webpack-dev-pallete.js'], dev: false})
    ],
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: 'babel-loader'
                }
              ]
            },
            { test: /\.styl$/, loader: ExtractTextPlugin.extract('css-loader!stylus-loader'), exclude: /node_modules/ },
            {
              test: /\.css$/,
              use: ExtractTextPlugin.extract({
                  use: 'css-loader'
              })
            },
            {
              test: /\.(jpe?g|png|gif|svg|eot|woff2|woff|ttf)$/i,
              use: "file-loader?name=assets/[name].[ext]"
            }
        ]
    }
};
