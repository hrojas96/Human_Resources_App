const express = require('express');

const accesos = require('../Modelo/horasExtrasModel');

class HorasExtras_AdmController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarHorasExtrasAdm);
        this.router.post('/:tipoReporte', this.generarReportes);
        this.router.put('/:id_marca', this.editarHorasExtrasAdm);
    };

    //Consultar los permisos de un único empleado
    consultarHorasExtrasAdm(req, res) {
        accesos.consultarHorasExtrasAdm((err, resultado) => {
            if (err) {
                console.log('Hubo un error');
                throw err;
            } else {
                res.send(resultado);
            };
        });
    };

    //Editar registro de permisos de un único empleado
    async editarHorasExtrasAdm(req, res) {
        let id_marca = req.params.id_marca;
        let decision_RRHH = req.body.decision_RRHH;
        
        try{   
             accesos.editarHorasExtrasAdm(decision_RRHH, id_marca, (err, resultado) => {
                
                if (err) {
                        console.log('Hubo un error', err);
                        //throw err;
                        return res.status(500).json({ error: 'Error al realizar la solicitud' });
                } else {
                    console.log(resultado);
                    let estado = "";
                    if (decision_RRHH == "Aprobado"){
                        estado = "Aprobado"
                    } else if (decision_RRHH == "Denegado"){
                        estado = "Denegado"
                    } else{
                        estado = "Pendiente"
                    }
                    
                    accesos.editarHorasExtrasUsr(estado, id_marca, (err, resultado) => {
                    
                        if (err) {
                                console.log('Hubo un error', err);
                                return res.status(500).json({ error: 'Error al insertar los permisos en la base de datos' });
                        } else {
                            console.log('Se ha editado correctamente el estado de la solicitud', resultado);
                        }
                    });
                    return res.json({message: 'La solicitud #' + id_marca + ', se ha deligenciado correctamente'});
                }
            });
            
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Error durante el proceso' });
        }
    };

    generarReportes(req, res) {      
        console.log('llegooooos')
        let tipoReporte = req.params.tipoReporte;
        let id_empleado = req.body.id_empleado;
        let fechaInicioRpt = req.body.fechaInicioRpt;
        let fechaFinalRpt = req.body.fechaFinalRpt;
        let decision = req.body.decision;
        let reporteDecision = req.body.reporteDecision;

        accesos.generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, decision,reporteDecision, tipoReporte, (err, filas) => {
            if (err) {
                res.status(500).json({ error: "Error de servidor" });
                throw err;
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

module.exports = new HorasExtras_AdmController().router;