const express = require('express');

const accesos = require('../Modelo/RentaModel');
class Planilla_RentaController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.post('/', this.calcularRenta);
    };

    //CalcularSalarios
    calcularRenta(req, res) {
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;

        try {
            accesos.consultarDatosRenta(fecha_desde, fecha_hasta, async (err, filas) => {
                
                if (err) {
                    
                    console.log('Hubo un error', err);
                    return res.status(500).json({ error: 'Hubo un error al consultar datos de la planilla' });
                    
                } else {
                    //Revisa si se encontró datos en el parámetro de fechas dado
                    if (filas.length > 0) {
                        //console.log(filas);
                        
                        filas.forEach((i) => {
                            let id_empleado = i.id_empleado;
                            let monto_por_cobrar = i.suma_total * i.porcentaje_salarial;
                            
                            
                            
                            if (i.estado_civil == "Casado/a"){
                                monto_por_cobrar = monto_por_cobrar - i.rebajo_matrimonio;
                            }
                            if (i.hijos_dependientes > 0 ){
                                monto_por_cobrar = monto_por_cobrar - (i.rebajo_hijo * i.hijos_dependientes);
                            }
                            let saldo_renta = monto_por_cobrar;
                            let rebajo_semanal = monto_por_cobrar / 4;

                            let data = [{
                                id_empleado,
                                fecha_desde,
                                fecha_hasta,
                                monto_por_cobrar,
                                rebajo_semanal,
                                saldo_renta
                            }];
                            //console.log('Data: ',data)
                            try {
                                new Promise((resolve, reject) => {
                                    accesos.insertarRenta(data, (err, filas) => {
                                        
                                        if (err) {
                                            if (err.code === 'ER_DUP_ENTRY') {
                                                return res.status(400).json({ error: "Datos duplicados" });
                                            } else {
                                                console.log('Hubo un error');
                                                return reject(err);
                                            };
                                        } else {
                                            // Enviamos respuesta de BD
                                            console.log('Calculo de renta generado correctamente', filas);
                                            resolve(filas);  
                                            
                                                
                                        };
                                    });
                                });
                            } catch (error) {
                                console.error("Error de servidor:", error);
                                 return res.status(500).json({ error: "Error de servidor" });
                            }
                        
                        })
                        return res.status(200).json({ message: 'Calculo de renta generado correctamente' });

                    } else {
                        console.log('No existen datos en el parámetro de fechas dado.');
                        return res.status(400).json({ error: 'No existen datos en el parámetro de fechas dado, para el cálculo de renta. Revise las fechas dadas. '});
                    }
                }
            });
        } catch (error) {
            console.error("Error de servidor", error);
            return res.status(500).json({ error: "Error de servidor" });
        }; 
    }; 
    

};

module.exports = new Planilla_RentaController().router;