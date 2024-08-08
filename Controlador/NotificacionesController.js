const express = require('express');

const accesos = require('../Modelo/NotificacionesModel');

class NotificacionesController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:id_jefatura', this.consultarNotificacionesJef);
        this.router.post('/', this.consultarNotificacionesAdm);
    };

    consultarNotificacionesJef(req, res) {
        let id_jefatura = req.params.id_jefatura
        
        accesos.consultarNotificacionesJef(id_jefatura, (error, filas) => {
            if (error) {
                console.log('Hubo un error',error);
            } else {

                res.send(filas);
            };
        });
    };

    async consultarNotificacionesAdm(req, res) {
        let id_empleado = req.body.id_empleado
        const roles = await accesos.consultarRoles(id_empleado);
        console.log(roles);

        if (roles[0].acc_horasExtras_RRHH == 1 || roles[0].acc_permisos_RRHH == 1 || roles[0].acc_vacaciones_RRHH == 1){
            try{
                accesos.consultarNotificacionesAdm( (error, filas) => {
                    if (error) {
                        console.log('Hubo un error',error);
                    } else {

                        res.send(filas);
                    };
                });
            } catch (error) {
                
                console.error("Error de servidor", error);
                
            };
        }
    };

}

module.exports = new NotificacionesController().router;