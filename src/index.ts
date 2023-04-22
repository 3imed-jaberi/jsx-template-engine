/*!
 * jsx-template-engine
 *
 * Copyright(c) 2021 Imed Jaberi
 * MIT Licensed
 */

'use-strict'

/**
 * Module dependencies.
 */
import vm from "vm"
import jsx, { Component, Props } from "./jsx"
import { readFileSync as fsReadFileSync } from "fs"
import { transform, transformSync } from "@babel/core"
import { join as pathJoin, dirname as pathDirname, resolve as pathResolve } from "path"

/**
 * Constants.
 *
 * @api private
 */
const BABEL_OPTIONS = {
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    [
      "@babel/plugin-transform-react-jsx",
      {
        pragma: "jsx",
        pragmaFrag: "jsx.Fragment"
      }
    ]
  ]
}

/**
 * a helper fuction to check any value is function.
 *
 * @api private
 */
function isFunction (value: unknown) {
  return typeof value === 'function'
}

/**
 * require handler used with the vm.
 *
 * @api private
 */
const vmRequire = (rootPath: string): any => (filePath: string): any => {
  // merge all paths to one.
  const path = pathJoin(rootPath, filePath)
  // read the code file.
  const code = importComponent(path)
  // transformed code with babel.
  const babelCode = transformSync(code, BABEL_OPTIONS)?.code
  // use the vm module to execute the babelcode.
  const context = vmRuntime(babelCode || '', path)
  // return all exports from the context.
  return context.module.exports
}

/**
 * use the runtime behave with V8 Virtual Machine something like `eval()` function.
 *
 * @api private
 */
function vmRuntime(code: string, path?: string) {  
  const vmModule = { exports: {} }
  const vmContext = vm.createContext({
    jsx,
    module: vmModule,
    exports: vmModule.exports,
    require: path 
      ? vmRequire(pathDirname(path))
      : () => void 1
  })
  vm.runInContext(code, vmContext)

  return vmContext
}

/**
 * the core of the agnostic jsx template engine (render to string).
 *
 * @api public
 */
async function jsxEngine(code: string, payload: Props = {}, path?: string): Promise<string> {
    // execute the babel transform to compile the passed code.
    const babelCode = (await transform(code, BABEL_OPTIONS))?.code

    // get the vm runtime context.
    const context = vmRuntime(babelCode || '', path)

    // extract the jsx functional component from module.
    const func: Component = (
      isFunction(context?.module?.exports)
        ? context.module.exports
        : (
          context?.exports?.__esModule === true &&
          isFunction(context?.exports?.default) &&
          context.exports.default
        )
    )

    // use our custom pragma render method.
    const html = jsx.render(func(payload))

    return html
}

/**
 * a jsx component (file) reader. 
 *
 * @api public
 */
function importComponent(path: string) {
  // resolve the dot-env file path.
  const filePath = pathResolve(process.cwd(), path)
  
  // extract the file content.
  const fileContent = fsReadFileSync(filePath, { encoding: "utf8" }).toString()

  // return the content
  return fileContent
}

export * from './jsx'
export default { render: jsxEngine, jsxEngine, importComponent }
module.exports = { render: jsxEngine, jsxEngine, importComponent }
