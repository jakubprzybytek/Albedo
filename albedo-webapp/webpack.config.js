var path = require('path');

module.exports = {
    entry: './src/main/js/app.js',
    devtool: 'sourcemaps',
    devServer: {
     contentBase: './src/main/resources/static',
     proxy: {
       '/api': {
         target: 'http://localhost:8090'
       }
     }
    },
    cache: true,
    mode: 'development',
    output: {
        path: path.resolve(__dirname, './src/main/resources/static'),
        publicPath: '/',
        filename: 'built/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }]
            }
        ]
    }
};
