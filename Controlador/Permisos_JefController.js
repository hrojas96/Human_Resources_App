const express = require('express');

const accesos = require('../Modelo/PermisosModel');

class Permisos_JefController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:id_jefatura', this.consultarPermisoJef);
        this.router.put('/:id_permiso', this.editarPermJefatura);
    };


    //Consultar los permisos pendientes de jefatura
    consultarPermisoJef(req, res) {
        let id_jefatura = req.params.id_jefatura;
        accesos.consultarPermisoJef(id_jefatura, (error, resultado) => {
            if (error) {
                console.log('Hubo un error');
                //throw error;
            } else {
                res.send(resultado);
            };
        });
    };

    //Editar desición de la jefatura
    editarPermJefatura(req, res) {
        let id_permiso = req.params.id_permiso;
        let decision_jefatura = req.body.decision_jefatura;
        let msj_jefatura = req.body.msj_jefatura;

        try {
            accesos.editarPermJefatura(decision_jefatura, msj_jefatura, id_permiso, (err, resultado) => {
                
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
        return res.status(500).json({ error: 'Error durante el proceso' });
        }
    };

}

module.exports = new Permisos_JefController().router;