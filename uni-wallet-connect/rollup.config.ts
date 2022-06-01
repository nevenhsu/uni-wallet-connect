import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import image from '@rollup/plugin-image'
import strip from '@rollup/plugin-strip'
import svgr from '@svgr/rollup'
import typescript from 'rollup-plugin-typescript2'
import sourceMaps from 'rollup-plugin-sourcemaps'

import pkg from './package.json'

const input = 'src/index.tsx'
const extensions = ['.js', '.jsx', '.ts', '.tsx']
const noDeclarationFiles = { compilerOptions: { declaration: false } }

const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(/^[^0-9]*/, '')

const peerDependencies = Object.keys(pkg.peerDependencies || {})
const external = [...Object.keys(pkg.devDependencies || {}), ...peerDependencies].map((name) => RegExp(`^${name}($|/)`))

const resolveOptions = {
  extensions,
  mainFields: ['browser', 'module', 'main'],
  dedupe: peerDependencies,
}

const commonPlugins = [svgr({ icon: true }), image(), sourceMaps(), json(), strip()]

export default defineConfig([
  // ES
  {
    input,
    output: { dir: 'dist/esm', preserveModules: true, format: 'es', indent: false, sourcemap: true },
    external,
    plugins: [
      nodeResolve(resolveOptions),
      commonjs({
        ignoreGlobal: true,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      ...commonPlugins,
      babel({
        extensions,
        plugins: [['@babel/plugin-transform-runtime', { version: babelRuntimeVersion, useESModules: true }]],
        babelHelpers: 'runtime',
        exclude: /node_modules/,
      }),
    ],
  },

  // CommonJS
  {
    input,
    output: { dir: 'dist/cjs', preserveModules: true, format: 'cjs', indent: false, sourcemap: true },
    external,
    plugins: [
      nodeResolve(resolveOptions),
      commonjs({
        ignoreGlobal: true,
      }),
      typescript({ useTsconfigDeclarationDir: true }),
      ...commonPlugins,
      babel({
        extensions,
        plugins: [['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }]],
        babelHelpers: 'runtime',
        exclude: /node_modules/,
      }),
    ],
  },
])
