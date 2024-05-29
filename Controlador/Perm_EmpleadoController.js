const express = require('express');

const accesos = require('../Modelo/PermisosModel');

class Perm_EmpleadoController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:empleado', this.consultarPermEmp);
        this.router.post('/', this.insertarPermEmp);
        this.router.put('/:id_permiso', this.editarPermEmp);
        this.router.delete('/:id_permiso', this.eliminarPermEmp);
    };

    //Consultar los permisos de un único empleado
    consultarPermEmp(req, res) {
        let id_empleado = req.params.empleado;
        accesos.consultarPermEmp(id_empleado,(error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
    };

    //Insertar puestos
    insertarPermEmp(req, res) {
        
        let data = [{
        id_empleado:req.body.id_empleado,
        inicio_permiso:req.body.inicio_permiso,
        final_permiso:req.body.final_permiso,
        msj_empleado:req.body.msj_empleado,
        decision_jefatura:req.body.decision_jefatura,
        decision_RRHH:req.body.decision_RRHH,
        derecho_pago:req.body.derecho_pago     
        }];
    try {
        accesos.insertarPermEmp(data, (err, fila) => {
            
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ error: "Datos duplicados" });
                } else {
                    console.log('Hubo un error');
                    //throw err;
                };
            } else {
                //console.log('Datos insertados')
                // Enviamos respuesta de BD
                res.send(fila);
            }
        });
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
        };
    };

    //Editar registro de permisos de un único empleado
    editarPermEmp(req, res) {
        let id_permiso = req.params.id_permiso;
        let inicio_permiso = req.body.inicio_permiso;
        let final_permiso = req.body.final_permiso;
        let msj_empleado = req.body.msj_empleado;

        try {
            accesos.editarPermEmp(inicio_permiso, final_permiso, msj_empleado, id_permiso, (err, fila) => {
                
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error')
                        //throw err;
                    };
                } else {
                    //console.log('Datos insertados')
                    // Enviamos respuesta de BD
                    res.send(fila);
                };
            });
            } catch (error) {
                console.error("Error during database insertion:", error);
                res.status(500).json({ error: "Error de servidor" });
        };
    };


    eliminarPermEmp(req,res) {
        let id_permiso = req.params.id_permiso;
        accesos.eliminarPermEmp(id_permiso, (error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
        
    };

}

module.exports = new Perm_EmpleadoController().router;