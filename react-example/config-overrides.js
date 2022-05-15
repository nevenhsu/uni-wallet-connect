module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.resolve.fallback = {
        util: require.resolve('util'),
    }

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
