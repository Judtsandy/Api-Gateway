const { createProxyMiddleware } = require("http-proxy-middleware");

class ProxyService {
    static createProxy(target) {
        return createProxyMiddleware({
            target: target,
            changeOrigin: true,
            pathRewrite: (path, req) => path.replace(req.baseUrl, ""),
            onProxyReq: (proxyReq, req) => {
                if (req.body && Object.keys(req.body).length) {
                    const bodyData = JSON.stringify(req.body);
                    
                    // Corregir el typo: 'application' en lugar de 'aplication'
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    proxyReq.write(bodyData);
                }
            },
            onError: (err, req, res) => {
                console.error('Proxy Error:', err);
                res.status(500).json({
                    error: 'Proxy Error',
                    message: 'Unable to connect to target service'
                });
            }
        });
    }
}

module.exports = ProxyService;
