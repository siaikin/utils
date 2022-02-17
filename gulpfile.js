const {series} = require('gulp');
const {exec} = require("child_process");

function build() {
  return series(
    generateTypes(),
    minify(),
    compileToUMD(),
  );
}

function test() {
  return series(
    unitTest('jest.config.browser.js'),
    unitTest('jest.config.node.js'),
  );
}


function generateTypes() {
  function func(cb) {
    exec(`tsc --build tsconfig.json`, (error, stdout, stderr) => {
      cb(error);
      console.error(stdout);
    });
  }
  func.displayName = `generate types`;

  return func;
}

function minify() {
  function func(cb) {
    exec(`babel dist/esm --out-dir dist/min --source-maps true --minified --no-comments`, (error, stdout, stderr) => {
      cb(error);
      console.error(stdout);
    });
  }
  func.displayName = 'minify';

  return func;
}

function compileToUMD() {
  function func(cb) {
    exec(`rollup --config rollup.config.js`, (error, stdout, stderr) => {
      cb(error);
      console.error(stdout);
    });
  }
  func.displayName = 'compile to umd';

  return func;
}

function unitTest(configFile) {
  function func(cb) {
    exec(`jest --config ${configFile}`, (error, stdout, stderr) => {
      cb(error);
      console.error(stdout);
    });
  }

  func.displayName = `unit test[${configFile}]`;

  return func;
}

module.exports = {
  default: build(),
  test: test()
};
