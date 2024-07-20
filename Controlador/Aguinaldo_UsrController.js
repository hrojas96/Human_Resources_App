const express = require('express');

const accesos = require('../Modelo/AguinaldosModel');

class Aguinaldo_UsrController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:id_empleado', this.consultarAguinaldoUsr);
    };

    //Consulta todas los salarios de un empleado específico
    consultarAguinaldoUsr(req, res) {
        
        let id_empleado = req.params.id_empleado;
        accesos.consultarAguinaldoUsr(id_empleado, (error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
    };

    
};


module.exports = new Aguinaldo_UsrController().router;