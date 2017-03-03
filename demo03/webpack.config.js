module.exports = {
    entry: './main.jsx',
    output: {
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react'
            },
            // {   babel-loader的另一种设置方法
            //     test: /\.js[x]?$/,
            //     exclude: /node_modules/,
            //     loader: 'babel',
            //     query: {
            //         presets: ['es2015','react']
            //     }
            // }
        ]
    }
};
