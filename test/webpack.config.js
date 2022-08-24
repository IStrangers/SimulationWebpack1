const path = require("path")

class TestPlugin {
  apply(context) {
    context.hooks.emit.tap("emit",function() {
      console.log("TestPlugin: emit")
    })
    console.log("TestPlugin: ",context)
  }
}

module.exports = {
  entry: "./src/test.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname,"loader","style-loader"),
          path.resolve(__dirname,"loader","less-loader"),
        ]
      }
    ]
  },
  plugins: [
    new TestPlugin()
  ]
}