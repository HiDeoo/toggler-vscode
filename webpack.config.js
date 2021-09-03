// @ts-check

const path = require('path')

/**@type {import('webpack').Configuration}*/
module.exports = {
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
  target: 'node',
  mode: 'none',
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
    ],
  },
  devtool: 'nosources-source-map',
}
