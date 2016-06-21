require('webpack')

module.exports = {
  entry: [
    './src/index.js'
  ],
  module: {
    loaders: [{
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'web3d-parser.js'
  },
  node: {
		fs: "empty"
	}
}
