const path = require('path');

module.exports = {
	entry: {
		app: './src/index',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'app.bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
};