const express = require('express');

const accesos = require('../Modelo/RentaModel');
class Planilla_RentaController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarImpuestoRenta);
        this.router.post('/', this.calcularRentaxCobrar);
        this.router.put('/:id_impuesto', this.editarImpuestoRenta);
    };

    //Consultar cargas sociales
    consultarImpuestoRenta(req, res) {
        
        accesos.consultarImpuestoRenta((err, filas) => {
            if (err) {
                console.log('Hubo un error', err);
            } else {
                //console.log(filas);
                res.send(filas);
            };
        });
    };

    //Calcula la renta de salarios que aplica
    async calcularRentaxCobrar(req, res) {
        let id_empleado = req.body.id_empleado;
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;
        let calculo = req.body.calculo;
        let filas;
        //Consulta la tabla de impuestos y los salarios que han sobrepasado alguno de los tramos
        try {
            if(calculo == 2){
                filas = await accesos.consultarDatosRentaGeneral(fecha_desde, fecha_hasta);
                console.log('filasfilas: ',filas);
                console.log(filas.length);
            }else if(calculo == 1){
                filas = await accesos.consultarDatosRentaIndividual(fecha_desde, fecha_hasta, id_empleado);
                console.log(filas);
            }

            //Revisa si se encontró datos en el parámetro de fechas dado
            if (filas.length > 0) {
                //console.log(filas);
                
                filas.forEach((i) => {
                    let id_empleado = i.id_empleado;
                    let monto_por_cobrar = i.suma_total * i.porcentaje_salarial;
                    
                    
                    //Verifica si el empleado aplica a algún credito fiscal
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
                    //Registra el cálculo de la renta en Renta por Cobrar
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
                
        } catch (error) {
            console.error("Error de servidor", error);
            return res.status(500).json({ error: "Error de servidor" });
        }; 
    }; 

    //Edita el mantenimiento de impuesto de renta
    editarImpuestoRenta(req, res){
        let id_impuesto = req.params.id_impuesto;
        let tramo1 = req.body.tramo1;
        let tramo2 = req.body.tramo2;
        let porcentaje_salarial = req.body.porcentaje_salarial;

        try {
            accesos.editarImpuestoRenta(tramo1,tramo2, porcentaje_salarial, id_impuesto, (err, fila) => {
                
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error');
                    };
                } else {
                    
                    res.status(200).json({ message: 'La edición del registro #' + id_impuesto + ', se ha realizado correctamente' });
                };
            });
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Hubo un error al realizar el registro' });
        }
    };
};

module.exports = new Planilla_RentaController().router;



/*/Calcula la renta de salarios que aplica
calcularRentaxCobrar(req, res) {
    let fecha_desde = req.body.fecha_desde;
    let fecha_hasta = req.body.fecha_hasta;
    //Consulta la tabla de impuestos y los salarios que han sobrepasado alguno de los tramos
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
                        
                        
                        //Verifica si el empleado aplica a algún credito fiscal
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
                        //Registra el cálculo de la renta en Renta por Cobrar
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
}; */