const express = require('express');

const accesos = require('../Modelo/EmpleadosModel');

class Emp_PuestosController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.cargarPuestos);
    };

    //Carga los empleados en el form
    cargarPuestos(req, res) {
        accesos.cargarPuestos((error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                //console.log(filas)
                res.send(filas);
            }
        });
    };
}

module.exports = new Emp_PuestosController().router;;

