// Definicion de las rutas de las Apis
const services =[
    {
        //Api 1
        name: "usuarios",
        url:  "http://192.168.103.85:3006",
        path: "/api-usuarios"
    },
    {
        // Api 2
        name: "auth",
        url:  "http://192.168.103.126:3007",
        path: "/api-login"

    },
    {
        //API 3
        name: "services",
        url:  "http://192.168.103.188:3008",
        path: "/api-services"
    },
    {
        //API 3
        name: "turnos",
        url:  "http://192.168.103.85:3009",
        path: "/api-turnos"
    }

]
 // Exportacion del modulo 
module.exports = {services};
