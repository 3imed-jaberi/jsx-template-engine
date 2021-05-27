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
import { promisify } from "util"
import jsx, { Component, Props } from "./jsx"
import { transform, transformSync } from "@babel/core"
import { readFile, readFileSync as fsReadFileSync, existsSync as fsExistsSync } from "fs"
import { join as pathJoin, dirname as pathDirname, extname as pathExtname } from "path"

const fsReadFile = promisify(readFile)
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
const SUPPORTED_EXTENSIONS = [".jsx", ".js", ""]

/**
 * a helper fuction to check any value is function.
 *
 * @api private
 */
function isFunction (value: unknown) {
  return typeof value === 'function'
}

/**
 * a helper fuction to find file.
 *
 * @api private
 */
function fsFindFile(path: string): string {
  const fileExtension = pathExtname(path)
  if (!SUPPORTED_EXTENSIONS.includes(fileExtension)) {
    throw new Error('please use .jsx or .js as extension for your file.')
  }
  
  for (const extension of SUPPORTED_EXTENSIONS) {
    const filePath = `${path}.${extension}`
    if (fsExistsSync(filePath)) return filePath
  }

  return path
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
  const code = fsReadFileSync(fsFindFile(path)).toString()
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
 export async function jsxEngine(code: string, payload: Props = {}, path?: string): Promise<string> {
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

    // make sure we have a function component before render.
    if (!func) {
      throw new Error("JSX file must return a function")
    }

    // use our custom pragma render method.
    const html = jsx.render(func(payload))

    return html
}

/**
 * a jsxEgine wrapper provide an implicit file reader.
 *
 * @api public
 */
export async function renderFile(path: string, payload: Props = {}): Promise<string> {
  const code = (await fsReadFile(path)).toString()
  return jsxEngine(code, payload, path)
}

export default { render: jsxEngine, renderFile }

module.exports = { render: jsxEngine }
module.exports.default = { render: jsxEngine }
module.exports.jsxEngine = jsxEngine
module.exports.renderFile = renderFile
