const { createProxyMiddleware } = require("http-proxy-middleware");

class ProxyService {
    static createProxy(target) {
        return createProxyMiddleware({
            target: target,
            changeOrigin: true,
            timeout: 30000, // 30 segundos de timeout
            proxyTimeout: 30000,
            
            // Configuración de headers
            headers: {
                'Connection': 'keep-alive'
            },
            
            // Reescritura de rutas
            pathRewrite: (path, req) => {
                console.log(`[PATH REWRITE] Original: ${path}, Base: ${req.baseUrl}`);
                const newPath = path.replace(req.baseUrl, "");
                console.log(`[PATH REWRITE] New path: ${newPath}`);
                return newPath;
            },
            
            // Log detallado de peticiones
            onProxyReq: (proxyReq, req, res) => {
                console.log(`\n=== PROXY REQUEST ===`);
                console.log(`Method: ${req.method}`);
                console.log(`Original URL: ${req.originalUrl}`);
                console.log(`Target: ${target}`);
                console.log(`Proxy Path: ${proxyReq.path}`);
                console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
                
                // Manejar body para POST/PUT/PATCH
                if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
                    const bodyData = JSON.stringify(req.body);
                    console.log(`Body: ${bodyData}`);
                    
                    // Limpiar headers existentes que puedan causar problemas
                    proxyReq.removeHeader('content-length');
                    
                    // Establecer headers correctos
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    
                    // Escribir el body
                    proxyReq.write(bodyData);
                }
                console.log(`=== END PROXY REQUEST ===\n`);
            },
            
            // Log de respuestas
            onProxyRes: (proxyRes, req, res) => {
                console.log(`\n=== PROXY RESPONSE ===`);
                console.log(`Status: ${proxyRes.statusCode}`);
                console.log(`Method: ${req.method}`);
                console.log(`URL: ${req.originalUrl}`);
                console.log(`Response Headers: ${JSON.stringify(proxyRes.headers, null, 2)}`);
                console.log(`=== END PROXY RESPONSE ===\n`);
            },
            
            // Manejo de errores detallado
            onError: (err, req, res) => {
                console.error(`\n=== PROXY ERROR ===`);
                console.error(`Error: ${err.message}`);
                console.error(`Code: ${err.code}`);
                console.error(`Request URL: ${req.url}`);
                console.error(`Target: ${target}`);
                console.error(`Method: ${req.method}`);
                console.error(`=== END PROXY ERROR ===\n`);
                
                if (!res.headersSent) {
                    res.status(500).json({
                        error: 'Gateway Proxy Error',
                        message: err.message,
                        code: err.code,
                        target: target,
                        path: req.url,
                        method: req.method,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });
    }
}

module.exports = ProxyService;
