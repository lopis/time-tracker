const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry:  "./src/index.js",
	mode: "development",
	devtool: "source-map",
  module: {
    rules: [
			{
        test: /\.tsx?$/,
				loader: "awesome-typescript-loader"
			},
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
				loader: "url-loader?limit=100000"
			},
			{
				enforce: "pre",
				test: /\.js$/,
				loader: "source-map-loader"
			}
		]
  },
  resolve: { extensions: ["*", ".js", ".jsx", ".ts", ".tsx"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "dist/"),
    port: 3000,
    publicPath: "http://localhost:3000/",
		hot: false,
		// https: true
  },
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src/index.html"),
			filename: path.join(__dirname, "dist/index.html"),
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
};