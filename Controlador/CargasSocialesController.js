const express = require('express');

const accesos = require('../Modelo/CargasSocialesModel');
class CargasSocialesController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarCargasSociales);
        this.router.put('/:id_deduccion', this.editarCargasSociales);
    };

    //Consultar cargas sociales
    consultarCargasSociales(req, res) {
        
        accesos.consultarCargasSociales((error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                //console.log(filas);
                res.send(filas);
            };
        });
    };

    editarCargasSociales(req, res){
        let id_deduccion = req.params.id_deduccion;
        let porcentaje_salarial = req.body.porcentaje_salarial;

        try {
            accesos.editarCargasSociales(porcentaje_salarial, id_deduccion, (error, fila) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error', error)
                    };
                } else {
                    
                    res.status(200).json({ message: 'La edición del registro #' + id_deduccion + ', se ha realizado correctamente' });
                };
            });
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Hubo un error al realizar el registro' });
        }
    };
    

};

module.exports = new CargasSocialesController().router;