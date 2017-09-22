var path = require('path');

module.exports = {
	devtool: 'source-map',
	entry: './src/main.js',
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'build.js'
	},
	module: {
		loaders: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		modules: [
			path.resolve('./src'),
			path.resolve('./node_modules')
		],
		extensions: ['*', '.js', '.json', '.vue']
	}
}
