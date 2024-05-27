const express = require('express');

const accesos = require('../Modelo/Prest_AbonoModel');

class Prest_AbonoController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:prestamo', this.consultarAbonos);
    };

    //Consultar abonos
    consultarAbonos(req, res)  {
        let prestamo = req.params.prestamo;
        accesos.consultarAbonos(prestamo,(error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw error;
            } else {
                let saldo = filas[0][0].monto_solicitado;
                filas[0].forEach(a => {
                    saldo -= a.monto;
                    a.saldo = saldo;
                });
                //console.log(filas[0]);
                res.send(filas[0]);
                
            };
        });
    };

}

module.exports = new Prest_AbonoController().router;