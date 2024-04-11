import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {ModuleOptions} from "webpack";
import {BuildOptions} from "./types";
//import ReactRefreshTypeScript from 'react-refresh-typescript';

export default (options: BuildOptions):ModuleOptions['rules'] => {
    const isDev = options.mode === 'development';

    const scss = {
        test: /\.s[ac]ss$/i,
        use: [
            // Creates `style` nodes from JS strings
            // "style-loader",
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        //похоже что именованный экспорт сейчас по умолчанию? без этого сборка падала дефолтный импорт возвращал undefined
                        namedExport: false,
                        localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
                    },
                },
            },
            // Compiles Sass to CSS
            "sass-loader",
        ],
    }

    const ts = {
        test: /\.tsx?$/,
        use: [{
            loader: 'ts-loader',
            //hrm - conflicting peer dependency!
            // options: {
            //     getCustomTransformers: () => ({
            //         before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
            //     }),
            //     transpileOnly: isDev,
            // },
        }],
        exclude: /node_modules/,
    }

    const assets = {
            test: /\.(png|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        };

    const svg = {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
    };

    return [
        scss,
        ts,
        assets,
        svg
    ]
}