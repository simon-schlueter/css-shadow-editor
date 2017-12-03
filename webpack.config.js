const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const config = {
  entry: {
    app: "./src/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "build/"),
    filename: "[name].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  stats: {
    children: false
  },
  devtool: process.env.NODE_ENV === "production" ? "cheap-module-source-map" : "eval-source-map",
  devServer: {
    contentBase: path.join(__dirname, "build"),
    publicPath: "http://localhost:8080/",
    historyApiFallback: true,
    index: "index.html"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: {
            loader: "css-loader",
            options: {
              context: "./src",
              module: true,
              importLoaders: 1,
              localIdentName: "[path][name]__[local]"
            }
          }
        })
      },
      {
        test: /\.(jpg|gif|png|eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[sha512:hash:base64:7]-[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development")
      }
    }),
    new ExtractTextPlugin("app.css", { allChunks: true })
  ]
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(new UglifyJSPlugin({
    sourceMap: true
  }));
}

module.exports = config;
