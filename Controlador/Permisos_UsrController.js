const express = require('express');

const accesos = require('../Modelo/PermisosModel');
const diasHabiles = require('./DiasHabilesController');

class Permisos_UsrController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
        //this.diasHab = new DiasHabilesController();
    }

    inicializarRutas() {
        this.router.get('/:empleado', this.consultarPermisosUsr);
        this.router.post('/', this.insertarPermisosUsr);
        this.router.put('/:id_permiso', this.editarPermisosUsr);
        this.router.delete('/:id_permiso', this.eliminarPermisosUsr);
    };

    //Consultar los permisos de un único empleado
    consultarPermisosUsr(req, res) {
        let id_empleado = req.params.empleado;
        accesos.consultarPermisosUsr(id_empleado,(err, resultado) => {
            if (err) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(resultado);
            };
        });
    };

    async insertarPermisosUsr(req, res) {
        let fechaInicial = new Date (req.body.inicio_permiso);
        let fechaFinal = new Date (req.body.final_permiso);
        
        try{
            const filas = await diasHabiles.prosesarDiasHabiles(fechaInicial, fechaFinal)
                
            if (filas.length <= 0){
                return res.status(400).json({ error: 'Seleccione días viables para la solicitud de su permiso.' });
            } else{
                console.log ('Hola dias: ', filas.length);
                
                const cant_dias_solicitados = filas.length;
                let data = [{
                    id_empleado:req.body.id_empleado,
                    inicio_permiso:req.body.inicio_permiso,
                    final_permiso:req.body.final_permiso,
                    cant_dias_solicitados,
                    msj_empleado:req.body.msj_empleado,
                    decision_jefatura:req.body.decision_jefatura,
                    decision_RRHH:req.body.decision_RRHH,
                    derecho_pago:req.body.derecho_pago
                }];
                
                accesos.insertarPermisosUsr(data, (err, resultado) => {
                    
                    if (err) {
                            console.log('Hubo un error', err);
                            //throw err;
                            return res.status(500).json({ error: 'Error al insertar los permisos en la base de datos' });
                    } else {
                        console.log(resultado);
                        return res.json({message:'La solicitud de su permiso se ha realizado correctamente'});
                    }
                });
            }
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Hubo un error al consultar si las fechas registradas son hábiles' });
        }

    };
    

    //Editar registro de permisos de un único empleado
    async editarPermisosUsr(req, res) {
        let fechaInicial = new Date (req.body.inicio_permiso);
        let fechaFinal = new Date (req.body.final_permiso);
        
        try{
            const filas = await diasHabiles.prosesarDiasHabiles(fechaInicial, fechaFinal)
                
            if (filas.length <= 0){
                return res.status(400).json({ error: 'Seleccione días viables para la solicitud de su permiso.' });
            } else{
                console.log ('Hola dias: ', filas.length);
                
                const cant_dias_solicitados = filas.length;

                let id_permiso = req.params.id_permiso;
                let inicio_permiso = req.body.inicio_permiso;
                let final_permiso = req.body.final_permiso;
                let msj_empleado = req.body.msj_empleado;
                let decision_jefatura = req.body.decision_jefatura;
                let decision_RRHH = req.body.decision_RRHH;
                let derecho_pago = req.body.derecho_pago;
                
                accesos.editarPermisosUsr(inicio_permiso, final_permiso, cant_dias_solicitados, msj_empleado, decision_jefatura, decision_RRHH, derecho_pago,  id_permiso, (err, resultado) => {
                    
                    if (err) {
                            console.log('Hubo un error', err);
                            //throw err;
                            return res.status(500).json({ error: 'Error al editar el permiso en la base de datos' });
                    } else {
                        console.log(resultado);
                        return res.json({message: 'La edición del permiso #' + id_permiso + ', se ha realizado correctamente'});
                    }
                });
            }
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Hubo un error al consultar si las fechas registradas son hábiles' });
        }
    };


    



    eliminarPermisosUsr(req,res) {
        let id_permiso = req.params.id_permiso;
        accesos.eliminarPermisosUsr(id_permiso, (err, resultado) => {
            if (err) {
                console.log('Hubo un error', err);
                //throw err;
                return res.status(500).json({ error: 'Error al eliminar el registro' });
            } else {
                console.log(resultado);
                return res.json({message: 'La eliminación del permiso #' + id_permiso + ', se ha realizado correctamente'});
            }
        });
        
    };

}

module.exports = new Permisos_UsrController().router;