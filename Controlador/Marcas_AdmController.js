const express = require('express');

const accesos = require('../Modelo/MarcasModel');

class Marcas_AdmController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        //this.router.get('/', this.consultarMarcas);
        this.router.get('/', this.consultarMarcas);
    };

    //Consulta todas las marcas de todos los empleados (Adm)
    consultarMarcas(req, res) {
        
        accesos.consultarMarcas((error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
    };

    
};



module.exports = new Marcas_AdmController().router;