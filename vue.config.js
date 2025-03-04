module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'assets',
  devServer: {
    historyApiFallback: {
      // Rewrite all routes to app.html, allowing Vue Router to handle them
      rewrites: [
        { from: /^(?!\/app.html$)/, to: '/app.html' } // Rewrite to app.html instead of index.html for all non-app.html routes
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
};