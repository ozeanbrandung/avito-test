import webpack from 'webpack';
import getWebpackOptions from './config/webpack/index'
import path from 'path'
import {BuildMode, BuildPaths} from "./config/webpack/types";


interface EnvVariables {
    mode: BuildMode;
    port: number;
}

export default (env: EnvVariables) => {
    const paths:BuildPaths = {
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        output: path.resolve(__dirname, 'build'),
        public: path.resolve(__dirname, 'public'),
        src: path.resolve(__dirname, 'src')
    }

    const config: webpack.Configuration = getWebpackOptions({
        port: env.port ?? 7070,
        paths,
        mode: env.mode || 'development'
     });

    return config;
}