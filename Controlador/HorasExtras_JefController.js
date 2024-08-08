const express = require('express');

const accesos = require('../Modelo/horasExtrasModel');

class HorasExtras_JefController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:id_jefatura', this.consultarHorasExtrasJef);
        this.router.put('/:id_marca', this.editarHorasExtrasJef);
    };

    //Consultar los permisos de un único empleado
    consultarHorasExtrasJef(req, res) {
        let id_jefatura = req.params.id_jefatura;
        accesos.consultarHorasExtrasJef(id_jefatura,(error, resultado) => {
            if (error) {
                console.log('Hubo un error'), error;
            } else {
                res.send(resultado);
            };
        });
    };

    //Editar registro de permisos de un único empleado
    editarHorasExtrasJef(req, res) {
        let id_marca = req.params.id_marca;
        let decision_jefatura = req.body.decision_jefatura;

        let estado = "";
        if (decision_jefatura == "Denegado"){
            estado = "Denegado"
        } else{
            estado = "Solicitado"
        }
        
        try{   
            accesos.editarHorasExtrasJef(estado, decision_jefatura, id_marca, (error, resultado) => {
                
                if (error) {
                        console.log('Hubo un error', error);
                        return res.status(500).json({ error: 'Error al realizar la solicitud' });
                } else {
                    console.log(resultado);
                    return res.json({message: 'La solicitud #' + id_marca + ', se ha deligenciado correctamente'});
                }
            });
            
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Error durante el proceso' });
        }
    };

}

module.exports = new HorasExtras_JefController().router;