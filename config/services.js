// Definicion de las rutas de las APIs
const services = [
    {
        // API 1 - Usuarios
        name: "usuarios",
        url: "https://api-users-citas-medicas-production.up.railway.app",
        path: "/api-usuarios"
    },
    {
        // API 2 - Auth
        name: "auth",
        url: "https://api-2-auth-production.up.railway.app",
        path: "/api-login"
    },
    {
        // API 3 - Services
        name: "services",
        url: "https://api-3-services-production.up.railway.app",
        path: "/api-services"
    },
    {
        // API 4 - Turnos
        name: "turnos",
        url: "https://api-4-turnos-production-92f6.up.railway.app",
        path: "/api-turnos"
    }
];

// Exportacion del modulo 
module.exports = { services };
