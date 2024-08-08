const express = require('express');

const accesos = require('../Modelo/Prestamos_AdmModel');

class PrestamosController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarPrestamos);
        this.router.post('/', this.insertarPrestamo);
        this.router.post('/:tipoReporte', this.generarReportes);
        this.router.put('/:id_prestamo', this.editarPrestamo);
        this.router.delete('/:id_prestamo', this.eliminarPrestamo);
    };

    //Consultar prestamos
    consultarPrestamos(req, res) {
        
        accesos.consultarPrestamos((error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                res.send(filas);
                //console.log(filas);
            };
        });
    };

    //Insertar prestamos
    insertarPrestamo(req, res) {
        
        let data = [{
            id_prestamo:req.body.id_prestamo,
            id_empleado:req.body.id_empleado,
            fecha_solicitud:req.body.fecha_solicitud,
            monto_solicitado:req.body.monto_solicitado,
            rebajo_salarial:req.body.rebajo_salarial,
            saldo:req.body.saldo
        }];
    try {
        accesos.insertarPrestamo(data, (error, fila) => {
            
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ error: "Datos duplicados" });
                } else {
                    console.log('Hubo un error', error);
                };
            } else {
                // Enviamos respuesta de BD
                res.json({message:'El préstamo se ha registrado correctamente'});
            }
        });
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
        };
    };

    //Editar registro de prestamos
    editarPrestamo(req, res) {
        let id_prestamo = req.params.id_prestamo;
        let id_empleado = req.body.id_empleado;
        let fecha_solicitud = req.body.fecha_solicitud;
        let monto_solicitado = req.body.monto_solicitado;
        let rebajo_salarial = req.body.rebajo_salarial;
        let saldo = req.body.saldo;

        try {
            accesos.editarPrestamo(id_empleado, fecha_solicitud, monto_solicitado, rebajo_salarial, saldo, id_prestamo, (error, fila) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error', error);
                    };
                } else {
                    // Enviamos respuesta de BD
                    res.json({message: 'La edición del préstamo #' + id_prestamo + ', se ha realizado correctamente'});
                };
            });
            } catch (error) {
                console.error("Error during database insertion:", error);
                res.status(500).json({ error: "Error de servidor" });
        };
    };

    eliminarPrestamo(req,res) {

        let id_prestamo = req.params.id_prestamo;
        accesos.eliminarPrestamo(id_prestamo, (error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                res.json({message: 'La eliminación del préstamo #' + id_prestamo + ', se ha realizado correctamente. '});
            };
        });
        
    };

    generarReportes(req, res) {  
        let tipoReporte = req.params.tipoReporte;
        let id_empleado = req.body.id_empleado;
        let fechaInicioRpt = req.body.fechaInicioRpt;
        let fechaFinalRpt = req.body.fechaFinalRpt;
        let reporteSaldo = req.body.reporteSaldo;
        let reporteDecision = req.body.reporteDecision;

        accesos.generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, reporteSaldo,reporteDecision, tipoReporte, (error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
                res.status(500).json({ error: "Error de servidor" });
            } else {
                if (filas.length == 0){
                    res.status(500).json({ error: 'No existen datos en los parámetros seleccionados' });
                }else{
                    //console.log(filas)
                    res.send(filas);
                }
                
            };
        });
    };
}

module.exports = new PrestamosController().router;

    