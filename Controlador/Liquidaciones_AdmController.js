const express = require('express');

const accesos = require('../Modelo/LiquidacinesModel');
class LiquidacionesController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarLiquidaciones);
        this.router.post('/', this.calcularLiquidacion);
        this.router.post('/:tipoReporte', this.generarReportes);
        this.router.delete('/:id_liquidacion', this.eliminarLiquidacion);
    };

    //Consultar salarios
    consultarLiquidaciones(req, res)  {
        accesos.consultarLiquidaciones((error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                //console.log(filas[0]);
                res.send(filas);
                
            };
        });
    };

    //CalcularSalarios
    calcularLiquidacion(req, res) {
        let id_empleado = req.body.id_empleado;
        let fecha = req.body.fecha;
        let preaviso = req.body.preaviso;
        let motivo = req.body.motivo;

        let fechaYYYY = fecha;
        let fechaMM = fecha
        let finalContrato = new Date(fecha);
        let ultimoYYYY = (finalContrato.getFullYear()) - 1;
        let ultimo_aguinaldo = `${ultimoYYYY}-12-01`
        console.log(ultimoYYYY, ultimo_aguinaldo);

        try {
            accesos.consultarDatosLiquidacion(fechaYYYY, fechaMM, fecha, ultimo_aguinaldo, id_empleado,  async (error, filas) => {
                
                if (error) {
                    console.log('Hubo un error', error );
                    return res.status(500).json({ error: 'Hubo un error al consultar datos del empleado' });
                    
                } else {
                    //Revisa si se encontró datos del empleado
                    if (filas.length > 0) {
                        console.log(filas);
                        let salarioDiario = (filas[0].salario_promedio / 6)/26;
                        let a_os = filas[0].años;
                        let meses = filas[0].meses;

                        let pago_preaviso;
                        let cesantia;

                        console.log (salarioDiario, a_os, meses);

                        //Calcula el monto a pagar por preaviso, si aplica
                        if (preaviso == "Trabajado"){
                            pago_preaviso = 0;
                        } else {
                            if (meses <= 3){
                                pago_preaviso = 0;
                            };
                            if (meses > 3 && meses <= 6){
                                pago_preaviso = salarioDiario * 7;
                            };
                            if (meses > 6 && a_os < 1){
                                pago_preaviso = salarioDiario * 15;
                            };
                            if ( a_os >= 1){
                                pago_preaviso = salarioDiario * 30;
                            };
                        }

                        //Calcula el monto a pagar por cesantía, si aplica
                        if (motivo == "Despido2" || motivo == "Renuncia"){
                            cesantia = 0;
                        } else {
                            if (meses <= 3){
                                cesantia = 0;
                            };
                            if (meses > 3 && meses <= 6){
                                cesantia = salarioDiario * 7;
                            };
                            if (meses > 6 && a_os < 1){
                                cesantia = salarioDiario * 14;
                            };
                            if ( a_os >= 1 && meses < 12){
                                cesantia = salarioDiario * 19.5;
                            };
                            if ( a_os >= 2 && meses < 12){
                                cesantia = salarioDiario * 20;
                            };
                            if ( a_os >= 3 && meses < 12){
                                cesantia = salarioDiario * 20.5;
                            };
                            if ( a_os >= 4 && meses < 12){
                                cesantia = salarioDiario * 21;
                            };
                            if ( a_os >= 5 && meses < 12){
                                cesantia = salarioDiario * 21.24;
                            };
                            if ( a_os >= 6 && meses < 12){
                                cesantia = salarioDiario * 21.5;
                            };
                            if ( a_os >= 7 && meses < 12){
                                cesantia = salarioDiario * 22;
                            };
                            if ( a_os >= 8 && meses < 12){
                                cesantia = salarioDiario * 22;
                            };
                            if ( a_os >= 9 && meses < 12){
                                cesantia = salarioDiario * 22;
                            };
                            if ( a_os >= 10 && meses < 12){
                                cesantia = salarioDiario * 21.5;
                            };
                            if ( a_os >= 11 && meses < 12){
                                cesantia = salarioDiario * 21;
                            };
                            if ( a_os >= 12 && meses < 12){
                                cesantia = salarioDiario * 20.5;
                            };
                            if ( a_os >= 13 ){
                                cesantia = salarioDiario * 20;
                            };
                            
                        }
                        //Calculo de vacaciones de pago pendientes

                        let fechaIngreso = new Date (filas[0].fecha_ingreso);
                        //Obtengo un resultado en milisegndos
                        let diferencia = (finalContrato.getTime() - fechaIngreso.getTime()) /1000;
                        //Se pasa a días
                        diferencia /= (60 * 60 * 24);
                        //Se pasa a meses
                        diferencia /= 30.5;
                        //Saca los días de vacaciones disponibles
                        let total_vacaciones = diferencia * 1.25;
                        //Calcula la candidad de días no disfrutados
                        let vacaciones_disponibles = total_vacaciones - filas[0].vacaciones_disfrutadas;

                        let pago_vacaciones;
                        if (vacaciones_disponibles == 0){
                            pago_vacaciones = 0;
                        } else{
                            pago_vacaciones = vacaciones_disponibles * salarioDiario;
                        };
                        let pago_aguinaldo;
                        if (filas[0].salario_total == 0){
                            pago_aguinaldo = 0;
                        } else{
                            pago_aguinaldo = filas[0].salario_total /12 ;
                        };

                        let monto_liquidado = pago_vacaciones + pago_aguinaldo + pago_preaviso + cesantia;
                      
                            let data = [{
                                id_empleado,
                                fecha,
                                pago_vacaciones,
                                pago_aguinaldo,
                                pago_preaviso,
                                cesantia,
                                monto_liquidado
                            }];
                        try {
                            new Promise((resolve, reject) => {
                                accesos.insertaLiquidacion(data, (error, filas) => {
                                    
                                    if (error) {
                                        if (err.code === 'ER_DUP_ENTRY') {
                                            return res.status(400).json({ error: "Datos duplicados. La liquidación de este empleado ha sido ya calculada previamente" });
                                        } else {
                                            console.log('Hubo un error', error);
                                            reject(error);
                                            return res.status(400).json({ error: "Hubo un error al calcular la liquidación de empleado" });
                                            
                                        };
                                    } else {
                                        // Enviamos respuesta de BD
                                        console.log('Liquidacion generada correctamente', filas);
                                        resolve(filas);  
                                        return res.status(200).json({ message: 'Liquidación generada correctamente' });   
                                    };
                                });
                            });
                        } catch (error) {
                            console.error("Error during database insertion:", error);
                            return res.status(500).json({ error: "Error de servidor" });
                        }
                    } else {
                        console.log('No existen datos.');
                        return res.status(400).json({ error: 'No existen datos registrados con la información dada para el cálculo de la liquidación.' });
                    }
                }
            });
        } catch (error) {
            console.error("Error de servidor:", error);
            return res.status(500).json({ error: "Error de servidor" });
        }; 
    }; 
    
    eliminarLiquidacion(req,res) {
        let id_liquidacion = req.params.id_liquidacion;
        console.log('llego 1' );
        accesos.eliminarLiquidacion(id_liquidacion,  (error, filas) => {
            if (error) {
                console.log('Hubo un error', error );
                return res.status(500).json({ error: 'Hubo un error al eliminar la liquidación' });
                
            } else {
                console.log('Liquidación eliminada correctamente', filas);
                return res.status(200).json({ message: 'Liquidació eliminada correctamente' });
            };
        });
        
    };

    generarReportes(req, res) {      
        console.log('llegooooos')
        let tipoReporte = req.params.tipoReporte;
        let id_empleado = req.body.id_empleado;
        let fechaInicioRpt = req.body.fechaInicioRpt;
        let fechaFinalRpt = req.body.fechaFinalRpt;

        accesos.generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, tipoReporte, (error, filas) => {
            if (error) {
                console.log('Hubo un error', error );
                return res.status(500).json({ error: "Error de servidor" });
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

module.exports = new LiquidacionesController().router;