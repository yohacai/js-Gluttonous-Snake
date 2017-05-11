var webpack = require('webpack');
//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: ["webpack-dev-server/client?http://localhost:3333/", 'webpack/hot/dev-server', path.resolve(__dirname, './src/main.js')],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'app.js'
    },
    module: {
        //加载器配置
        loaders: [
            //LESS文件先通过less-load处理成css，然后再通过css-loder加载成css模块，最后由style-loader加载器对其做最后的处理，
            // 从而运行时可以通过style标签将其应用到最终的浏览器环境
            { test: /\.less/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") },
            //.css 文件使用 style-loader 和 css-loader 来处理
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") },
            //.js 文件使用 jsx-loader 来编译处理 jsx-loader可以添加?harmony参数使其支持ES6语法
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime',"transform-decorators-legacy"],
                   // plugins: ['transform-runtime',"transform-decorators-legacy","transform-remove-console","transform-es2015-for-of","syntax-async-generators"]
                } //备注：es2015用于支持ES6语法，react用于解决render()报错的问题
            },
            //.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap' },
            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
        ]
    },
    //其它解决方案配置
    resolve: {
        extensions: ['', '.js', '.json', '.less'],
        alias: {
            src: path.resolve(__dirname, './src/')
        }
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
         new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                    },
                }),
        new ExtractTextPlugin("app.css")
    ]
};
