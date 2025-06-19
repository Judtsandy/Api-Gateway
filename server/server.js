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
        // ORDEN IMPORTANTE: CORS primero
        this.app.use(cors({
            origin: '*', // En producción, especifica los orígenes permitidos
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        
        // Parsing de JSON ANTES del logger
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        
        // Logger después del parsing
        this.app.use(logger);
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
