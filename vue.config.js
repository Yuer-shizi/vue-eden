const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  outputDir: process.env.outputDir,
  lintOnSave: true,

  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      console.log(process.env.NODE_ENV)
      // 为生产环境修改配置...
      // console.log(process.env.baseUrl)
      // console.log(process.env.outputDir)
    } else {
      // 为开发环境修改配置...
      console.log(process.env.NODE_ENV)
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('api', resolve('src/api'))
      .set('utils', resolve('src/utils'))
      .set('store', resolve('src/store'))
      .set('router', resolve('src/router'))

    config.resolve.extensions
      .add('.js')
      .add('.vue')
      .add('.styl')

    config.module.rule('svg').uses.clear()
    config.module
      .rule('svg')
      .use('raw-loader')
      .loader('raw-loader')
  },

  productionSourceMap: false,
  css: {
    sourceMap: false
  },

  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8863,
    https: false,
    hotOnly: false,
    proxy: null
  }
}
