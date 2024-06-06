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
            accesos.editarPermisoAdm(decision_RRHH, msj_RRHH, derecho_pago, id_permiso, (err, fila) => {
                
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error')
                        throw err;
                    };
                } else {
                    console.log('Datos insertados')
                    // Enviamos respuesta de BD
                    res.send(fila);
                };
            });
            } catch (error) {
                console.error("Error during database insertion:", error);
                res.status(500).json({ error: "Error de servidor" });
        };
    };

}

module.exports = new Permisos_AdmController().router;