const express = require('express');

const accesos = require('../Modelo/RolesModel');

class RolesController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarRoles);
        this.router.post('/', this.insertarRol);
        this.router.put('/:id_rol', this.editarRol);
        this.router.delete('/:id_rol', this.eliminarRol);
    };

    //Consulta registro de roles
    consultarRoles(req, res) {
        
        accesos.consultarRoles((error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
    };

    //Insertar roles
    insertarRol(req, res) {
        let data = [{
            nombre_rol:req.body.nombre_rol,
            acc_mantenimeintos:req.body.acc_mantenimeintos,
            acc_planilla:req.body.acc_planilla,   
            acc_horasExtras_RRHH:req.body.acc_horasExtras_RRHH,   
            acc_prestamos:req.body.acc_prestamos,   
            acc_permisos_RRHH:req.body.acc_permisos_RRHH,
            acc_vacaciones_RRHH:req.body.acc_vacaciones_RRHH,
            acc_incapacidades:req.body.acc_incapacidades,
            acc_aguinaldo:req.body.acc_aguinaldo,
            acc_liquidacion:req.body.acc_liquidacion,
            acc_horasExtras_jefatura:req.body.acc_horasExtras_jefatura,
            acc_vacaciones_jefatura:req.body.acc_vacaciones_jefatura,
            acc_permisos_jefatura:req.body.acc_permisos_jefatura,
            acc_marcas:req.body.acc_marcas
        }];
        console.log ('Planilla',data.acc_planilla)
    try {
        accesos.insertarRol(data, (err, fila) => {
            
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ error: "Datos duplicados" });
                } else {
                    console.log('Hubo un error');
                    throw err;
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

    //Editar registro de roles
    editarRol(req, res) {
        let id_rol = req.params.id_rol;
        let nombre_rol = req.body.nombre_rol;
        let acc_mantenimeintos = req.body.acc_mantenimeintos;
        let acc_planilla = req.body.acc_planilla;
        let acc_horasExtras_RRHH = req.body.acc_horasExtras_RRHH;
        let acc_prestamos = req.body.acc_prestamos;
        let acc_permisos_RRHH = req.body.acc_permisos_RRHH;
        let acc_vacaciones_RRHH = req.body.acc_vacaciones_RRHH;
        let acc_incapacidades = req.body.acc_incapacidades;
        let acc_aguinaldo = req.body.acc_aguinaldo;
        let acc_liquidacion = req.body.acc_liquidacion;
        let acc_horasExtras_jefatura = req.body.acc_horasExtras_jefatura;
        let acc_vacaciones_jefatura = req.body.acc_vacaciones_jefatura;
        let acc_permisos_jefatura = req.body.acc_permisos_jefatura;
        let acc_marcas = req.body.acc_marcas;

        try {
            accesos.editarRol(nombre_rol, acc_mantenimeintos, acc_planilla, acc_horasExtras_RRHH, acc_prestamos, acc_permisos_RRHH,
                            acc_vacaciones_RRHH, acc_incapacidades, acc_aguinaldo, acc_liquidacion, acc_horasExtras_jefatura, 
                            acc_vacaciones_jefatura, acc_permisos_jefatura, acc_marcas, id_rol, (err, fila) => {
                
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error')
                        throw err;
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
     //Elimina registro de roles
    eliminarRol(req,res){
        let id_rol = req.params.id_rol;
        accesos.eliminarRol(id_rol, (error, filas) => {
            if (error) {
                console.log('Hubo un error');
                throw err;
            } else {
                res.send(filas);
            };
        });
        
    };

}

module.exports = new RolesController().router;