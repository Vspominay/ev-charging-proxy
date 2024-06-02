const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const cors = require('cors')
const app = express();

// Common proxy configuration options
const commonOptions = {
  changeOrigin: true, // Ensure correct origin forwarding for CORS
};

// REST API proxy configuration
const apiProxyOptions = {
  ...commonOptions,
  target: 'http://13.94.105.73:8000/api',
  ws: false, // Disable WebSockets for REST API
};

const apiProxy = createProxyMiddleware(apiProxyOptions);

// SignalR proxy configuration
const signalRProxyOptions = {
  ...commonOptions,
  target: 'http://13.94.105.73:8030/ChargePointHub',
  ws: true, // Enable WebSockets for SignalR
};

const signalRProxy = createProxyMiddleware(signalRProxyOptions);

// Cors middleware
app.use(cors());

// Route matching and proxy usage with logging
app.use('/api', apiProxy);
app.use('/ChargePointHub', signalRProxy);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
