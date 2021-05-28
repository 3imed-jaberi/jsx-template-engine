<div align='center'>

# JSX Template Engine

---

[![Build Status][travis-img]][travis-url]
[![Coverage Status][coverage-img]][coverage-url]
[![NPM version][npm-badge]][npm-url]
![Code Size][code-size-badge]
[![License][license-badge]][license-url]
[![PR's Welcome][pr-welcoming-badge]][pr-welcoming-url]

</div>

<!-- ***************** -->

[travis-img]: https://travis-ci.com/3imed-jaberi/jsx-template-engine.svg?branch=master
[travis-url]: https://travis-ci.com/3imed-jaberi/jsx-template-engine
[coverage-img]: https://coveralls.io/repos/github/3imed-jaberi/jsx-template-engine/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/3imed-jaberi/jsx-template-engine?branch=master
[npm-badge]: https://img.shields.io/npm/v/jsx-template-engine.svg?style=flat
[npm-url]: https://www.npmjs.com/package/jsx-template-engine
[license-badge]: https://img.shields.io/badge/license-MIT-green.svg?style=flat
[license-url]: https://github.com/3imed-jaberi/jsx-template-engine/blob/master/LICENSE
[code-size-badge]: https://img.shields.io/github/languages/code-size/3imed-jaberi/jsx-template-engine
[pr-welcoming-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat
[pr-welcoming-url]: https://github.com/koajs/koa/pull/new

<!-- ***************** -->

### Agnostic JSX template engine 🦄.

## `Features`

- 🥞 &nbsp; Inspired from `jsx-engine`.
- 🔥 &nbsp; Blaze, amiable and lightweight jsx pragma.
- 💅🏻 &nbsp; Based on `babel-core`.
- ✨ &nbsp; Agnostic solution for Node.js server side frameworks.
- 🎉 &nbsp; TypeScript support.

## `Installation`

```bash
# npm
$ npm install jsx-template-engine
# yarn
$ yarn add jsx-template-engine
```

## `Usage`

This is a practical example of how to use.

```javascript
import jsx from "jsx-template-engine";

(async () => {
  const htmlString = await jsx.render("export default () => <div>100</div>");
  // <div>100</div>
})();
```

## `API`

### `importComponent(path: string): string`:

a sync method to import jsx component from a file.

### `render/jsxEngine (code: string, payload: Props =, path?: string)`:

an async method to parse the the jsx code string to html string where you can pass props as payload param and a path param for used and compose files.

#### License

---

[MIT](LICENSE) &copy; [Imed Jaberi](https://github.com/3imed-jaberi)
