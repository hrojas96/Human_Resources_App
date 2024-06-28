const express = require('express');

const accesos = require('../Modelo/CreditosFiscalesModel');
class CreditosFiscalesController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarCreditosFiscales);
        this.router.put('/:id_credFiscal', this.editarCreditosFiscales);
    };

    //Consultar cargas sociales
    consultarCreditosFiscales(req, res) {
        
        accesos.consultarCreditosFiscales((error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                //console.log(filas);
                res.send(filas);
            };
        });
    };

    editarCreditosFiscales(req, res){
        let id_credFiscal = req.params.id_credFiscal;
        let monto_rebajo = req.body.monto_rebajo;

        try {
            accesos.editarCreditosFiscales(monto_rebajo, id_credFiscal, (err, fila) => {
                
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error', err)
                        //throw err;
                    };
                } else {
                    
                    res.status(200).json({ message: 'La edición del registro #' + id_credFiscal + ', se ha realizado correctamente' });
                };
            });
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Hubo un error al realizar el registro' });
        }
    };
    

};

module.exports = new CreditosFiscalesController().router;