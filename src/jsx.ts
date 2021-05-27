import addPx from "add-px-to-style"

const Fragment = Symbol("jsx.Fragment")

export type Props = {
  [key: string]: any
  children?: Node[] | null
}

export type Component = (props: Props) => Node

export interface Node {
  nodeName: string | Component | typeof Fragment
  attributes: Props
  children?: Node[] | null
}

interface Attributes {
  [key: string]: string | Record<string, string>
}

function jsx(nodeName: string, attributes: Attributes, ...args: Node[]): Node {
  const children = args.length ? [].concat(...(args as never[])) : null
  return { nodeName, attributes, children }
}

function css(style: Record<string, string>): string {
  return Object.entries(style)
    .reduce((styleString, [key, value]) => {
      const name = key.replace(/([A-Z])/g, ([match]) => `-${match.toLowerCase()}`)
      return `${styleString} ${name}: ${addPx(name, value)};`
    }, "")
    .trim()
}

function buildAttributes(attributes: Attributes): string {
  let htmlAtt = ''
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "style" && typeof value === "object") {
      htmlAtt += ` ${key}="${css(value)}"`
    } else if (key === "children") {
      Object.assign(attributes, { children: value })
    } else if (key === "className") {
      htmlAtt += ` class="${value}"`
    } else {
      htmlAtt += ` ${key}="${value}"`
    }
  })
  return htmlAtt
}

jsx.render = function render (node: Node): string {
  if (!node) return ''

  if (!node.nodeName) return node as any
  // if (typeof node === "string") return node

  if (typeof node.nodeName === "function") {
    return render(
      node.nodeName({
        ...node.attributes,
        children: node?.attributes?.children || node?.children
      })
    )
  }

  if (node.nodeName === Fragment)
    return (node.children || []).map((child) => render(child)).join('')

  const attributes = node.attributes || {}
  let tree = `<${node.nodeName}${buildAttributes(attributes)}>`

  if (
    [
      "area",
      "base",
      "col",
      "embed",
      "link",
      "track",
      "wbr",
      "param",
      "source",
      "img",
      "input",
      "br",
      "hr",
      "meta",
    ].includes(node.nodeName as string)
  ) return tree

  tree += (attributes?.children || node.children || [])
    .map((child) => render(child))
    .join('')
  tree += `</${node.nodeName}>`

  return tree
}

export { jsx as default, Fragment }

module.exports = jsx
module.exports.default = jsx
module.exports.Fragment = Fragment
