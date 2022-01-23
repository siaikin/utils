module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          ie: 10
        },
      }
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}]
  ]
};
