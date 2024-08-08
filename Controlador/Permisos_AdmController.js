const express = require('express');

const accesos = require('../Modelo/PermisosModel');
const solicitudes = require('./SolicitudesController');

class Permisos_AdmController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarPermisoAdm);
        this.router.post('/:tipoReporte', this.generarReportes);
        this.router.put('/:id_permiso', this.editarPermisoAdm);
    };

    //Consultar los permisos pendientes de jefatura
    consultarPermisoAdm(req, res) {
        accesos.consultarPermisoAdm( (error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                res.send(filas);
            };
        });
    };

    //Editar desición de la jefatura
    editarPermisoAdm(req, res) {
        let id_permiso = req.params.id_permiso;
        let decision_RRHH = req.body.decision_RRHH;
        let msj_RRHH = req.body.msj_RRHH;
        let derecho_pago = req.body.derecho_pago;

        try {
            accesos.editarPermisoAdm(decision_RRHH, msj_RRHH, derecho_pago, id_permiso, (error, resultado) => {
                
                if (error) {
                    console.log('Hubo un error', error);
                    return res.status(500).json({ error: 'Error al editar el permiso en la base de datos' });
                } else {
                    console.log(resultado);
                    if (decision_RRHH == 'Aprobado' && derecho_pago == 'Aprobado'){
                        solicitudes.solicitudesPermisos(id_permiso);
                    }
                    return res.json({message: 'La edición del permiso #' + id_permiso + ', se ha realizado correctamente'});
                }
            });
        } catch (error) {
            console.error('Error durante el proceso:', error);
        return res.status(500).json({ error: 'Hubo un error al consultar si las fechas registradas son hábiles' });
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

module.exports = new Permisos_AdmController().router;