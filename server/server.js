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
        this.app.use(cors());
        this.app.use(express.json()); // Agregar para parsing de JSON
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
