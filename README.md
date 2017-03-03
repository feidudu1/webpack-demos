This repo is a collection of simple demos of Webpack.

These demos are purposely written in a simple and clear style. You will find no difficulty in following them to learn the powerful tool.

How to use

First, install Webpack and webpack-dev-server globally.

$ npm i -g webpack@1.x webpack-dev-server@1.x
这句是安装指定版本的webpack和webpack-dev-server，也可以安装最近版本

$ npm install -g webpack webpack-dev-server

Then, clone the repo and install the dependencies.

#Mac
$ git clone https://github.com/feidudu1/webpack-demos.git

$ cd webpack-demos
$ npm install   //安装package.json中的npm配置

现在可以打开任何一个demo并运行

$ cd demo01
$ webpack-dev-server
Visit http://127.0.0.1:8080 with your browser.有时候用提示的localhost:8080并不行，所以还是用127.0.0.1:8080试试看

Foreword: What is Webpack

Webpack is a front-end build systems like Grunt and Gulp.

It can be used as a module bundler similar to Browserify, and do much more.

$ browserify main.js > bundle.js
# be equivalent to
$ webpack main.js bundle.js
Its configuration file is webpack.config.js.

// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  }
};
After having webpack.config.js, you can invoke Webpack without any arguments.

$ webpack
Some command-line options you should know.

webpack – for building once for development
webpack -p – for building once for production (minification)
webpack --watch – for continuous incremental build
webpack -d – to include source maps
webpack --colors – for making things pretty
To produce a production ready application, you could write scripts field in your package.json file as following.

// package.json
{
  // ...
  "scripts": {
    "dev": "webpack-dev-server --devtool eval --progress --colors",
    "deploy": "NODE_ENV=production webpack -p"
  },
  // ...
}
Index

Entry file
Multiple entry files
Babel-loader
CSS-loader
Image loader
CSS Module
UglifyJs Plugin
HTML Webpack Plugin and Open Browser Webpack Plugin
Environment flags
Code splitting
Code splitting with bundle-loader
Common chunk
Vendor chunk
Exposing Global Variables
Hot Module Replacement
React router
Demo01: Entry file (source)

Entry file is a file which Webpack will read to build bundle.js.

For example, main.js is an entry file.

// main.js
document.write('<h1>Hello World</h1>');
index.html

<html>
  <body>
    <script type="text/javascript" src="bundle.js"></script>
  </body>
</html>
Webpack follows webpack.config.js to build bundle.js.

// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  }
};
Launch the server, visit http://127.0.0.1:8080 .

$ webpack-dev-server
Demo02: Multiple entry files (source)

Multiple entry files are allowed. It is useful for a multi-page app.

// main1.js
document.write('<h1>Hello World</h1>');

// main2.js
document.write('<h2>Hello Webpack</h2>');
index.html

<html>
  <body>
    <script src="bundle1.js"></script>
    <script src="bundle2.js"></script>
  </body>
</html>
webpack.config.js

module.exports = {
  entry: {
    bundle1: './main1.js',
    bundle2: './main2.js'
  },
  output: {
    filename: '[name].js'
  }
};
Demo03: Babel-loader (source)

Loaders are preprocessors which transform a resource file of your app (more info). For example, Babel-loader can transform JSX/ES6 file into JS file. Official doc has a complete list of loaders.

main.jsx is a JSX file.

const React = require('react');
const ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.querySelector('#wrapper')
);
index.html

<html>
  <body>
    <div id="wrapper"></div>
    <script src="bundle.js"></script>
  </body>
</html>
webpack.config.js

module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
    ]
  }
};
In webpack.config.js, module.loaders field is used to assign loaders. The above snippet uses babel-loader which also needs plugins babel-preset-es2015 and babel-preset-react to transpile ES6 and React. You can also take another way to set the babel query option.

module: {
  loaders: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react']
      }
    }
  ]
}
Demo04: CSS-loader (source)

Webpack allows you to require CSS in JS file, then preprocessed CSS file with CSS-loader.

main.js

require('./app.css');
app.css

body {
  background-color: blue;
}
index.html

<html>
  <head>
    <script type="text/javascript" src="bundle.js"></script>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
webpack.config.js

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  }
};
Attention, you have to use two loaders to transform CSS file. First is CSS-loader to read CSS file, and another is Style-loader to insert Style tag into HTML page. Different loaders are linked by exclamation mark(!).

After launching the server, index.html will have internal style sheet.

<head>
  <script type="text/javascript" src="bundle.js"></script>
  <style type="text/css">
    body {
      background-color: blue;
    }
  </style>
</head>
Demo05: Image loader (source)

Webpack could also require images in JS files.

main.js

var img1 = document.createElement("img");
img1.src = require("./small.png");
document.body.appendChild(img1);

var img2 = document.createElement("img");
img2.src = require("./big.png");
document.body.appendChild(img2);
index.html

<html>
  <body>
    <script type="text/javascript" src="bundle.js"></script>
  </body>
</html>
webpack.config.js

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
    ]
  }
};
url-loader transforms image files. If the image size is smaller than 8192 bytes, it will be transformed into Data URL; otherwise, it will be transformed into normal URL. As you see, question mark(?) is used to pass parameters into loaders.

After launching the server, small.png and big.png will have the following URLs.

<img src="data:image/png;base64,iVBOR...uQmCC">
<img src="4853ca667a2b8b8844eb2693ac1b2578.png">
Demo06: CSS Module (source)

css-loader?modules (the query parameter modules) enables the CSS Modules spec.

It means your module's CSS is local scoped CSS by default. You can switch it off with :global(...) for selectors and/or rules. (more info)

index.html

<html>
<body>
  <h1 class="h1">Hello World</h1>
  <h2 class="h2">Hello Webpack</h2>
  <div id="example"></div>
  <script src="./bundle.js"></script>
</body>
</html>
app.css

.h1 {
  color:red;
}

:global(.h2) {
  color: blue;
}
main.jsx

var React = require('react');
var ReactDOM = require('react-dom');
var style = require('./app.css');

ReactDOM.render(
  <div>
    <h1 className={style.h1}>Hello World</h1>
    <h2 className="h2">Hello Webpack</h2>
  </div>,
  document.getElementById('example')
);
webpack.config.js

module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules'
      }
    ]
  }
};
Launch the server.

$ webpack-dev-server
Visit http://127.0.0.1:8080 , you'll find that only second h1 is red, because its CSS is local scoped, and both h2 is blue, because its CSS is global scoped.

Demo07: UglifyJs Plugin (source)

Webpack has a plugin system to expand its functions. For example, UglifyJs Plugin will minify output(bundle.js) JS codes.

main.js

var longVariableName = 'Hello';
longVariableName += ' World';
document.write('<h1>' + longVariableName + '</h1>');
index.html

<html>
<body>
  <script src="bundle.js"></script>
</body>
</html>
webpack.config.js

var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
After launching the server, main.js will be minified into following.

var o="Hello";o+=" World",document.write("<h1>"+o+"</h1>")
Demo08: HTML Webpack Plugin and Open Browser Webpack Plugin (source)

This demo shows you how to load 3rd-party plugins.

html-webpack-plugin could create index.html for you, and open-browser-webpack-plugin could open a new browser tab when Webpack loads.

main.js

document.write('<h1>Hello World</h1>');
webpack.config.js

var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Webpack-demos',
      filename: 'index.html'
    }),
    new OpenBrowserPlugin({
      url: 'http://localhost:8080'
    })
  ]
};
Run webpack-dev-server.

$ webpack-dev-server
Now you don't need to write index.html by hand and don't have to open browser by yourself. Webpack did all these things for you.

Demo09: Environment flags (source)

You can enable some codes only in development environment with environment flags.

main.js

document.write('<h1>Hello World</h1>');

if (__DEV__) {
  document.write(new Date());
}
index.html

<html>
<body>
  <script src="bundle.js"></script>
</body>
</html>
webpack.config.js

var webpack = require('webpack');

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [devFlagPlugin]
};
Now pass environment variable into webpack.

# Linux & Mac
$ env DEBUG=true webpack-dev-server

# Windows
$ set DEBUG=true
$ webpack-dev-server
Demo10: Code splitting (source)

For big web apps it’s not efficient to put all code into a single file, Webpack allows you to split them into several chunks. Especially if some blocks of code are only required under some circumstances, these chunks could be loaded on demand.

At first, you use require.ensure to define a split point. (official document)

// main.js
require.ensure(['./a'], function(require) {
  var content = require('./a');
  document.open();
  document.write('<h1>' + content + '</h1>');
  document.close();
});
require.ensure tells Webpack that ./a.js should be separated from bundle.js and built into a single chunk file.

// a.js
module.exports = 'Hello World';
Now Webpack takes care of the dependencies, output files and runtime stuff. You don't have to put any redundancy into your index.html and webpack.config.js.

<html>
  <body>
    <script src="bundle.js"></script>
  </body>
</html>
webpack.config.js

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  }
};
Launch the server.

$ webpack-dev-server
On the surface, you won't feel any differences. However, Webpack actually builds main.js and a.js into different chunks(bundle.js and 1.bundle.js), and loads 1.bundle.js from bundle.js when on demand.

Demo11: Code splitting with bundle-loader (source)

Another way of code splitting is using bundle-loader.

// main.js

// Now a.js is requested, it will be bundled into another file
var load = require('bundle-loader!./a.js');

// To wait until a.js is available (and get the exports)
//  you need to async wait for it.
load(function(file) {
  document.open();
  document.write('<h1>' + file + '</h1>');
  document.close();
});
require('bundle-loader!./a.js') tells Webpack to load a.js from another chunk.

Now Webpack will build main.js into bundle.js, and a.js into 1.bundle.js.

Demo12: Common chunk (source)

When multi scripts have common chunks, you can extract the common part into a separate file with CommonsChunkPlugin.

// main1.jsx
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>Hello World</h1>,
  document.getElementById('a')
);

// main2.jsx
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h2>Hello Webpack</h2>,
  document.getElementById('b')
);
index.html

<html>
  <body>
    <div id="a"></div>
    <div id="b"></div>
    <script src="init.js"></script>
    <script src="bundle1.js"></script>
    <script src="bundle2.js"></script>
  </body>
</html>
webpack.config.js

var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
  entry: {
    bundle1: './main1.jsx',
    bundle2: './main2.jsx'
  },
  output: {
    filename: '[name].js'
  },
  module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
    ]
  },
  plugins: [
    new CommonsChunkPlugin('init.js')
  ]
}
Demo13: Vendor chunk (source)

You can also extract the vendor libraries from a script into a separate file with CommonsChunkPlugin.

main.js

var $ = require('jquery');
$('h1').text('Hello World');
index.html

<html>
  <body>
    <h1></h1>
    <script src="vendor.js"></script>
    <script src="bundle.js"></script>
  </body>
</html>
webpack.config.js

var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js',
    vendor: ['jquery'],
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.js')
  ]
};
If you want a module available as variable in every module, such as making $ and jQuery available in every module without writing require("jquery"). You should use ProvidePlugin (Official doc).

// main.js
$('h1').text('Hello World');


// webpack.config.js
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js'
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};
Demo14: Exposing global variables (source)

If you want to use some global variables, and don't want to include them in the Webpack bundle, you can enable externals field in webpack.config.js (official document).

For example, we have a data.js.

var data = 'Hello World';
We can expose data as a global variable.

// webpack.config.js
module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
    ]
  },
  externals: {
    // require('data') is external and available
    //  on the global var data
    'data': 'data'
  }
};
Now, you require data as a module variable in your script. but it actually is a global variable.

// main.jsx
var data = require('data');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>{data}</h1>,
  document.body
);
Demo15: Hot Module Replacement (source)

Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running without a page reload.

You have two ways to enable Hot Module Replacement with the webpack-dev-server.

(1) Specify --hot and --inline on the command line

$ webpack-dev-server --hot --inline
Meaning of the options:

--hot: adds the HotModuleReplacementPlugin and switch the server to hot mode.
--inline: embed the webpack-dev-server runtime into the bundle.
--hot --inline: also adds the webpack/hot/dev-server entry.
(2) Modify webpack.config.js.

add new webpack.HotModuleReplacementPlugin() to the plugins field
add webpack/hot/dev-server and webpack-dev-server/client?http://localhost:8080 to the entry field
webpack.config.js looks like the following.

var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    './index.js'
  ],
  output: {
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      },
      include: path.join(__dirname, '.')
    }]
  }
};
Now launch the dev server.

$ webpack-dev-server
Visiting http://localhost:8080, you should see 'Hello World' in your browser.

Don't close the server. Open a new terminal to edit App.js, and modify 'Hello World' into 'Hello Webpack'. Save it, and see what happened in the browser.

App.js

import React, { Component } from 'react';

export default class App extends Component {
  render() {
    return (
      <h1>Hello World</h1>
    );
  }
}
index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
index.html

<html>
  <body>
    <div id='root'></div>
    <script src="/static/bundle.js"></script>
  </body>
</html>
Demo16: React router (source)

This demo uses webpack to build React-router's official example.

Let's imagine a little app with a dashboard, inbox, and calendar.

+---------------------------------------------------------+
| +---------+ +-------+ +--------+                        |
| |Dashboard| | Inbox | |Calendar|      Logged in as Jane |
| +---------+ +-------+ +--------+                        |
+---------------------------------------------------------+
|                                                         |
|                        Dashboard                        |
|                                                         |
|                                                         |
|   +---------------------+    +----------------------+   |
|   |                     |    |                      |   |
|   | +              +    |    +--------->            |   |
|   | |              |    |    |                      |   |
|   | |   +          |    |    +------------->        |   |
|   | |   |    +     |    |    |                      |   |
|   | |   |    |     |    |    |                      |   |
|   +-+---+----+-----+----+    +----------------------+   |
|                                                         |
+---------------------------------------------------------+
$ webpack-dev-server --history-api-fallback
Useful links

Webpack docs
webpack-howto, by Pete Hunt
Diving into Webpack, by Web Design Weekly
Webpack and React is awesome, by Christian Alfoni
Browserify vs Webpack, by Cory House
React Webpack cookbook, by Christian Alfoni
License

MIT
