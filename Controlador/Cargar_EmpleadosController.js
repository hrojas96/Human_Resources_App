const express = require('express');

const accesos = require('../Modelo/Prestamos_AdmModel');

class Prest_EmpleadosController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.cargarEmpleados);
    };

    //Carga los empleados en el form
    cargarEmpleados(req, res) {
        //console.log('llegó a la logica cargar empleados');
        accesos.cargarEmpleados((error, filas) => {
            if (error) {
                console.log('Hubo un error', error)
            } else {
                //console.log(filas)
                res.send(filas);
            }
        });
    };
}

module.exports = new Prest_EmpleadosController().router;