const commonConfig = require('./jest.config.js');

module.exports = {
  ...commonConfig,
  testEnvironment: "jest-environment-jsdom",
}
