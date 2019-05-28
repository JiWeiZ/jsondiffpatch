const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devtool: 'source-map',
  devServer: {
      contentBase: './src',
      publicPath: '/',
      hot: true,
      host: '127.0.0.1',
      disableHostCheck: true,
      port: 8888,
      open: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
            },
        ],
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css', '.less', '.scss'],
  }
};
