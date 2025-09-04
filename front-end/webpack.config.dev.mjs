import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import Dotenv from "dotenv-webpack";
// import ESLintPlugin from "eslint-webpack-plugin";
import { fileURLToPath } from "url";
//import { ProvidePlugin } from 'webpack';

export default {
  entry: "./src/index.js",
  output: {
    //path: path.resolve(path.dirname(new URL(import.meta.url).path), 'dist'),
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist"),
    filename: "[name].[contenthash].js",
  },
  mode: "development",
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // https://stackoverflow.com/questions/57935343/the-babel-preset-babel-preset-react-doesnt-like-my-javascript-function-that-re
            // https://stackoverflow.com/questions/75808199/why-might-babel-preset-react-automatic-transform-not-succeed-in-conjunction-wit
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
            plugins: [
              "@babel/plugin-transform-runtime",
              //"@babel/plugin-transform-react-jsx"
            ],
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.html$/,
        use: [{ loader: "html-loader" }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./public/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css",
    }),
    new Dotenv(),
    /* new ESLintPlugin({
      overrideConfigFile: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "eslint.config.mjs"
      ),
      configType: "flat",
      eslintPath: "./usr/todo-app/node_modules/eslint-webpack-plugin",
    }), */
    /*   new ProvidePlugin({
      React: 'react',
    }) */
  ],
  devServer: {
    /* static: {
      directory: path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
    }, */
    hot: true,
    host: "0.0.0.0",
    compress: true,
    historyApiFallback: true,
    port: 3000,
    watchFiles: {
      paths: ["src/**/*"],
      options: {
        usePolling: true,
        ignored: /node_modules/,
      },
    },
  },
};
