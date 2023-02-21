const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV ?? 'development';
const isDevelopment = mode === 'development';
const isPreview = Boolean(process.env.NODE_PREVIEW);

module.exports = {
  mode,
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.[contenthash].js',
    assetModuleFilename: 'assets/[contenthash][ext]',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html',
      minify: !isDevelopment,
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
  ],
  devServer: {
    port: 3000,
    open: true,
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    watchFiles: ['src/**/*'],
  },
  devtool: isDevelopment && 'inline-source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(c|sc|sa)ss$/i,
        use: [
          isDevelopment && !isPreview
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpe?g|webp|png|avif|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[contenthash][ext]',
        },
      },
      {
        test: /\.(woff2?|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[contenthash][ext]',
        },
      },
      {
        test: /\.(ts|js)$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
};
