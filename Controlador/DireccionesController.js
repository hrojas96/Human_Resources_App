const express = require('express');

const accesos = require('../Modelo/DireccionesModel');

class DireccionesController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarProvincias);
        this.router.get('/:codigo_provincia', this.consultarCantones);
        this.router.post('/', this.consultarDistritos);
    };

    //Consultar provincias
    consultarProvincias(req, res) {
        
        accesos.consultarProvincias((error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
                //throw error;
            } else {
                res.send(filas);
                //console.log(filas);
            };
        });
    };

    //Consultar cantones
    consultarCantones(req, res) {
        let codigo_provincia = req.params.codigo_provincia;
        accesos.consultarCantones(codigo_provincia, (error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
                //throw error;
            } else {
                res.send(filas);
                //console.log(filas);
            };
        });
    };

    //Consultar distritos
    consultarDistritos(req, res) {
        let id_canton = req.body.id_canton;
        accesos.consultarDistritos(id_canton, (error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
                //throw error;
            } else {
                res.send(filas);
                //console.log(filas);
            };
        });
    };

}

module.exports = new DireccionesController().router;

    