const routes = require("express").Router();
const axios = require("axios");
const { services } = require("../config/services");

// Función helper para manejar peticiones
const handleRequest = async (req, res, targetUrl) => {
    try {
        const config = {
            method: req.method.toLowerCase(),
            url: targetUrl + req.url.replace(req.baseUrl, ''),
            headers: {
                ...req.headers,
                host: undefined, // Remover host header
                'content-length': undefined // Remover content-length
            },
            timeout: 30000
        };

        // Agregar body para POST/PUT/PATCH
        if (['post', 'put', 'patch'].includes(config.method) && req.body) {
            config.data = req.body;
        }

        console.log(`[AXIOS] ${config.method.toUpperCase()} ${config.url}`);
        console.log(`[AXIOS] Body:`, config.data);

        const response = await axios(config);
        
        // Reenviar headers de respuesta
        Object.keys(response.headers).forEach(key => {
            if (key !== 'content-encoding' && key !== 'transfer-encoding') {
                res.setHeader(key, response.headers[key]);
            }
        });

        res.status(response.status).json(response.data);
        
    } catch (error) {
        console.error('[AXIOS ERROR]', error.message);
        
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({
                error: 'Gateway Error',
                message: error.message,
                code: error.code
            });
        }
    }
};

// Crear rutas para cada servicio
services.forEach(({ url, path }) => {
    routes.use(path, (req, res) => {
        handleRequest(req, res, url);
    });
});

module.exports = routes;
