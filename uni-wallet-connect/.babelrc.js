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
}
