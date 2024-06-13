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
                                id_prestamo,
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