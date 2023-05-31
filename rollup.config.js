import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import ts from "typescript";

export default {
  input: "./src/index.ts",
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  output: [
    {
      file: `./dist/${pkg.module}`,
      format: "es",
      sourcemap: true,
    },
    {
      file: `./dist/${pkg.main}`,
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      typescript: ts,
      tsconfig: "tsconfig.json",
      tsconfigDefaults: {
        exclude: [
          "**/*.stories.ts",
          "**/*.stories.tsx",
          "node_modules",
          "dist",
        ],
        compilerOptions: {
          sourceMap: true,
          declaration: true,
        },
      },
    }),
    terser({
      output: {
        comments: false,
      },
    }),
  ],
};
