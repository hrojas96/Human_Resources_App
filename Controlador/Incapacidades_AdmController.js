express = require('express');

const accesos = require('../Modelo/IncapacidadesModel');

class Incapacidades_AdmController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarIncapacidadesAdm);
        this.router.post('/', this.calcularIncapacidades);
        this.router.post('/:tipoReporte', this.generarReportes);
        this.router.put('/:id_incapacidad', this.editarIncapacidadesAdm);
        this.router.delete('/:id_incapacidad', this.eliminarIncapacidadesAdm);
    };
   

    //Consultar las incapacidades
    consultarIncapacidadesAdm(req, res) {
        accesos.consultarIncapacidadesAdm((err, resultado) => {
            
            if (err) {
                console.log('Hubo un error'), err;
                
            } else {
                
                //console.log(resultado)
                res.send(resultado);
            };
        });
    };

    calcularIncapacidades(req, res) {
        let id_empleado = req.body.id_empleado;
        let id_tipo_incapacidad = req.body.id_tipo_incapacidad;
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;

        try {
            accesos.consultarDatosIncapacidades(fecha_hasta, id_empleado,  async (err, filas) => {
             
                if (err) {
                    console.log('Hubo un error');
                    return res.status(500).json({ error: 'Hubo un error al consultar datos de las incapacidades' });
                    
                } else {
                    //Salario promedio de un mes
                    let salarioPromedio = filas[0].salario_promedio;
                    //Salario mínimo según ley por hora (192 horas que se trabajan en un mes)
                    let salarioBase = filas[0].salario_base * 192;

                    let monto_subcidio = 0;

                    //Identifica el tipo de incapacidad para aplicar la formula correcta
                    if (id_tipo_incapacidad  == 1) {
                        console.log('llegué acá: ');
                        monto_subcidio = (salarioPromedio / 2) / 30;
                    } else if (id_tipo_incapacidad  == 2) {
                        monto_subcidio = ((salarioPromedio * 0.15) * 4) / 30
                    } else if (id_tipo_incapacidad  == 3) {
                        if (salarioPromedio < (2 * salarioBase)) {
                            monto_subcidio = salarioPromedio / 30;
                        }
                        if (salarioPromedio > (2 * salarioBase) && salarioPromedio < (3 * salarioBase)) {
                            monto_subcidio = (salarioPromedio * 0.80) / 30;
                        } else {
                            monto_subcidio = (salarioPromedio * 0.60) / 30;
                        }
                    } else {
                        return res.status(500).json({ error: 'No se ha identificado el tipo de incapacidad que desea aplicar. Por favor contacte a su técnico' });
                    };
                    let data = [{
                        id_empleado,
                        id_tipo_incapacidad,
                        fecha_desde,
                        fecha_hasta,
                        monto_subcidio
                    }];
                    console.log('DAta: ', data)
                        
                        
                    try{
                        await new Promise((resolve, reject) => {
                            
                            /*let data = [{
                                    id_empleado,
                                    id_tipo_incapacidad,
                                    fecha_desde,
                                    fecha_hasta,
                                    monto_subcidio
                            }];*/
                            console.log('DAta: ', data)
                            accesos.insertarIncapacidadesAdm(data, (err, resultado) => {
                                
                                if (err) {
                                    //console.log('Hubo un error', err);
                                    //throw err;
                                    reject('Hubo un error', err);
                                    return res.status(500).json({ error: 'Error al registrar la incapacidad en la base de datos' });
                                } else {
                                    resolve('Proceso realizado', resultado);
                                    return res.status(200).json({ message: 'La incapacidad se ha calculado y registrado correctamente'});
                                }
                            });
                        });
                    } catch (error) {
                        console.error('Error durante el proceso:', error);
                        return res.status(500).json({ error: 'Hubo un error al registrar la incapacidad' });
                    }         
                };
            });
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Hubo un error al consultar los datos para el cálculo de la incapacidad' });
        }
    };           

    //Editar registro de incapacidad de un único empleado
    async editarIncapacidadesAdm(req, res) {
        let id_incapacidad = req.params.id_incapacidad;
        let id_empleado = req.body.id_empleado;
        let id_tipo_incapacidad = req.body.id_tipo_incapacidad;
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta
        
        try {
            accesos.consultarDatosIncapacidades(fecha_hasta, id_empleado,  async (err, filas) => {
             
                if (err) {
                    console.log('Hubo un error');
                    return res.status(500).json({ error: 'Hubo un error al consultar datos de las incapacidades' });
                    
                } else {
                    //Salario promedio de un mes
                    let salarioPromedio = filas[0].salario_promedio;
                    //Salario mínimo según ley por hora (192 horas que se trabajan en un mes)
                    let salarioBase = filas[0].salario_base * 192;

                    let monto_subcidio = 0;

                    //Identifica el tipo de incapacidad para aplicar la formula correcta
                    if (id_tipo_incapacidad  == 1) {
                        console.log('llegué acá: ');
                        monto_subcidio = (salarioPromedio / 2) / 30;
                    } else if (id_tipo_incapacidad  == 2) {
                        monto_subcidio = ((salarioPromedio * 0.15) * 4) / 30
                    } else if (id_tipo_incapacidad  == 3) {
                        if (salarioPromedio < (2 * salarioBase)) {
                            monto_subcidio = salarioPromedio / 30;
                        }
                        if (salarioPromedio > (2 * salarioBase) && salarioPromedio < (3 * salarioBase)) {
                            monto_subcidio = (salarioPromedio * 0.80) / 30;
                        } else {
                            monto_subcidio = (salarioPromedio * 0.60) / 30;
                        }
                    } else {
                        return res.status(500).json({ error: 'No se ha identificado el tipo de incapacidad que desea aplicar. Por favor contacte a su técnico' });
                    };
                    try{
                        await new Promise((resolve, reject) => {
                            
                            accesos.editarIncapacidadesAdm(id_empleado, id_tipo_incapacidad, fecha_desde, fecha_hasta, monto_subcidio, id_incapacidad, (err, resultado) => {
                                
                                if (err) {
                                    
                                    reject('Hubo un error', err);
                                    return res.status(500).json({ error: 'Error al editar la incapacidad en la base de datos' });
                                } else {
                                    resolve('Proceso realizado', resultado);
                                    return res.status(200).json({ message: 'La edición de la incapacidad #' + id_incapacidad + ', se ha realizado correctamente'});
                                }
                            });
                        });
                    } catch (error) {
                        console.error('Error durante el proceso:', error);
                        return res.status(500).json({ error: 'Hubo un error al registrar la incapacidad' });
                    }
                };
            });
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Hubo un error al consultar los datos para el cálculo de la incapacidad' });
        }
    };          


    eliminarIncapacidadesAdm(req,res) {
        let id_incapacidad = req.params.id_incapacidad;
        accesos.eliminarIncapacidadesAdm(id_incapacidad, (err, resultado) => {
            if (err) {
                console.log('Hubo un error', err);
                //throw err;
                return res.status(500).json({ error: 'Error al eliminar el registro' });
            } else {
                console.log(resultado);
                return res.json({message: 'La eliminación del registro de incapacidad #' + id_incapacidad + ', se ha realizado correctamente'});
            }
        });
    };

    generarReportes(req, res) {      
        console.log('llegooooos')
        let tipoReporte = req.params.tipoReporte;
        let id_empleado = req.body.id_empleado;
        let fechaInicioRpt = req.body.fechaInicioRpt;
        let fechaFinalRpt = req.body.fechaFinalRpt;
        let reporteTipoInc = req.body.reporteTipoInc;
        let reporteDecision = req.body.reporteDecision;

        accesos.generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, reporteTipoInc,reporteDecision, tipoReporte, (err, filas) => {
            if (err) {
                res.status(500).json({ error: "Error de servidor" });
                throw err;
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

}

module.exports = new Incapacidades_AdmController().router;





/*calcularIncapacidades(req, res) {
    let id_empleado = req.body.id_empleado;
    let id_tipo_incapacidad = req.body.id_tipo_incapacidad;
    let fecha_desde = req.body.fecha_desde;
    let fecha_hasta = req.body.fecha_hasta;

    try {
        accesos.consultarDatosIncapacidades(fecha_hasta, id_empleado,  async (err, filas) => {
         
            if (err) {
                console.log('Hubo un error');
                return res.status(500).json({ error: 'Hubo un error al consultar datos de las incapacidades' });
                
            } else {
                console.log('Filas: ', filas);
                
                accesos.consultarPorcentaje(id_tipo_incapacidad,  (err, fila) => {
                    
                    if (err) {
                        console.log('Hubo un error');
                        return res.status(500).json({ error: 'Hubo un error al consultar datos de las incapacidades' });
                        
                    } else {
                        //Revisa si se encontró datos en el parámetro de fechas dado
                        if (filas.length > 0) {
                            console.log('Fila: ', fila);
                            
                            let monto_subcidio = 0;
                            let data = [{
                                    id_empleado,
                                    id_tipo_incapacidad,
                                    fecha_desde,
                                    fecha_hasta,
                                    monto_subcidio
                            }];
                            
                            try{
                        await new Promise((resolve, reject) => {
                            console.log('DAta: ', data)
                            accesos.insertarIncapacidadesAdm(data, (err, resultado) => {
                                
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
                            return res.status(500).json({ error: 'No existen salarios registrados en las fechas indicadas para el calculo del promedio de salarios' });
                        };
                    };
                });
            };
        });
    } catch (error) {
        console.error('Error durante el proceso:', error);
        return res.status(500).json({ error: 'Hubo un error al consultar si las fechas registradas son hábiles' });
    }
}; */