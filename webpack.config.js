const path = require('path');
const UglifyJS = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'assets', 'app'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      //test: /.jsx?$/,
      test: /\.(js|jsx)$/,
      include: [
        path.resolve(__dirname, 'assets')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'bower_components')
      ],
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.css']
  },
  devtool: 'source-map',
  devServer: {
    publicPath: path.join('/dist/')
  },
  plugins: [
    // new UglifyJS()
  ]
};