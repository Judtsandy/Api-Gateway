const cors = require("cors");
const express = require("express");
const logger = require("../middlewares/logger");
const gatewayRoutes = require("../routes/gateway.routes");

class Server {
    constructor(port) {
        this.app = express();
        this.port = port;
        this.middlewares();
        this.routes();
    }

    middlewares() {
        // CORS con configuración específica
        this.app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            credentials: false
        }));
        
        // Middleware para debugging body raw
        this.app.use((req, res, next) => {
            if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
                console.log(`[RAW BODY] Method: ${req.method}, Content-Type: ${req.headers['content-type']}`);
            }
            next();
        });
        
        // Body parsing con configuración robusta
        this.app.use(express.json({ 
            limit: '10mb',
            strict: true,
            type: 'application/json'
        }));
        
        this.app.use(express.urlencoded({ 
            extended: true,
            limit: '10mb'
        }));
        
        // Logger después del parsing
        this.app.use(logger);
        
        // Middleware para verificar que el body se parseó correctamente
        this.app.use((req, res, next) => {
            if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
                console.log(`[PARSED BODY] ${JSON.stringify(req.body)}`);
            }
            next();
        });
    }
    
    routes() {
        // Ruta de salud para Railway
        this.app.get('/health', (req, res) => {
            res.status(200).json({ 
                status: 'OK', 
                message: 'Gateway is running',
                timestamp: new Date().toISOString()
            });
        });
        
        this.app.use(gatewayRoutes);
    }
    
    start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`Gateway running on port ${this.port}`);
        });
    }
}

module.exports = Server;
