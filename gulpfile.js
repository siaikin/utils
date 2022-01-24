const {series} = require('gulp');
const path = require("path");
const {exec} = require("child_process");

function build() {
  return series(
    generateTypes(),
    minify(),
    compileToUMD(),
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

module.exports = {
  default: build()
};
