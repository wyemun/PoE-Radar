const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: process.NODE_ENV || "development",
  entry: "./src",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js"
  },
  node: {
    __filename: true,
    __dirname: true
  },
  externals: [require('webpack-node-externals')()],
  // {
  // 	serialport: 'commonjs serialport',
  // 	grpc: 'webpack-node-externals grpc'
  // },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: { publicPath: "dist" }
          }
        ]
      },
      {
        test: /\.node/i,
        use: [
          {
            loader: "node-loader"
          },
          {
            loader: "file-loader",
            options: { name: "[name].[ext]" }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"]
  },
  plugins: [new CleanWebpackPlugin()]
}