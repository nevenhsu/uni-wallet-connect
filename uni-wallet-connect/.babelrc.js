module.exports = {
  presets: [
    ['@babel/env', { modules: false }],
    '@babel/typescript',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ],
  plugins: [['@babel/plugin-transform-runtime', { useESModules: true }]],
}
