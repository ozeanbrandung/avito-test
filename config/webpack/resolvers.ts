import {Configuration} from "webpack";
import {BuildOptions} from "./types";

export default (options: BuildOptions):Configuration['resolve'] => {
    return {
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
            '@': options.paths.src,
        }
    }
}