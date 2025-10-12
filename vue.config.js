'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
// const port = process.env.port || process.env.npm_config_port || 8084 // dev port

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/admin" : "/",
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  devServer: {
    proxy: {
      "/track": {
        target: "http://127.0.0.1:8000",
        pathRewrite: {"^/track": "/track"}
      }
    },
    port: 8081
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('vue-loader')
      .loader('vue-loader') // or `vue-loader-v16` if you are using a preview support of Vue 3 in Vue CLI
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  }
  // chainWebpack:config => {
  //     config.resolve.alias.set('@', resolve('src'))
  // }
}
