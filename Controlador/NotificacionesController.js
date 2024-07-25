const express = require('express');

const accesos = require('../Modelo/NotificacionesModel');

class NotificacionesController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:id_jefatura', this.consultarNotificacionesJef);
        this.router.post('/', this.consultarNotificacionesAdm);
    };

    consultarNotificacionesJef(req, res) {
        let id_jefatura = req.params.id_jefatura
        
        accesos.consultarNotificacionesJef(id_jefatura, (err, filas) => {
            if (err) {
                console.log('Hubo un error',err);
                //throw error;
            } else {
                console.log(filas);
                //console.log((filas.id_permiso).length);

                res.send(filas);
                //console.log(filas);
            };
        });
    };

    consultarNotificacionesAdm(req, res) {
        let id_jefatura = req.body.id_jefatura
        
        accesos.consultarNotificacionesAdm(id_jefatura, (err, filas) => {
            if (err) {
                console.log('Hubo un error',err);
                //throw error;
            } else {
                console.log(filas);
                //console.log((filas.id_permiso).length);

                res.send(filas);
                //console.log(filas);
            };
        });
    };

}

module.exports = new NotificacionesController().router;