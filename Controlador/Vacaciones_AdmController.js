const express = require('express');

const accesos = require('../Modelo/VacacionesModel');

class Vacaciones_AdmController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarVacacionesAdm);
        this.router.put('/:id_vacaciones', this.editarVacacionesAdm);
    };


    //Consultar los permisos pendientes de jefatura
    consultarVacacionesAdm(req, res) {
        accesos.consultarVacacionesAdm((error, resultado) => {
            if (error) {
                console.log('Hubo un error');
                //throw error;
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
            accesos.editarVacacionesAdm(decision_RRHH, msj_RRHH, id_vacaciones, (err, resultado) => {
                
                if (err) {
                    console.log('Hubo un error', err);
                    //throw err;
                    return res.status(500).json({ error: 'Error al editar las vacaciones en la base de datos' });
                } else {
                    console.log(resultado);
                    return res.json({message: 'La edición del registro #' + id_vacaciones + ', se ha realizado correctamente'});
                }
            });
        } catch (error) {
            console.error('Error durante el proceso:', error);
        return res.status(500).json({ error: 'Error durante el proceso' });
        }
    };

}

module.exports = new Vacaciones_AdmController().router;