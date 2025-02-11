const express = require('express');

const accesos = require('../Modelo/MarcasModel');

class Marcas_AdmController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarMarcasAdm);
        this.router.post('/', this.insertarMarcaAdm);
        this.router.put('/:id_marca', this.editarMarcaAdm);
        this.router.delete('/:id_marca', this.eliminarMarcaAdm);
        this.router.post('/:tipoReporte', this.generarReportes);
    };

    //Consulta todas las marcas de todos los empleados (Adm)
    consultarMarcasAdm(req, res) {
        
        accesos.consultarMarcasAdm((error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                res.send(filas);
            };
        });
    };

    //Insertar marcas
    insertarMarcaAdm(req, res){
        
        let data = [{
            id_empleado:req.body.id_empleado,
            fecha:req.body.fecha,
            hora_entrada:req.body.hora_entrada,
            hora_salida:req.body.hora_salida,
            horas_ordinarias:req.body.horas_ordinarias
        }];
        let horas_extras = req.body.horas_extras;
        
        try {
            accesos.insertarMarcaAdm(data, (error, respuesta) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "La marca que ingresó ya existe." });
                    } else {
                        console.log('Hubo un error', error);
                    };
                } else {
                    console.log(respuesta);
                    //if(horas_extras > 0){ 
                        let id_marca = respuesta.insertId;
                        let estado = 'Pendiente';
                        let decision_jefatura = 'Pendiente';
                        let decision_RRHH = 'Pendiente';
                        try {
                            let dataHE = [{
                                id_marca,
                                horas_extras,
                                estado,
                                decision_jefatura,
                                decision_RRHH
                            }];
                            console.log(dataHE)
                            //Hace el resgistro de las extras
                            accesos.insertarHoraExtra(dataHE, (error, fila) => {
                                
                                if (error) {
                                    if (error.code === 'ER_DUP_ENTRY') {
                                        res.status(400).json({ error: "Datos duplicados" });
                                    } else {
                                        console.log('Hubo un error', error)
                                    };
                                } else {
                                    console.log('Horas extras registradas')
                                    // Enviamos respuesta de BD
                                    //res.send(fila);
                                };
                            });
                            } catch (error) {
                                console.error("Error during database insertion:", error);
                                res.status(500).json({ error: "Error de servidor" });
                        };
                    //}

                    // Enviamos respuesta de BD
                    res.json({message:'El registro de la marca se ha realizado correctamente'});
                }
            });
        } catch (error) {
            console.error("Ha ocurrido un error en el servidor", error);
            res.status(500).json({ error: "Ha ocurrido un error en el servidor" });
        };
    };

    //Insertar marcas
    editarMarcaAdm(req, res){
        let id_marca = req.params.id_marca;
        let id_empleado = req.body.id_empleado;
        let fecha = req.body.fecha;
        let hora_entrada = req.body.hora_entrada;
        let hora_salida = req.body.hora_salida;
        let horas_ordinarias = req.body.horas_ordinarias;
        let horas_extras = req.body.horas_extras;
        
        try {
            accesos.editarMarcaAdm(id_empleado, fecha, hora_entrada, hora_salida, horas_ordinarias, id_marca,  (error, respuesta) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "La marca que ingresó ya existe." });
                    } else {
                        console.log('Hubo un error', error);
                    };
                } else {
                    console.log(respuesta);
                    console.log('horas: ' , horas_extras)
                    if(horas_extras > 0){ 
                     
                        try {
                            //Hace el resgistro de las extras
                            accesos.editarHoraExtraAdm(horas_extras, id_marca, (error, fila) => {
                                
                                if (error) {
                                    console.log('Hubo un error', error)
                                    res.status(400).json({ error: "La marca se ha editado correctamente, sin embargo, ha ocurrido un error con la edición de horas extras" });
                                
                                } else {
                                    //console.log(fila)
                                    // Envia respuesta de BD
                                    res.json({message:'El edición de la marca se ha realizado correctamente'});
                                };
                            });
                            } catch (error) {
                                console.error("Error during database insertion:", error);
                                res.status(500).json({ error: "Error de servidor" });
                        };
                    }else{
                        // Envia respuesta de BD
                        res.json({message:'El edición de la marca se ha realizado correctamente'});
                    }
                }
            });
        } catch (error) {
            console.error("Ha ocurrido un error en el servidor", error);
            res.status(500).json({ error: "Ha ocurrido un error en el servidor" });
        };
    };

    eliminarMarcaAdm(req,res) {
        let id_marca = req.params.id_marca;
        accesos.eliminarHoraExtraAdm(id_marca,  (error, filas) => {
            if (error) {
                console.log('Hubo un error', error );
                res.status(500).json({ error: 'Hubo un error al eliminar la marca.' });
                
            } else {
                //console.log('Marca eliminada correctamente', filas);
                res.status(200).json({ message: 'Marca eliminada correctamente' });
            };
        });    
    };

    generarReportes(req, res) {  
        let tipoReporte = req.params.tipoReporte;
        let id_empleado = req.body.id_empleado;
        let fechaInicioRpt = req.body.fechaInicioRpt;
        let fechaFinalRpt = req.body.fechaFinalRpt;

        accesos.generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, tipoReporte, (error, filas) => {
            if (error) {
                console.log('Hubo un error', error );
                res.status(500).json({ error: "Error de servidor" });
            } else {
                if (filas.length == 0){
                    res.status(500).json({ error: 'No existen datos en los parámetros seleccionados' });
                }else{
                    //console.log(filas)
                    res.send(filas);
                }
                
            };
        });
    };

    
};



module.exports = new Marcas_AdmController().router;