import Merge from 'webpack-merge'
import BaseConfig from './webpack.base.config'
import { Configuration, DefinePlugin } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const config = {
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        new DefinePlugin({
            Mode: JSON.stringify('development')
        }),
        new CleanWebpackPlugin(),
    ]
} as Configuration

export default Merge(BaseConfig, config)