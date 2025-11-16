import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import Dotenv from "dotenv-webpack";
import { fileURLToPath } from "url";
import fs from "fs";

let secureServerConfig;
try {
  secureServerConfig = {
    type: "https",
    options: {
      key: fs.readFileSync("./ssl/localhost-key.pem"),
      cert: fs.readFileSync("./ssl/localhost.pem"),
      ca: fs.readFileSync("./ssl/rootCA.pem"),
    },
  };
  console.log("Using HTTPS for webpack dev server");
} catch (error) {
  secureServerConfig = undefined;
  console.log("Could not read SSL files, falling back to HTTP");
}

export default {
  entry: "./src/index.js",
  output: {
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
    new Dotenv({
      // Expose environment variables injected by Docker to Webpack’s client build
      systemvars: true,
      allowEmptyValues: true,
    }),
  ],
  devServer: {
    hot: true,
    host: "0.0.0.0",
    compress: true,
    historyApiFallback: true,
    port: 3000,
    // https://webpack.js.org/configuration/dev-server/#devserverserver
    server: secureServerConfig,
    watchFiles: {
      paths: ["src/**/*"],
      options: {
        usePolling: true,
        poll: 1000,
        ignored: /node_modules/,
      },
    },
  },
};
