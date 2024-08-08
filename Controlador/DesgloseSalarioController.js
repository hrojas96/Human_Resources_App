const express = require('express');

const accesos = require('../Modelo/PlanillaModel');

class Planulla_UsrController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:id_empleado', this.consultarPlanillaUsr);
        
    };

    //Consulta todas los salarios de un empleado específico
    consultarPlanillaUsr(req, res) {
        
        let id_empleado = req.params.id_empleado;
        accesos.consultarPlanillaUsr(id_empleado, (error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                res.send(filas);
            };
        });
    };

    


    
};


module.exports = new Planulla_UsrController().router;