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
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
  credentials: true
}));

// Proxy middleware options
const proxyOptions = {
  target: 'https://monitor.openana.ai',
  changeOrigin: true,
  secure: false,
  onProxyReq: (proxyReq, req, res) => {
    // Log the request for debugging
    console.log(`Proxying ${req.method} request to: ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers to the proxied response
    proxyRes.headers['Access-Control-Allow-Origin'] = 'https://localhost:3000';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    
    // Log the response status for debugging
    console.log(`Received response: ${proxyRes.statusCode}`);
  },
  logLevel: 'debug'
};

// Create the proxy middleware
const apiProxy = createProxyMiddleware(proxyOptions);

// Use the proxy for all routes
app.use('/', apiProxy);

// Get HTTPS options from Office Add-in dev certs
const devCerts = require('office-addin-dev-certs');

async function startServer() {
  try {
    const httpsOptions = await devCerts.getHttpsServerOptions();
    
    // Create HTTPS server
    const PORT = 5173;
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
