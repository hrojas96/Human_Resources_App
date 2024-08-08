const express = require('express');

const accesos = require('../Modelo/horasExtrasModel');

class HorasExtras_UsrController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:empleado', this.consultarHorasExtrasUsr);
        this.router.put('/:id_marca', this.editarHorasExtrasUsr);
        this.router.post('/:id_empleado', this.generarReportesUsr);
    };

    //Consultar los permisos de un único empleado
    consultarHorasExtrasUsr(req, res) {
        let id_empleado = req.params.empleado;
        accesos.consultarHorasExtrasUsr(id_empleado,(error, resultado) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                res.send(resultado);
            };
        });
    };

    //Editar registro de permisos de un único empleado
    editarHorasExtrasUsr(req, res) {
        let id_marca = req.params.id_marca;
        let estado = req.body.estado;
        
        try{   
            accesos.editarHorasExtrasUsr(estado, id_marca, (error, resultado) => {
                
                if (error) {
                        console.log('Hubo un error', error);
                        return res.status(500).json({ error: 'Error al realizar la solicitud' });
                } else {
                    //console.log(resultado);
                    return res.json({message: 'La solicitud #' + id_marca + ', se ha realizado correctamente'});
                }
            });
            
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Error en el proceso' });
        }
    };

    generarReportesUsr(req, res) { 
        let id_empleado = req.params.id_empleado;
        let fechaInicioRpt = req.body.fechaInicioRpt;
        let fechaFinalRpt = req.body.fechaFinalRpt;
    
        accesos.generarReportesUsr(fechaInicioRpt,fechaFinalRpt, id_empleado, (error, filas) => {
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

module.exports = new HorasExtras_UsrController().router;