import devConfig from './webpack.config.dev.mjs';

// https://webpack.js.org/configuration/dev-server/
export default {
  ...devConfig,
  devServer: {
    ...devConfig.devServer,
    // disable HTTPS in CI
    server: undefined,
    // Allow access from Docker containers, fixing "Invalid Host header" error
    allowedHosts: ['todo-gui', 'localhost'], // 'all'
    // Proxy API requests to the backend. The browser can't resolve the Docker service names
    proxy: [
      {
        context: ['/api/auth', '/api/todo', '/api/health'],
        target: 'http://todo-sails-app:1337',
        changeOrigin: true,
        secure: false,
      }
    ],
  },
};