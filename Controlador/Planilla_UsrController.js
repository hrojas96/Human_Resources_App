const express = require('express');

const accesos = require('../Modelo/PlanillaModel');

class Planulla_UsrController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:id_empleado', this.consultarPlanillaUsr);
        this.router.put('/:id_salario', this.editarDesglosePlanilla);
    };

    //Consulta todas los salarios de un empleado específico
    consultarPlanillaUsr(req, res) {
        
        let id_empleado = req.params.id_empleado;
        accesos.consultarPlanillaUsr(id_empleado, (error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
    };

    //Editar registro de planillas de un único empleado
    editarDesglosePlanilla(req, res){
        let id_salario = req.params.id_salario;
        let monto_horas_ordinarias = req.body.monto_horas_ordinarias;
        let monto_horas_extras = req.body.monto_horas_extras;
        let monto_bono = req.body.monto_bono;
        let monto_dias_solicitados = req.body.monto_dias_solicitados;
        let salario_bruto = req.body.salario_bruto;
        let deduccion_ccss = req.body.deduccion_ccss;
        let deduccion_bancopopular = req.body.deduccion_bancopopular;
        let deduccion_prestamo = req.body.deduccion_prestamo;
        let monto_cancelado = req.body.monto_cancelado;
    
        try {
            accesos.editarDesglosePlanilla(monto_horas_ordinarias, monto_horas_extras, monto_bono, monto_dias_solicitados, salario_bruto, deduccion_ccss, deduccion_bancopopular, deduccion_prestamo, monto_cancelado, id_salario, (error, resultado) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "La feriado que ingresó ya existe." });
                    } else {
                        console.log('Hubo un error', error);
                        res.status(400).json({ error: "Hubo un error con la edición del salario # " + id_salario });
                    };
                } else {
                    console.log(resultado)
                    // Enviamos respuesta de BD
                    res.json({message: 'La edición del salario #' + id_salario + ', se ha realizado correctamente'});
                };
            });
        } catch (error) {
            console.error("Error durante el proceso:", error);
            res.status(500).json({ error: "Error durante el proceso" });
        };
    };
    
};


module.exports = new Planulla_UsrController().router;