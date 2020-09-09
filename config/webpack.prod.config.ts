import Merge from 'webpack-merge'
import BaseConfig from './webpack.base.config'
import { Configuration, DefinePlugin } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const config = {
    mode: 'production',
    plugins: [
        new DefinePlugin({
            Mode: JSON.stringify('production')
        }),
        new CleanWebpackPlugin(),
    ],
} as Configuration

export default Merge(BaseConfig, config)