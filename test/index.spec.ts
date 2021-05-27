import 'mocha'
import { expect } from 'chai'
import { join } from 'path'
import jsx from '../src/index'

describe('', () => {
  describe('should render all basic tags', () => {
    ['div', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
      it(`* ${tag}`, async () => {
        const jsxTag = await jsx.render(`module.exports = () => <${tag}></${tag}>`)
        expect(jsxTag).to.be.equal(`<${tag}></${tag}>`)
      })
    })
  })

  describe('should render all single tags', () => {
    [
      'area',
      'base',
      'col',
      'embed',
      'link',
      'track',
      'wbr',
      'param',
      'source',
      'img',
      'input',
      'br',
      'hr',
      'meta',
    ].forEach((tag) => {
      it(`* ${tag}`, async () => {
        const jsxTag = await jsx.render(`module.exports = () => <${tag} />`)
        expect(jsxTag).to.be.equal(`<${tag}>`)
      })
    })
  })

  describe('should render all child components', async () => {
    it('* one child', async () => {
      const jsxTag = await jsx.render('module.exports = () => <div><h1></h1></div>')
      expect(jsxTag).to.be.equal(`<div><h1></h1></div>`)
    })

    it('* more than one child', async () => {
      const jsxTag = await jsx.render('module.exports = () => <div><h1></h1><h2></h2></div>')
      expect(jsxTag).to.be.equal(`<div><h1></h1><h2></h2></div>`)
    })

    it('* nested childs', async () => {
      const jsxTag = await jsx.render('module.exports = () => <div><h1><h2></h2></h1></div>')
      expect(jsxTag).to.be.equal(`<div><h1><h2></h2></h1></div>`)
    })
  })

  describe('should render all attributes/props', async () => {
    it('* custom attribute', async () => {
      const jsxTag = await jsx.render('const counter = 10; module.exports = () => <div counter={counter}></div>')
      expect(jsxTag).to.be.equal(`<div counter="10"></div>`)
    })

    it('* convert className attribute to class attribute', async () => {
      const jsxTag = await jsx.render(`module.exports = () => <div className='test'></div>`)
      expect(jsxTag).to.be.equal(`<div class="test"></div>`)
    })

    it('* style attribute', async () => {
      const jsxTag = await jsx.render(`module.exports = () => <div style={{height: 5, backgroundColor: '#fff'}}></div>`)
      expect(jsxTag).to.be.equal(`<div style="height: 5px; background-color: #fff;"></div>`)
    })

    it('* children attribute', async () => {
      const jsxTag = await jsx.render(`module.exports = () => <div children={[<h1>Imed Jaberi</h1>]}></div>`)
      expect(jsxTag).to.be.equal(`<div><h1>Imed Jaberi</h1></div>`)
    })
  })

  describe('should render all custom components', async () => {
    it('* custom component', async () => {
      const path = join(__dirname, './index.jsx')
      const jsxTag = await jsx.render(jsx.importComponent(path), {}, path)
      expect(jsxTag).to.be.equal(`<div><div><div></div></div></div>`)
    })

    it('* children attribute with custom component', async () => {
      const jsxTag = await jsx.render(`const View = ({children}) => <div>{children}</div>; export default () => <View children={'Hello'}></View>`)
      expect(jsxTag).to.be.equal(`<div>Hello</div>`)
    })

    it('* nested children', async () => {
      const jsxTag = await jsx.render(`
        const View = ({children}) => <div>{children}</div>;
        const ScrollView = ({children}) => <div>{children}</div>;
        export default () => <><View children={'Hello'} /><ScrollView><h1>World</h1></ScrollView></>
      `)
      expect(jsxTag).to.be.equal(`<div>Hello</div><div><h1>World</h1></div>`)
    })

    it('* string component with out tag', async () => {
      const jsxTag = await jsx.render(`module.exports = () => 'Hello'`)
      expect(jsxTag).to.be.equal(`Hello`)
    })

    it('* fragments empty', async () => {
      const jsxTag = await jsx.render(`module.exports = () => <></>`)
      expect(jsxTag).to.be.equal(``)
    })

    it('* fragments with child(s)', async () => {
      const jsxTag = await jsx.render(`module.exports = () => <><div></div></>`)
      expect(jsxTag).to.be.equal(`<div></div>`)
    })

    it('* empty text', async () => {
      const jsxTag = await jsx.render(`module.exports = () => ''`)
      expect(jsxTag).to.be.equal(``)
    })
  })

  describe('throws', () => {
    it('* when parse error', () => {
      expect(async () => await jsx.render('<div>{{}}')).to.Throw
    })

    it('* when file does not return a function', () => {
      expect(async () => await jsx.render('module.exports = {}')).to.Throw
    })

    it('* when file does return a function but the function dos not return anything', () => {
      expect(async () => await jsx.render('module.exports = () => {<div></div>}')).to.Throw
    })

    it('* when import file with invalid extension', () => {
      expect(async () => await jsx.render(
        `import View from './index.c'; export default () => <View />`,
        undefined,
        __filename
      )).to.Throw
    })
  })

  describe ('import files', () => {
    it(' * import another file', async () => {
      const jsxTag = await jsx.render(
        `import View from './index.jsx'; export default () => <View />`,
        undefined,
        __filename
      )

      expect(jsxTag).to.be.equal('<div><div><div></div></div></div>')
    })
  })
})


