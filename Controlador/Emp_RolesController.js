const express = require('express');

const accesos = require('../Modelo/EmpleadosModel');

class Emp_RolesController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.cargarRoles);
    };

    //Carga los roles en el form
    cargarRoles(req, res) {
        accesos.cargarRoles((error, filas) => {
            if (error) {
                throw error;
            } else {
                //console.log(filas)
                res.send(filas);
            }
        });
    };
}


module.exports = new Emp_RolesController().router;