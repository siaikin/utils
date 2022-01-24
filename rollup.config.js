import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import { visualizer } from 'rollup-plugin-visualizer';
import { terser } from "rollup-plugin-terser";
import replace from '@rollup/plugin-replace';

export default {
  input: 'dist/esm/index.js',
  output: {
    file: 'dist/bundle/utils.js',
    name: 'SIAIKIN_UTILS',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    replace({
      preventAssignment: true,
      __ENV__: JSON.stringify({NODE_ENV: 'production'}),
    }),
    json(),
    sourcemaps(),
    nodeResolve(),
    commonjs(),
    nodeBuiltins(),
    visualizer(),
    terser(),
  ]

};
