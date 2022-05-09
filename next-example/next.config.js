const path = require('path')
const withTM = require('next-transpile-modules')(['styled-components'])
const pkg = require('./package.json')

const packages = [...Object.keys(pkg.dependencies || {})]

module.exports = withTM({
  webpack: (config, options) => {
    if (options.isServer) {
      config.externals = [...packages, ...config.externals]
    }

    packages.forEach((el) => {
      config.resolve.alias[el] = path.resolve(__dirname, '.', 'node_modules', el)
    })

    return config
  },
})
