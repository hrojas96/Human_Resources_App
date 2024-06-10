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
    };

    //Consultar los permisos de un único empleado
    consultarHorasExtrasUsr(req, res) {
        let id_empleado = req.params.empleado;
        accesos.consultarHorasExtrasUsr(id_empleado,(err, resultado) => {
            if (err) {
                console.log('Hubo un error');
                //throw err;
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
            accesos.editarHorasExtrasUsr(estado, id_marca, (err, resultado) => {
                
                if (err) {
                        console.log('Hubo un error', err);
                        //throw err;
                        return res.status(500).json({ error: 'Error al realizar la solicitud' });
                } else {
                    console.log(resultado);
                    return res.json({message: 'La solicitud #' + id_marca + ', se ha realizado correctamente'});
                }
            });
            
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Error en el proceso' });
        }
    };

}

module.exports = new HorasExtras_UsrController().router;