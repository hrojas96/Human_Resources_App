const express = require('express');

const accesos = require('../Modelo/NotificacionesModel');

class NotificacionesController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarNotificaciones);
    };

    consultarNotificaciones(req, res) {
        
        accesos.consultarNotificaciones((err, filas) => {
            if (err) {
                console.log('Hubo un error',err);
                //throw error;
            } else {
                res.send(filas);
                //console.log(filas);
            };
        });
    };

}

module.exports = new NotificacionesController().router;