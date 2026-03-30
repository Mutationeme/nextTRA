const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
//const LicensePlugin = require('webpack-license-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env, argv) => {
    const isProduction = argv && argv.mode === "production";

    const webpackConfig = {
        mode: isProduction ? "production" : "development",
        entry: {
            bundle: "./src/index.js"
        },
        output: {
            path: path.resolve(__dirname, "build"),
            filename: isProduction ? "js/[name].[contenthash].js" : "js/[name].js"
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
                __PRODUCTION__: isProduction,
            }),
            new HtmlWebpackPlugin({
                template: "./public/index.html",
                // favicon: "./public/favicon.ico",
            }),
            new MiniCssExtractPlugin({
                filename: isProduction ? "css/[name].[contenthash].css" : "css/[name].css"
            }),
            new CssMinimizerWebpackPlugin(),
            new CleanWebpackPlugin(),
            new BundleAnalyzerPlugin(),
            //new LicensePlugin(),
        ],
        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
        },
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