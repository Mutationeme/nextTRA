const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = (env, argv) => {
    const webpackConfig = {
        mode: "development",
        entry: "./src/index.js",
        output: {
            path: path.resolve(__dirname, "build"),
            filename: "js/bundle.js"
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
                        // "style-loader",
                        MiniCssExtractPlugin.loader,
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
            new DefinePlugin({
                __PRODUCTION__: ((argv != undefined) && (argv.mode === "production")) ? true: false,
            }),
            new HtmlWebpackPlugin({
                template: "./public/index.html",
                // favicon: "./public/favicon.ico",
            }),
            new MiniCssExtractPlugin({
                filename: "css/style.css"
            }),
            new CssMinimizerWebpackPlugin(),
            new CleanWebpackPlugin(),
        ],
        devServer: {
            static: {
                directory: path.resolve(__dirname, "public"),
            },
            port: 3000,
            host: "127.0.0.1",
            hot: true,
            open: true
        }
    };

    return webpackConfig;
};