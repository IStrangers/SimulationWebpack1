const path = require("path")

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
  }
}