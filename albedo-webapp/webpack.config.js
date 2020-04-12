var path = require('path');

module.exports = {
    entry: './src/main/js/app.js',
    devtool: 'sourcemaps',
    devServer: {
     contentBase: './src/main/resources/templates',
     proxy: {
       '/api': {
         target: 'http://localhost:8090'
       },
       '/graphql': {
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
                test: path.join(__dirname, '.'),
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
