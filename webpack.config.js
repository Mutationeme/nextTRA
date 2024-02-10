const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const webpackConfig = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },

            },
            {
                test: /\.(css)$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [
            ".js",
            ".jsx"
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "dist")
        },
        port: 3000,
        host: "127.0.0.1",
        hot: true,
        open: true
    }
};

module.exports = webpackConfig;