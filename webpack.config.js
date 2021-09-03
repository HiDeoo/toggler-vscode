// @ts-check

const path = require('path')
const webpack = require('webpack')

/**@type {import('webpack').Configuration}*/
module.exports = {
  entry: {
    extension: './src/extension.ts',
    'test/suite/index': './src/test/suite/index.web.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
    clean: true,
  },
  target: 'webworker',
  mode: 'none',
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      assert: require.resolve('assert'),
    },
  },
  externals: {
    vscode: 'commonjs vscode',
  },
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
  plugins: [new webpack.ProvidePlugin({ process: 'process/browser' })],
  performance: {
    assetFilter: (assetFilename) => !/\.map$/.test(assetFilename) && !assetFilename.startsWith('test/'),
  },
}
