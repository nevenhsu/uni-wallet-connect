const webpack = require('webpack')

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.resolve.fallback = {
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
    }

    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ]

    config.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
            return (
                warning.module &&
                warning.module.resource.includes('node_modules') &&
                warning.details &&
                warning.details.includes('source-map-loader')
            )
        },
    ]

    return config
}
