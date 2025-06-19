// Funcion que representa un middleware mejorado
const logger = (req, res, next) => {
    // Obtiene la fecha en tiempo real
    const fecha = new Date().toISOString();
    // Obtencion de todas las peticiones 
    const method = req.method;
    // Obtener los datos de la url
    const url = req.originalUrl;
    
    // Log básico
    console.log(`[${fecha}] ${method} ${url}`);
    
    // Log adicional para peticiones POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
        console.log(`[BODY] ${JSON.stringify(req.body)}`);
        console.log(`[HEADERS] Content-Type: ${req.headers['content-type']}`);
    }
    
    // Funcion para especificar que express llame al siguiente middleware
    next();
}

// Exportacion del modulo
module.exports = logger;
