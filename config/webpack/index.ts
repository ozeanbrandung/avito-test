import webpack from "webpack";
import getLoaders from './loaders';
import getPlugins from './plugins';
import getDevServer from './devServer';
import getResolvers from './resolvers';
import {BuildOptions} from "./types";

export default (options:BuildOptions): webpack.Configuration => {
    const {paths, mode} = options;

    const isDev = mode === 'development';

    return {
        mode: mode || 'production',
        entry: paths.entry,
        output: {
            path: paths.output,
            filename: '[name].[contenthash].js',
            clean: true,
        },
        plugins: getPlugins(options),
        module: {
            rules: getLoaders(options),
        },
        resolve: getResolvers(options),
        devtool: isDev && 'inline-source-map',
        devServer: isDev && getDevServer(options)
    }
}