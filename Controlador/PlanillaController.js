const express = require('express');

const accesos = require('../Modelo/PlanillaModel');

class PlanillaController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarPlanilla);
        this.router.post('/', this.calcularPlanilla);
    };

    //Consultar salarios
    consultarPlanilla(req, res)  {
        accesos.consultarPlanilla((error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw error;
            } else {
                //console.log(filas[0]);
                res.send(filas);
                
            };
        });
    };

    //CalcularSalarios
    calcularPlanilla(req, res) {
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;

        try {
            accesos.consultarDatosPlanilla(fecha_desde, fecha_hasta, (err, filas) => {
                
                if (err) {
                    
                    console.log('Hubo un error');
                    throw err;
                    
                } else {
                    //Revisa si se encontró datos en el parámetro de fechas dado
                    if (filas.length > 0) {
                        console.log(filas);

                        let deduccion_ccss = 0;
                        let deduccion_bancopopular = 0;
                        let deduccion_renta = 0;
                        console.log(filas);


                    
                    } else {
                        console.log('No existen datos en el parámetro de fechas dado, para el cálculo de salarios. Revise las fechas dadas.');
                    }
                }
            });
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
        }; 
    };   
    

};

module.exports = new PlanillaController().router;