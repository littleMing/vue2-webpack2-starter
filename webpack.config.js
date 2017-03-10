var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var autoprefixer = require('autoprefixer');

var isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    app: './src/main.js',
    vueLibrary: ['vue/vue', 'vue/vue-router', 'vue/vue-resource'],
    vendor: [ './lib', 'moment', 'bows', 'font-awesome.css']
  },
  output: {
    path: './static',
    publicPath: !isProd ? '/static/' : './static/',
    filename: !isProd ? '[name].js' : '[name].[chunkhash].js'
  },
  resolve: {
    modules: ['vendor', 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: !isProd ? {sourceMap: true} : {sourceMap: false}
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: function () {
                    return [autoprefixer({ browsers: ['iOS >= 6', 'Android >= 4.1'] })];
                  }
                }
              }],
            publicPath: './'
          })
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|vendor)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader?name=img/[name].[ext]'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ],

    noParse: /bows/
  },
  plugins: [
    new webpack.ProvidePlugin({
      Vue: 'vue/vue.js',
      // $: 'jquery',
      // jQuery: 'jquery',
      // 'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      '__DEV__': !isProd
    }),
    new ExtractTextPlugin({
      filename: !isProd ? '[name].css' : '[name].[contenthash].css',
      allChunks: false
    }),

    new webpack.optimize.CommonsChunkPlugin({
      names: ['vueLibrary', 'vendor'],
      filename: !isProd ? '[name].js' : '[name].[chunkhash].js',
      minChunks: Infinity,
    }),

    // just ignore moment.js locales
    new webpack.IgnorePlugin(/^\.\/locale/)
  ]
};


// 生产环境配置
if (isProd) {
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ManifestPlugin(),
    function() {
      this.plugin('done', function(stats) {
        var manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'static', 'manifest.json'), {encoding: 'utf8'}));
        console.log('Manifest:', manifest);
        var indexTemplate = fs.readFileSync(path.join(__dirname, 'index.template.html'), {encoding: 'utf8'});
        var indexHtml = indexTemplate.replace('{{{{vendor.css}}}}', 'static/' + manifest['vendor.css'])
            .replace('{{{{app.css}}}}', 'static/' + manifest['app.css'])
            .replace('{{{{vendor.js}}}}', 'static/' + manifest['vendor.js'])
            .replace('{{{{vueLibrary.js}}}}', 'static/' + manifest['vueLibrary.js'])
            .replace('{{{{app.js}}}}', 'static/' + manifest['app.js']);
        fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml);
      });
    }
  ]);
} else {
  module.exports.devtool = '#source-map';
  var indexTemplate = fs.readFileSync(path.join(__dirname, 'index.template.html'), {encoding: 'utf8'});
  var indexHtml = indexTemplate.replace('{{{{vendor.css}}}}', 'static/vendor.css')
      .replace('{{{{app.css}}}}', 'static/app.css')
      .replace('{{{{vendor.js}}}}', 'static/vendor.js')
      .replace('{{{{vueLibrary.js}}}}', 'static/vueLibrary.js')
      .replace('{{{{app.js}}}}', 'static/app.js');

  module.exports.devServer = {
    proxy: {
      '/api/*': {
        target: 'http://127.0.0.1:8080/pa',
        secure: false,
      },
    },

    setup: function (app) {
      app.get('/', function (req, res) {
        res.send(indexHtml);
      });

      app.get('/api/hello', function(req, res) {
        res.json({name: 'hello world'});
      });
    }

  }
}
