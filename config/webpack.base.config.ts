import { resolve } from 'path'
import { Configuration } from 'webpack'

const config = {
    target: 'node',
    devtool: 'source-map',
    entry: resolve(__dirname, '../src/index.ts'),
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'main.js',
        path: resolve(__dirname, '../dist'),
    },
} as Configuration

export default config