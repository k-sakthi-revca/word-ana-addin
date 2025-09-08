const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();

// Enable CORS for all routes with specific configuration
app.use(cors({
  origin: 'https://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With',
    'x-org-id',
    'x-user-id'
  ],
  credentials: true
}));

// Proxy middleware options for monitor API
const monitorProxyOptions = {
  target: 'https://monitor.openana.ai',
  changeOrigin: true,
  secure: false,
  onProxyReq: (proxyReq, req, res) => {
    // Log the request for debugging
    console.log(`Proxying ${req.method} request to monitor API: ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers to the proxied response
    proxyRes.headers['Access-Control-Allow-Origin'] = 'https://localhost:3001';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    
    // Log the response status for debugging
    console.log(`Received response from monitor API: ${proxyRes.statusCode}`);
  },
  logLevel: 'debug'
};

// Proxy middleware options for AI model API
const aiModelProxyOptions = {
  target: 'https://serenity.medista.ai:9017',
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/ai-model': '' // Remove the '/ai-model' prefix when forwarding
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log the request for debugging
    console.log(`Proxying ${req.method} request to AI model API: ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers to the proxied response
    proxyRes.headers['Access-Control-Allow-Origin'] = 'https://localhost:3001';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, x-org-id';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    
    // Log the response status for debugging
    console.log(`Received response from AI model API: ${proxyRes.statusCode}`);
  },
  logLevel: 'debug'
};

// Proxy middleware options for stream API
const streamApiProxyOptions = {
  target: 'https://agent-backend.openana.ai',
  changeOrigin: true,
  secure: false,
  onProxyReq: (proxyReq, req, res) => {
    // Log the request for debugging
    console.log(`Proxying ${req.method} request to stream API: ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers to the proxied response
    proxyRes.headers['Access-Control-Allow-Origin'] = 'https://localhost:3001';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, x-org-id, x-user-id';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    
    // Log the response status for debugging
    console.log(`Received response from stream API: ${proxyRes.statusCode}`);
  },
  logLevel: 'debug'
};

// Create the proxy middlewares
const monitorApiProxy = createProxyMiddleware(monitorProxyOptions);
const aiModelApiProxy = createProxyMiddleware(aiModelProxyOptions);
const streamApiProxy = createProxyMiddleware(streamApiProxyOptions);

// Use the proxies for different routes
app.use('/api/chat/v2/session', aiModelApiProxy); // Proxy session creation requests directly to AI model API
app.use('/api/chat/v2/message', aiModelApiProxy); // Proxy message requests directly to AI model API
app.use('/ai-model', aiModelApiProxy); // Proxy requests to /ai-model/* to the AI model API
app.use('/security/api/chatbot/stream', streamApiProxy); // Proxy stream API requests to agent-backend.openana.ai
app.use('/', monitorApiProxy); // Proxy all other requests to the monitor API

// Get HTTPS options from Office Add-in dev certs
const devCerts = require('office-addin-dev-certs');

async function startServer() {
  try {
    const httpsOptions = await devCerts.getHttpsServerOptions();
    
    // Create HTTPS server
    const PORT = 3000;
    https.createServer({
      key: httpsOptions.key,
      cert: httpsOptions.cert,
      ca: httpsOptions.ca
    }, app).listen(PORT, () => {
      console.log(`Proxy server running on https://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error starting proxy server:', err);
  }
}

startServer();
