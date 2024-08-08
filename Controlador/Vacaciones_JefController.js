const express = require('express');

const accesos = require('../Modelo/VacacionesModel');

class Vacaciones_JefController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:id_jefatura', this.consultarVacacionesJef);
        this.router.put('/:id_vacaciones', this.editarVacacionesJef);
    };


    //Consultar los permisos pendientes de jefatura
    consultarVacacionesJef(req, res) {
        let id_jefatura = req.params.id_jefatura;
        accesos.consultarVacacionesJef(id_jefatura, (error, resultado) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                res.send(resultado);
            };
        });
    };

    //Editar desición de la jefatura
    editarVacacionesJef(req, res) {
        let id_vacaciones = req.params.id_vacaciones;
        let decision_jefatura = req.body.decision_jefatura;
        let msj_jefatura = req.body.msj_jefatura;

        try {
            accesos.editarVacacionesJef(decision_jefatura, msj_jefatura, id_vacaciones, (error, resultado) => {
                
                if (error) {
                    console.log('Hubo un error', error);
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

module.exports = new Vacaciones_JefController().router;