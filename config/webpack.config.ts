import { resolve } from 'path'
import { Configuration } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const config = {
    mode: 'production',
    devtool: 'source-map',
    target: 'node',
    entry: {
        index: resolve(__dirname, '../src/index.ts')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    configFile: resolve(__dirname, '../tsconfig.json')
                },
                exclude: /[\\/]node_modules[\\/]/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'main.js',
        path: resolve(__dirname, '../dist')
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
} as Configuration

export default config