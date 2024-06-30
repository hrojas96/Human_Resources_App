const express = require('express');

const accesos = require('../Modelo/PlanillaModel');
const accesosAbonos = require('../Modelo/Prest_AbonoModel');
const accesosRenta = require('../Modelo/RentaModel');
class PlanillaController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        
        this.router.get('/', this.consultarPlanilla);
        this.router.get('/:id_salario', this.consultarDesgloseSalario);
        this.router.post('/', this.calcularPlanilla);
        this.router.delete('/', this.eliminarPlanilla);
    };

    //Consultar salarios
    consultarPlanilla(req, res)  {
        accesos.consultarPlanilla((error, filas) => {
            if (error) {
                console.log('Hubo un error ');
                //throw error;
            } else {
                //console.log(filas[0]);
                res.send(filas);
                
            };
        });
    };


    //Consulta el desglose de un salario específico
    consultarDesgloseSalario(req, res) {
        console.log('llegooooos')
        let id_salario = req.params.id_salario;
        accesos.consultarDesgloseSalario(id_salario, (error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                console.log(filas)
                res.send(filas);
            };
        });
    };

    //CalcularSalarios
   
    async calcularPlanilla(req, res) {
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;

        try {
            let filas = await accesos.consultarDatosPlanilla(fecha_desde, fecha_hasta);
            console.log(filas)
            
            if (filas.length == 0) {
                console.log('No existen datos en el parámetro de fechas dado, para el cálculo de salarios. Revise las fechas dadas.');
                return res.status(400).json({ error: 'No existen datos en el parámetro de fechas dado, para el cálculo de salarios. Revise las fechas dadas.' });
            }

            console.log(filas);
            //let CCSS = 0.0967;
            //let BP = 0.01;
            

            //console.log(CCSS, BP)
            
            for (const i of filas) {
            //filas[0].forEach((i) => {
                let id_empleado = i.id_empleado;
                let monto_horas_ordinarias = i.pago_horas_ordinarias;
                let monto_horas_extras = i.pago_horas_extras;
                let monto_bono = i.total_bonos;
                let vacaciones = i.total_dias_solicitados * 8 * i.monto_por_hora;
                let salario_bruto = monto_horas_ordinarias + monto_horas_extras + vacaciones + monto_bono;
                
                let deduccion_ccss = salario_bruto * i.rebajo_ccss;
                let deduccion_bancopopular = salario_bruto * i.rebajo_bancoPopular;
                let monto = 0;
                let id_prestamo = i.id_prestamo;
                let saldo = i.saldo;

                if (id_prestamo) {
                    if (saldo <= i.rebajo_salarial) {
                        monto = saldo;
                        saldo = 0;
                    } else {
                        monto = i.rebajo_salarial;
                        saldo = saldo - i.rebajo_salarial;
                    }
                }

                let deduccion_prestamo = monto;
                let monto_fact = 0;
                let saldo_renta = i.saldo_renta;
                let id_rentaxc = i.id_rentaxc;

                if (id_rentaxc) {
                    if (saldo_renta <= i.rebajo_semanal) {
                        monto_fact = saldo_renta;
                        saldo_renta = 0;
                    } else {
                        monto_fact = i.rebajo_semanal;
                        saldo_renta = saldo_renta - i.rebajo_semanal;
                    }
                }

                let deduccion_renta = monto_fact;
                let monto_cancelado = salario_bruto - deduccion_ccss - deduccion_bancopopular - deduccion_renta - deduccion_prestamo;
                let data = {
                    id_empleado,
                    fecha_desde,
                    fecha_hasta,
                    monto_horas_ordinarias,
                    monto_horas_extras,
                    monto_bono,
                    salario_bruto,
                    deduccion_ccss,
                    deduccion_bancopopular,
                    id_rentaxc,
                    deduccion_renta,
                    id_prestamo,
                    deduccion_prestamo,
                    monto_cancelado
                };

                try {
                    await accesos.insertarPlanilla(data);

                    if (id_prestamo) {
                        //console.log('prestamos 2: ', id_prestamo, monto, saldo);
                        await accesosAbonos.registrarAbono(id_prestamo, monto, saldo);
                    }

                    if (id_rentaxc) {
                        let fecha_fact = new Date();
                        //console.log('renta: ', id_rentaxc, fecha_fact, monto_fact, saldo_renta);
                        await accesosRenta.registrarFactRenta(id_rentaxc, fecha_fact, monto_fact, saldo_renta);
                    }
                } catch (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        console.error("Error: Datos duplicados", error);
                        return res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.error("Error de servidor", error);
                        return res.status(500).json({ error: "Error de servidor" });
                    }
                }
            }

            return res.status(200).json({ message: 'Planilla generada correctamente' });

        } catch (error) {
            console.error("Error de servidor", error);
            return res.status(500).json({ error: "Error de servidor" });
        }
    }


    eliminarPlanilla(req,res) {
        console.log('llego a eliminar');
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;
        accesos.eliminarPlanilla(fecha_desde, fecha_hasta,  (error, filas) => {
            if (error) {
                console.log('Hubo un error', error );
                return res.status(500).json({ error: 'Hubo un error al eliminar la planilla' });
                //throw err;
            } else {
                console.log('Planilla eliminada correctamente', filas);
                return res.status(200).json({ message: 'Planilla eliminada correctamente' });
            };
        });
        
    };
    

};

module.exports = new PlanillaController().router;





/* calcularPlanilla(req, res) {
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;

        try {
            accesos.consultarDatosPlanilla(fecha_desde, fecha_hasta, async (err, filas) => {
                
                if (err) {
                    
                    console.log('Hubo un error', err);
                    return res.status(500).json({ error: 'Hubo un error al consultar datos de la planilla' });
                    
                } else {
                    //Revisa si se encontró datos en el parámetro de fechas dado
                    if (filas.length > 0) {
                        //console.log(filas);
                        
                        let CCSS = 0.0967;
                        let BP = 0.01;
                        //let data = filas[0]
                        filas[0].forEach((i) => {
                            let id_empleado = i.id_empleado;
                            let monto_horas_ordinarias = i.pago_horas_ordinarias;
                            let monto_horas_extras = i.pago_horas_extras;
                            let vacaciones = i.total_dias_solicitados * 8 * i.monto_por_hora;
                            let salario_bruto = monto_horas_ordinarias + monto_horas_extras + vacaciones;
                            let deduccion_ccss = salario_bruto * CCSS;
                            let deduccion_bancopopular = salario_bruto * BP;
                            let deduccion_renta = 0;
                            let monto = 0;
                            let id_prestamo = i.id_prestamo;
                            let saldo = i.saldo;
                            //Verifica si el empleado tiene salarios
                            if (id_prestamo){
                                
                                if (saldo <= i.rebajo_salarial){
                                    monto = saldo;
                                    saldo = 0;
                                }else{
                                    monto = i.rebajo_salarial;
                                    saldo = saldo - i.rebajo_salarial;
                                }
                                
                            };
                            let deduccion_prestamo = monto;

                            let monto_cancelado = salario_bruto - deduccion_ccss - deduccion_bancopopular - deduccion_renta - monto;
                            let data = [{
                                id_empleado,
                                fecha_desde,
                                fecha_hasta,
                                monto_horas_ordinarias,
                                monto_horas_extras,
                                salario_bruto,
                                deduccion_ccss,
                                deduccion_bancopopular,
                                deduccion_renta,
                                deduccion_prestamo,
                                monto_cancelado
                            }];
                            try {
                                new Promise((resolve, reject) => {
                                    accesos.insertarPlanilla(data, (err, filas) => {
                                        
                                        if (err) {
                                            if (err.code === 'ER_DUP_ENTRY') {
                                                return res.status(400).json({ error: "Datos duplicados" });
                                            } else {
                                                console.log('Hubo un error');
                                                return reject(err);
                                            };
                                        } else {
                                            // Enviamos respuesta de BD
                                            console.log('Planilla generada correctamente', filas);
                                            resolve(filas);

                                            if (id_prestamo){
    
                                                //Hace la afectación a prestamos
                                                console.log('prestamos 2: ', id_prestamo, monto, saldo);
                                                try {
                                                    new Promise((resolve, reject) => {
                                                        
                                                        accesosAbonos.registrarAbono(id_prestamo, monto, saldo,  (err, fila) => {
                                                            
                                                            if (err) {
                                                                console.log( 'Hubo un error al registrar el abono del préstamo');
                                                                return reject(err);
                                                            } else {
                                                                
                                                                resolve(fila);
                                                            }
                                                        });
                                                    })
                                                } catch (error) {
                                                    console.error("Error during database insertion:", error);
                                                    res.status(500).json({ error: "Error de servidor" });
                                                };
                                            };
                                                
                                            };
                                    });
                                });
                            } catch (error) {
                                console.error("Error during database insertion:", error);
                                 return res.status(500).json({ error: "Error de servidor" });
                            }

                        })
                        return res.status(200).json({ message: 'Planilla generada correctamente' });

                    } else {
                        console.log('No existen datos en el parámetro de fechas dado, para el cálculo de salarios. Revise las fechas dadas.');
                        return res.status(400).json({ error: 'No existen datos en el parámetro de fechas dado.' });
                    }
                }
            });
        } catch (error) {
            console.error("Error during database insertion:", error);
            return res.status(500).json({ error: "Error de servidor" });
        }; 
    }; */
    

    /*/CalcularSalarios
    calcularPlanilla(req, res) {
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;

        try {
            accesos.consultarDatosPlanilla (fecha_desde, fecha_hasta, async (err, filas) => {
                
                if (err) {
                    
                    console.log('Hubo un error', err);
                    return res.status(500).json({ error: 'Hubo un error al consultar datos de la planilla' });
                    
                } else {
                    //Revisa si se encontró datos en el parámetro de fechas dado
                    if (filas.length > 0) {
                        console.log(filas);
                        
                        let CCSS = 0.0967;
                        let BP = 0.01;
                        //let data = filas[0]
                        filas[0].forEach((i) => {
                            let id_empleado = i.id_empleado;
                            let monto_horas_ordinarias = i.pago_horas_ordinarias;
                            let monto_horas_extras = i.pago_horas_extras;
                            let vacaciones = i.total_dias_solicitados * 8 * i.monto_por_hora;
                            let salario_bruto = monto_horas_ordinarias + monto_horas_extras + vacaciones;
                            let deduccion_ccss = salario_bruto * CCSS;
                            let deduccion_bancopopular = salario_bruto * BP;
                            let monto = 0;
                            let id_prestamo = i.id_prestamo;
                            let saldo = i.saldo;
                            //Verifica si el empleado tiene salarios
                            if (id_prestamo){
                                
                                if (saldo <= i.rebajo_salarial){
                                    monto = saldo;
                                    saldo = 0;
                                }else{
                                    monto = i.rebajo_salarial;
                                    saldo = saldo - i.rebajo_salarial;
                                }
                                
                            };
                            let deduccion_prestamo = monto;
                            let monto_fact = 0;
                            let saldo_renta = i.saldo_renta;
                            let id_rentaxc = i.id_rentaxc;

                            if (id_rentaxc){
                                
                                if (saldo_renta <= i.rebajo_semanal){
                                    monto_fact = saldo_renta;
                                    saldo_renta = 0;
                                }else{
                                    monto_fact = i.rebajo_semanal;
                                    saldo_renta = saldo_renta - i.rebajo_semanal;
                                }
                                
                            };
                            let deduccion_renta = monto_fact;
                            

                            let monto_cancelado = salario_bruto - deduccion_ccss - deduccion_bancopopular - deduccion_renta - deduccion_prestamo;
                            let data = [{
                                id_empleado,
                                fecha_desde,
                                fecha_hasta,
                                monto_horas_ordinarias,
                                monto_horas_extras,
                                salario_bruto,
                                deduccion_ccss,
                                deduccion_bancopopular,
                                //id_rentaxc,
                                deduccion_renta,
                                //id_prestamo,
                                deduccion_prestamo,
                                monto_cancelado
                            }];
                            try {
                                 new Promise((resolve, reject) => {
                                    accesos.insertarPlanilla(data, (err, filas) => {
                                        
                                        if (err) {
                                            if (err.code === 'ER_DUP_ENTRY') {
                                                return res.status(400).json({ error: "Datos duplicados" });
                                            } else {
                                                console.log('Hubo un error');
                                                return reject(err);
                                            };
                                        } else {
                                            // Enviamos respuesta de BD
                                            console.log('Planilla generada correctamente', filas);
                                            resolve(filas);

                                            if (id_prestamo){
    
                                                //Hace la afectación a prestamos
                                                console.log('prestamos 2: ', id_prestamo, monto, saldo);
                                                try {
                                                    new Promise((resolve, reject) => {
                                                        
                                                        accesosAbonos.registrarAbono(id_prestamo, monto, saldo,  (err, filaAbono) => {
                                                            
                                                            if (err) {
                                                                console.log( 'Hubo un error al registrar el abono del préstamo');
                                                                return reject(err);
                                                            } else {
                                                                
                                                                resolve(filaAbono);
                                                            }
                                                        });
                                                    })
                                                } catch (error) {
                                                    console.error("Error de servidor: ", error);
                                                    res.status(500).json({ error: "Error de servidor" });
                                                };
                                            };

                                            if (id_rentaxc){
                                                let fecha_fact = new Date();
    
                                                //Hace la afectación a Facturación de Renta
                                                console.log('renta: ', id_rentaxc, fecha_fact, monto_fact, saldo_renta);
                                                try {
                                                    new Promise((resolve, reject) => {
                                                        
                                                        accesosRenta.registrarFactRenta(id_rentaxc, fecha_fact, monto_fact, saldo_renta,  (err, filaRenta) => {
                                                            
                                                            if (err) {
                                                                console.log( 'Hubo un error al registrar el abono del préstamo');
                                                                return reject(err);
                                                            } else {
                                                                
                                                                resolve(filaRenta);
                                                            }
                                                        });
                                                    })
                                                } catch (error) {
                                                    console.error("Error de servidor:", error);
                                                    res.status(500).json({ error: "Error de servidor" });
                                                };
                                            };        
                                        };
                                    });
                                });
                            } catch (error) {
                                console.error("Error during database insertion:", error);
                                 return res.status(500).json({ error: "Error de servidor" });
                            }

                        })
                        return res.status(200).json({ message: 'Planilla generada correctamente' });

                    } else {
                        console.log('No existen datos en el parámetro de fechas dado, para el cálculo de salarios. Revise las fechas dadas.');
                        return res.status(400).json({ error: 'No existen datos en el parámetro de fechas dado.' });
                    }
                }
            });
        } catch (error) {
            console.error("Error during database insertion:", error);
            return res.status(500).json({ error: "Error de servidor" });
        }; 
    }; */
    
