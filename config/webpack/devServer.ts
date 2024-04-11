import {Configuration as DevServerConfiguration} from "webpack-dev-server";
import {BuildOptions} from "./types";

export default (options: BuildOptions):DevServerConfiguration => {
    return {
        open: true,
        port: options.port ?? 3000,
        historyApiFallback: true,
        hot: true,
    }
}