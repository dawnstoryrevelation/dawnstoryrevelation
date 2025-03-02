module.exports = {
  // Use a relative path that works better for different deployment environments
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'assets',
  devServer: {
    historyApiFallback: true
  },
  // This ensures that the index.html file will be properly created
  // And all assets will be properly referenced
  chainWebpack: config => {
    // This helps with SPA routing in production
    if (process.env.NODE_ENV === 'production') {
      // Copy the 404.html file to the output directory
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