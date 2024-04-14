import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import dotenv from 'dotenv'
//import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack, {Configuration} from "webpack";
import {BuildOptions} from "./types";
import path from "path";

export default ({mode, paths}: BuildOptions):Configuration['plugins'] => {
    const isProd = mode === 'production';
    const isDev = !isProd;

    const plugins:Configuration['plugins'] = [
        new HtmlWebpackPlugin({
            template: path.resolve(paths.public, 'index.html'),
            favicon: path.resolve(paths.public, 'favicon.ico')
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.config({ path: paths.env }).parsed),
            'process.env.TOKEN': JSON.stringify(process.env.TOKEN)
        })
    ];

    if (isProd) {
        plugins.push(
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].css'
            })
        )
    }

    //hrm - conflicting peer dependency!
    // if (isDev) {
    //     plugins.push(new ReactRefreshWebpackPlugin())
    // }

    return plugins
}