const path = require("path")
const fs = require("fs")
const babylon = require("babylon")
const babelTypes = require("@babel/types")
const babelTraverse = require("@babel/traverse").default
const babelGenerator = require("@babel/generator").default

class Compiler{

  constructor(config) {
    this.config = config
    this.entryId = null
    this.entry = config.entry
    this.modules = {}
    this.root = process.cwd()
  }

  run() {
    this.buildModule(path.resolve(this.root,this.entry),true)

    this.emitFile()
  }

  buildModule(modulePath,isEntry) {
    const source = this.getSource(modulePath)
    const moduleName = `./${path.relative(this.root,modulePath)}`
    if(isEntry) {
      this.entryId = moduleName
    }
    const { sourceCode,dependencies } = this.parse(source,path.dirname(moduleName))
    this.modules[moduleName] = sourceCode
    dependencies.forEach(dep => {
      this.buildModule(path.join(this.root,dep),false)
    })
  }

  parse(source,parentPath) {
    const dependencies = []
    const ast = babylon.parse(source)
    babelTraverse(ast,{
      CallExpression(p) {
        const node = p.node
        if(node.callee.name === "require") {
          node.callee.name = "__webpack_require__"
          const moduleName = `./${path.join(parentPath,node.arguments[0].value + (path.extname(node.arguments[0].value) ? "" : ".js"))}`
          dependencies.push(moduleName)
          node.arguments = [babelTypes.stringLiteral(moduleName)]
        }
      }
    })
    const sourceCode = babelGenerator(ast).code
    return { sourceCode,dependencies }
  }

  getSource(modulePath) {
    const source = fs.readFileSync(modulePath,"utf-8")
    return source
  }

  emitFile() {
  }

}

module.exports = Compiler