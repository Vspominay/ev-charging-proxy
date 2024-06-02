const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const cors = require('cors');
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

// SignalR proxy configuration with optional CORS headers
const signalRProxyOptions = {
  ...commonOptions,
  target: 'http://13.94.105.73:8030/ChargePointHub',
  ws: true, // Enable WebSockets for SignalR

  // Additional CORS headers for SignalR (optional)
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
    proxyReq.setHeader('Access-Control-Allow-Credentials', 'true');  // For credentialed requests
  }
};

const signalRProxy = createProxyMiddleware(signalRProxyOptions);

// Route matching and proxy usage with logging
app.use('/api', apiProxy);

// Proxy SignalR with CORS applied afterwards
app.use('/ChargePointHub', signalRProxy);

// CORS middleware applied after other middleware (especially SignalR)
app.use(cors({
  origin: 'https://ev-charging-station.onrender.com',
  optionsSuccessStatus: 200
}));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
