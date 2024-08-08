const express = require('express');

const accesos = require('../Modelo/AccesosModel');

class AccesosController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:usuario', this.consultarAccesos);
    };
 

    consultarAccesos(req, res) {
        let usuario = req.params.usuario;
        accesos.consultarAccesos(usuario,(error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                //console.log(filas[0]);
                res.send(filas[0]);
                
            };
        });
    };
}

module.exports = new AccesosController().router;