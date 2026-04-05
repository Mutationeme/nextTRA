const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const LicensePlugin = require('webpack-license-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { EXTRA_LICENSE_ENTRIES } = require("./extraLicenseNotice");

const AppendExtraLicensesPlugin = {
    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('AppendExtraLicenses', (compilation, callback) => {
            const outputPath = compilation.outputOptions.path;
            const { chunkGraph } = compilation;

            for (const chunk of compilation.chunks) {
                const resources = new Set();
                for (const module of chunkGraph.getChunkModules(chunk)) {
                    const resource = module.resource || (module.userRequest ?? '');
                    if (resource) {
                        resources.add(resource);
                    }
                    if (module.modules) {
                        for (const inner of module.modules) {
                            const r = inner.resource || (inner.userRequest ?? '');
                            if (r) {
                                resources.add(r);
                            }
                        }
                    }
                }

                const resourceArray = [...resources];

                const notices = EXTRA_LICENSE_ENTRIES
                    .filter(({ match }) => resourceArray.some(match))
                    .map(({ notice }) => notice);

                if (notices.length === 0) {
                    continue;
                }

                const extraLicensesNotice = notices.join('\n\n');

                const chunkFiles = [...chunk.files]
                    .filter(f => f.endsWith('.js'));

                for (const jsFile of chunkFiles) {
                    const licenseFilepath = path.join(outputPath, `${jsFile}.LICENSE.txt`);

                    if (fs.existsSync(licenseFilepath)) {
                        const original = fs.readFileSync(licenseFilepath, 'utf8');
                        fs.writeFileSync(licenseFilepath, original + '\n' + extraLicensesNotice, 'utf8');
                    }
                    else {
                        fs.writeFileSync(licenseFilepath, extraLicensesNotice, 'utf8');
                    }
                }
            }

            callback();
        });
    },
};

module.exports = (env, argv) => {
    const isProduction = argv && argv.mode === "production";

    return {
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
            }),
            new MiniCssExtractPlugin({
                filename: isProduction ? "css/[name].[contenthash].css" : "css/[name].css"
            }),
            new CssMinimizerWebpackPlugin(),
            new CleanWebpackPlugin(),
            new BundleAnalyzerPlugin(),
            ...(isProduction ? [
                new LicensePlugin(),
                AppendExtraLicensesPlugin,
            ] : []),
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
};