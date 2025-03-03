module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'assets',
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/app.html' },
        { from: /./, to: '/app.html' }
      ]
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugin('copy').tap(args => {
        args[0].push({
          from: 'public/404.html',
          to: '404.html'
        });
        return args;
      });
    }
  }
}
