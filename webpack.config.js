// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/*** CONSTANTS */
const appDirectory = path.resolve(__dirname);
const browserlistTargets = 'safari >= 6.1, chrome >= 27';

const babelPresets = [
  'module:metro-react-native-babel-preset',
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      targets: browserlistTargets,
      corejs: 3,
      exclude: ["@babel/plugin-transform-regenerator", "@babel/plugin-transform-arrow-functions"],
    },
  ],
];

const babelPlugins = [
  '@babel/plugin-transform-runtime'
];

/*** CONFIGURATIONS */
const babelLoaderConfiguration = {
  test: /\.(ts|tsx|js)?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, 'index.web.js'), // Entry to your application
    path.resolve(__dirname, 'App.tsx'), // Change this to your main App file
    path.resolve(__dirname, 'src'),
    //compileNodeModules,
    path.resolve(appDirectory, 'node_modules/react-native-uncompiled'),
  ],
  use: [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets:babelPresets,
      plugins: ['react-native-web']
    }
  },
  { loader: 'ts-loader', options: { transpileOnly: true, onlyCompileBundledFiles: true }, },
]};
const svgLoaderConfiguration = {
  test: /\\\\.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(jpe?g|png|gif|woff|woff2|otf|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
  use: [
    {
        loader: 'url-loader',
        options: {
            limit: 1000,
            name : 'assets/img/[name].[ext]',
            publicPath: '/'
        }
    }
  ]
};

module.exports = {
  mode: 'development',
  entry: {
    app: [
      path.join(__dirname, 'index.web.js')
    ],
  },
  output: {
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    filename: '[name].[contenthash].js',
    sourceMapFilename: '[name].[contenthash].map',
    clean: true,
  },
  target: ['web'],
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
    fallback: {
      "fs": false,
      //"path": require.resolve("path-browserify")
    },
    alias: {
      'react-native$': 'react-native-web',
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
      //path: require.resolve("path-browserify")
    },
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
  ],
  optimization: {
    minimize: false,
    /*
    runtimeChunk:true,
    splitChunks: {
      chunks: 'all',
    },*/
    minimizer: [new TerserPlugin({
      terserOptions:{
        compress:{
          pure_funcs: ["console.log"],
          drop_console:true,
          drop_debugger:true
        }
      }
    })],
  },
  devServer: {
    compress: true,
    allowedHosts: 'all'
  }
};
