var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.config.common.js');
var TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = webpackMerge.smart(commonConfig, {
	entry: {
		'app': './src/demo-app/main.ts'
	},

	output: {
		path: './dist',
		publicPath: '/',
		filename: '[name].[hash].js',
		chunkFilename: '[id].[hash].chunk.js'
	},

	module: {
		loaders: [{
			test: /\.ts$/,
			loaders: [
				'awesome-typescript-loader',
				'angular2-template-loader',
				'angular2-router-loader?aot=false&genDir=dist/src/app'
			]
		}]
	},

	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: ['./src/demo-app/main.ts', './src/polyfills.ts']
		}),
		new TypedocWebpackPlugin({
			"mode": "modules",
			"out": "./docs",
			"logger": "none",
			"theme": "default",
			"ignoreCompilerErrors": "true",
			"experimentalDecorators": "true",
			"emitDecoratorMetadata": "true",
			"target": "ES5",
			"preserveConstEnums": "true",
			"excludeNotExported": "true",
			"excludeExternals": "true",
			"externalPattern": "node_modules",
			"excludePrivate": "true",
			"stripInternal": "true",
			"suppressExcessPropertyErrors": "true",
			"suppressImplicitAnyIndexErrors": "true",
			"module": "commonjs",
		}, ['./src/common/app/',
			'./src/common/core/annotations',
			'./src/common/core/cloning',
			'./src/common/core/graphics',
			'./src/common/core/pipes',
			'./src/common/core/sorting',
			'./src/common/core/style',
			'./src/common/core/validation',
			'./src/common/external-service/',
			'./src/common/global-event/',
			'./src/common/lang/',
			'./src/common/loader/',
			'./src/common/util/',
			'./src/component/',
		]),
	]
})