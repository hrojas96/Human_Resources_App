const express = require('express');

const accesos = require('../Modelo/PlanillaModel');
const accesosAbonos = require('../Modelo/Prest_AbonoModel');
class PlanillaController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarPlanilla);
        this.router.post('/', this.calcularPlanilla);
        this.router.delete('/', this.eliminarPlanilla);
    };

    //Consultar salarios
    consultarPlanilla(req, res)  {
        accesos.consultarPlanilla((error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw error;
            } else {
                //console.log(filas[0]);
                res.send(filas);
                
            };
        });
    };

    //CalcularSalarios
    calcularPlanilla(req, res) {
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;

        try {
            accesos.consultarDatosPlanilla(fecha_desde, fecha_hasta, async (err, filas) => {
                
                if (err) {
                    
                    console.log('Hubo un error');
                    return res.status(500).json({ error: 'Hubo un error al consultar datos de la planilla' });
                    
                } else {
                    //Revisa si se encontró datos en el parámetro de fechas dado
                    if (filas.length > 0) {
                        //console.log(filas);
                        
                        let CCSS = 0.0967;
                        let BP = 0.01;
                        
                        for (let s of filas[0]) {
                            let id_empleado = s.id_empleado;
                            let monto_horas_ordinarias = s.pago_horas_ordinarias;
                            let monto_horas_extras = s.pago_horas_extras;
                            let vacaciones = s.total_dias_solicitados * 8 * s.monto_por_hora;
                            let salarioBruto = monto_horas_ordinarias + monto_horas_extras + vacaciones;
                            let deduccion_ccss = salarioBruto * CCSS;
                            let deduccion_bancopopular = salarioBruto * BP;
                            let deduccion_renta = 0;
                            let monto = 0;
                            let id_prestamo = s.id_prestamo;
                            let saldo = s.saldo;
                            //Verifica si el empleado tiene salarios
                            if (id_prestamo){
                                
                                if (saldo <= s.rebajo_salarial){
                                    monto = saldo;
                                    saldo = 0;
                                }else{
                                    monto = s.rebajo_salarial;
                                    saldo = saldo - s.rebajo_salarial;
                                }
                                //Hace la afectación a prestamos
                                try {
                                    await new Promise((resolve) => {
                                        accesosAbonos.registrarAbono(id_prestamo,monto, saldo,  (err, fila) => {
                                            
                                            if (err) {
                                                return res.status(500).json({ error: 'Hubo un error al registrar el abono del préstamo' });
                                            } else {
                                                
                                                resolve(filas);
                                            }
                                        });
                                    })
                                } catch (error) {
                                    console.error("Error during database insertion:", error);
                                    res.status(500).json({ error: "Error de servidor" });
                                };
                            };

                            let monto_cancelado = salarioBruto - deduccion_ccss - deduccion_bancopopular - deduccion_renta - monto;
                            let data = [{
                                id_empleado,
                                fecha_desde,
                                fecha_hasta,
                                monto_horas_ordinarias,
                                monto_horas_extras,
                                deduccion_ccss,
                                deduccion_bancopopular,
                                deduccion_renta,
                                id_prestamo,
                                monto_cancelado
                            }];
                            try {
                                await new Promise((resolve, reject) => {
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
                                        }
                                    });
                                });
                            } catch (error) {
                                console.error("Error during database insertion:", error);
                                 return res.status(500).json({ error: "Error de servidor" });
                            }

                        }
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
    }; 
    
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