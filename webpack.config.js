const nodeExternals = require('webpack-node-externals')

module.exports = {
  devtool: 'source-map',
  entry: './lib/index.js',
  output: {
    filename: 'index.js',
    path: __dirname + '/dist',
    libraryTarget: 'umd',
    library: 'reactHookTour',
    umdNamedDefine: true
  },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      { 
        test: /\.jsx?$/, 
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
}
