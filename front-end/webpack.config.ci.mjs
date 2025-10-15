import devConfig from './webpack.config.dev.mjs';

// https://webpack.js.org/configuration/dev-server/
export default {
  ...devConfig,
  devServer: {
    ...devConfig.devServer,
    // disable HTTPS in CI
    server: undefined,
    // Allow access from Docker containers, fixing "Invalid Host header" error
    allowedHosts: 'all', 
    // allowedHosts: ['todo-gui', 'localhost'],
    // Proxy API requests to the backend. The browser can't resolve the Docker service names
    proxy: [
      {
        context: ['/auth', '/todo', '/health'],
        target: 'http://todo-sails-app:1337',
        changeOrigin: true,
        secure: false,
      }
    ],
  },
};