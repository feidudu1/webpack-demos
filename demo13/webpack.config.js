var webpack = require('webpack');

module.exports = {
    entry: {
        app: './main.js',
        vendor: ['jquery']
    },
    output: {
        filename: 'bundle.js'  //只有main.js的内容
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor', //chunk name
          filename: 'vendor.js'
      })
      //该版本该插件只能有一个参数
    ]
};
