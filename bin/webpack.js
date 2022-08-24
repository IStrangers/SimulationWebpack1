#! /usr/bin/env node

const path = require("path")

const config = require(path.resolve("webpack.config.js"))

const compiler = new (require("../src/compiler.js"))(config)

compiler.hooks.entryOption.call()

compiler.run()