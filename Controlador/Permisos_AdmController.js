const express = require('express');

const accesos = require('../Modelo/PermisosModel');

class Permisos_AdmController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarPermisoAdm);
        this.router.put('/:id_permiso', this.editarPermisoAdm);
    };

    //Consultar los permisos pendientes de jefatura
    consultarPermisoAdm(req, res) {
        accesos.consultarPermisoAdm( (error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw error;
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
            accesos.editarPermisoAdm(decision_RRHH, msj_RRHH, derecho_pago, id_permiso, (err, resultado) => {
                
                if (err) {
                    console.log('Hubo un error', err);
                    //throw err;
                    return res.status(500).json({ error: 'Error al editar el permiso en la base de datos' });
                } else {
                    console.log(resultado);
                    return res.json({message: 'La edición del permiso #' + id_permiso + ', se ha realizado correctamente'});
                }
            });
        } catch (error) {
            console.error('Error durante el proceso:', error);
        return res.status(500).json({ error: 'Hubo un error al consultar si las fechas registradas son hábiles' });
        }
    };

}

module.exports = new Permisos_AdmController().router;