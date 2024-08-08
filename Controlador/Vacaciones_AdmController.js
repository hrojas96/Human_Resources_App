const express = require('express');

const accesos = require('../Modelo/VacacionesModel');
const solicitudes = require('./SolicitudesController');

class Vacaciones_AdmController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarVacacionesAdm);
        this.router.post('/:tipoReporte', this.generarReportes);
        this.router.put('/:id_vacaciones', this.editarVacacionesAdm);
    };


    //Consultar los permisos pendientes de jefatura
    consultarVacacionesAdm(req, res) {
        accesos.consultarVacacionesAdm((error, resultado) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                res.send(resultado);
            };
        });
    };

    //Editar desición de la jefatura
    editarVacacionesAdm(req, res) {
        let id_vacaciones = req.params.id_vacaciones;
        let decision_RRHH = req.body.decision_RRHH;
        let msj_RRHH = req.body.msj_RRHH;

        try {
            accesos.editarVacacionesAdm(decision_RRHH, msj_RRHH, id_vacaciones, (error, resultado) => {
                
                if (error) {
                    console.log('Hubo un error', error);
                    return res.status(500).json({ error: 'Error al editar las vacaciones en la base de datos' });
                } else {
                    console.log(resultado);
                    if (decision_RRHH == 'Aprobado'){
                        solicitudes.solicitudesVacaciones(id_vacaciones);
                    }
                    return res.json({message: 'La edición del registro #' + id_vacaciones + ', se ha realizado correctamente'});
                }
            });
        } catch (error) {
            console.error('Error durante el proceso:', error);
        return res.status(500).json({ error: 'Error durante el proceso' });
        }
    };

    generarReportes(req, res) {   
        let tipoReporte = req.params.tipoReporte;
        let id_empleado = req.body.id_empleado;
        let fechaInicioRpt = req.body.fechaInicioRpt;
        let fechaFinalRpt = req.body.fechaFinalRpt;
        let decision = req.body.decision;
        let reporteDecision = req.body.reporteDecision;

        accesos.generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, decision,reporteDecision, tipoReporte, (error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
                res.status(500).json({ error: "Error de servidor" });
            } else {
                if (filas.length == 0){
                    res.status(500).json({ error: 'No existen datos en los parámetros seleccionados' });
                }else{
                    console.log(filas)
                    res.send(filas);
                }
                
            };
        });
    };

}

module.exports = new Vacaciones_AdmController().router;