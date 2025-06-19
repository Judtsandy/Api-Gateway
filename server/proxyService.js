const { createProxyMiddleware } = require("http-proxy-middleware");

class ProxyService {
    static createProxy(target) {
        return createProxyMiddleware({
            target: target,
            changeOrigin: true,
            pathRewrite: (path, req) => path.replace(req.baseUrl, ""),
            
            // CONFIGURACIÓN CRÍTICA PARA POST/PUT/PATCH
            onProxyReq: (proxyReq, req, res) => {
                // Solo procesar el body si existe y tiene contenido
                if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
                    const bodyData = JSON.stringify(req.body);
                    
                    // Configurar headers correctamente
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    
                    // Escribir el body
                    proxyReq.write(bodyData);
                }
            },
            
            // Manejo de errores mejorado
            onError: (err, req, res) => {
                console.error('Proxy Error:', err.message);
                console.error('Request URL:', req.url);
                console.error('Target:', target);
                
                if (!res.headersSent) {
                    res.status(500).json({
                        error: 'Proxy Error',
                        message: 'Unable to connect to target service',
                        target: target,
                        path: req.url
                    });
                }
            },
            
            // Log de peticiones para debugging
            onProxyReq: (proxyReq, req, res) => {
                console.log(`[PROXY] ${req.method} ${req.url} -> ${target}${proxyReq.path}`);
                
                // Manejar el body para POST/PUT/PATCH
                if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
                    const bodyData = JSON.stringify(req.body);
                    
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    proxyReq.write(bodyData);
                }
            },
            
            // Log de respuestas
            onProxyRes: (proxyRes, req, res) => {
                console.log(`[PROXY RESPONSE] ${proxyRes.statusCode} for ${req.method} ${req.url}`);
            }
        });
    }
}

module.exports = ProxyService;
