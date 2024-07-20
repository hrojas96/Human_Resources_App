const express = require('express');

const accesos = require('../Modelo/AguinaldosModel');

class AguinaldosController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarAguinaldo);
        this.router.get('/:id_aguinaldo', this.consultarDesgloseAguinaldo);
        this.router.post('/', this.calcularAguinaldo);
        this.router.post('/:tipoReporte', this.generarReportes);
        this.router.delete('/', this.eliminarAguinaldo);
    };

    //Consultar salarios
    consultarAguinaldo(req, res)  {
        accesos.consultarAguinaldo((error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw error;
            } else {
                //console.log(filas[0]);
                res.send(filas);
                
            };
        });
    };

    //Consulta el desglose de un aguinaldo específico
    async consultarDesgloseAguinaldo(req, res) {
        console.log("llego1");
        let id_aguinaldo = req.params.id_aguinaldo;
        const fechas = await accesos.consultarFechas(id_aguinaldo);

        if (fechas.length > 0) {
            let fecha_desde = fechas[0].fecha_desde;
            let fecha_hasta = fechas[0].fecha_hasta;
            let id_empleado = fechas[0].id_empleado;

            try {
                accesos.consultarDesgloseAguinaldo(id_empleado, fecha_desde, fecha_hasta, (err, filas) => {
                    if (err) {
                        console.log('Hubo un error', err);
                        //throw err;
                    } else {
                        console.log(filas)
                        res.send(filas);
                    };
                });
            } catch (error) {
                
                console.error("Error de servidor", error);
                
            }
        }
            
    };

    //CalcularSalarios
    async   calcularAguinaldo(req, res) {
        let id_empleado = req.body.id_empleado;
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;
        let calculo = req.body.calculo;
        let filas;
        console.log(id_empleado, fecha_desde, fecha_hasta, calculo)
        try {
            if(calculo == 2){
                filas = await accesos.consultarDatosAguinaldoGeneral(fecha_desde, fecha_hasta);
                console.log( filas);
            }else if(calculo == 1){
                filas = await accesos.consultarDatosAguinaldoIndividual(id_empleado, fecha_desde, fecha_hasta);
                console.log(filas);
            }
            
            //Revisa si se encontró datos en el parámetro de fechas dado
            if (filas.length > 0) {
                console.log('largo: ',filas.length);
                console.log('Filas: ', filas);
                
                let data = filas.map((i) => ({
                    
                        id_empleado : i.id_empleado,
                        fecha_desde,
                        fecha_hasta,
                        monto_pagado :i.total_salarios_recibidos / 12
                    //});
                }));
                
                try{
                    await new Promise((resolve, reject) => {
                        console.log('DAta: ', data)
                        accesos.insertarAguinaldo(data, (err, resultado) => {
                            
                            if (err) {
                                //console.log('Hubo un error', err);
                                //throw err;
                                reject('Hubo un error', err);
                                return res.status(500).json({ error: 'Error al registrar los aguinaldos en la base de datos' });
                            } else {
                                resolve('Proceso realizado', resultado);
                                return res.status(200).json({ message: 'El aguinaldo se ha calculado y registrado correctamente'});
                            }
                        });
                    });
                } catch (error) {
                    console.error('Error durante el proceso:', error);
                    return res.status(500).json({ error: 'Hubo un error al registrar el aguinaldo' });
                }   
            } else {
                return res.status(500).json({ error: 'No existen salarios registrados en las fechas indicadas para el calculo del aguinaldo' });
            }
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Hubo un error al consultar si las fechas registradas son hábiles' });
        }
    };                             
    
    eliminarAguinaldo(req,res) {
        console.log('llego a eliminar');
        let id_empleado = req.body.id_empleado;
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;
        let calculo = req.body.calculo;
        if(calculo == 2){
            try {
                accesos.eliminarAguinaldoGeneral(fecha_desde, fecha_hasta,  (err, filas) => {
                    if (err) {
                        console.log('Hubo un error', err);
                        //throw err;
                        return res.status(500).json({ error: 'Error al eliminar el registro' });
                    } else {
                        if (filas.affectedRows === 0) {
                            console.log('No se encontraron aguinaldos con los criterios especificados');
                            return res.status(404).json({ message: 'No se encontraron aguinaldos con los criterios especificados' });
                        } else {
                            console.log(filas);
                            return res.status(200).json({message: `La eliminación de los aguinaldo entre la fechas  ${fecha_desde}  y  ${fecha_hasta} se ha realizado correctamente`});
                        }
                    }
                });
            } catch (error) {
                console.error("Error de servidor", error);
                return res.status(500).json({ error: "Error de servidor" });
                
            };
        } else if(calculo == 1){
            try {
                accesos.eliminarAguinaldoIndividual(id_empleado, fecha_desde, fecha_hasta,  (err, filas) => {
                    if (err) {
                        console.log('Hubo un error', err);
                        //throw err;
                        return res.status(500).json({ error: 'Error al eliminar el registro' });
                    } else {
                        if (filas.affectedRows === 0) {
                            console.log('No se encontraron aguinaldos con los criterios especificados');
                            return res.status(404).json({ message: 'No se encontraron aguinaldos con los criterios especificados' });
                        } else {
                            console.log(filas);
                            return res.status(200).json({message: `La eliminación de los aguinaldo entre la fechas  ${fecha_desde}  y  ${fecha_hasta} se ha realizado correctamente`});
                        }
                    }
                });
            } catch (error) {
                console.error("Error de servidor", error);
                return res.status(500).json({ error: "Error de servidor" });    
            };
        } 
    };

    generarReportes(req, res) {      
        console.log('llegooooos')
        let tipoReporte = req.params.tipoReporte;
        let id_empleado = req.body.id_empleado;
        let fechaInicioRpt = req.body.fechaInicioRpt;
        let fechaFinalRpt = req.body.fechaFinalRpt;
        let minimo = req.body.minimo;
        let maximo = req.body.maximo;
        let repoteMonetario = req.body.repoteMonetario;

        accesos.generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, minimo,maximo,repoteMonetario, tipoReporte, (err, filas) => {
            if (err) {
                return res.status(500).json({ error: "Error de servidor" });
                //throw err;
            } else {
                if (filas.length == 0){
                    res.status(500).json({ error: 'No existen datos en los parámetros seleccionados' });
                }else{
                    console.log(filas)
                    res.send(filas);
                }
                
            };
        });
    };
    

};

module.exports = new AguinaldosController().router;

/*
calcularAguinaldo(req, res) {
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;

        try {
            accesos.consultarDatosAguinaldo(fecha_desde, fecha_hasta, async (err, filas) => {
                
                if (err) {
                    console.log('Hubo un error');
                    return res.status(500).json({ error: 'Hubo un error al consultar datos de la planilla' });
                    
                } else {
                    //Revisa si se encontró datos en el parámetro de fechas dado
                    if (filas.length > 0) {
                        console.log('largo: ',filas.length);
                        console.log('Filas: ', filas);
                        
                        let data = filas.map((i) => ({
                            
                                id_empleado : i.id_empleado,
                                fecha_desde,
                                fecha_hasta,
                                monto_pagado :i.total_salarios_recibidos / 12
                            //});
                        }));
                        
                        try{
                            await new Promise((resolve, reject) => {
                                console.log('DAta: ', data)
                                accesos.insertarAguinaldo(data, (err, resultado) => {
                                    
                                    if (err) {
                                        //console.log('Hubo un error', err);
                                        //throw err;
                                        reject('Hubo un error', err);
                                        return res.status(500).json({ error: 'Error al registrar los aguinaldos en la base de datos' });
                                    } else {
                                        resolve('Proceso realizado', resultado);
                                        return res.status(200).json({ message: 'El aguinaldo se ha calculado y registrado correctamente'});
                                    }
                                });
                            });
                        } catch (error) {
                            console.error('Error durante el proceso:', error);
                            return res.status(500).json({ error: 'Hubo un error al registrar el aguinaldo' });
                        }   
                    } else {
                        return res.status(500).json({ error: 'No existen salarios registrados en las fechas indicadas para el calculo del aguinaldo' });
                    }
                };
            });
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Hubo un error al consultar si las fechas registradas son hábiles' });
        }
    };   

*/