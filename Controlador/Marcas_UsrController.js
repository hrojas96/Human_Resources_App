const express = require('express');

const accesos = require('../Modelo/MarcasModel');

class Per_MarcasController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        //this.router.get('/', this.consultarMarcas);
        this.router.get('/:id_empleado', this.consultarMarcasEmp);
        this.router.post('/:id_empleado', this.enviarCodigo);
        this.router.post('/', this.insertarMarca);
        this.router.put('/:id_empleado', this.editarMarca); 
    };

    //Consulta todas las marcas de un empleado específico
    consultarMarcasEmp(req, res) {
        let id_empleado = req.params.id_empleado;
        accesos.consultarMarcasEmp(id_empleado, (error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                res.send(filas);
            };
        });
    };

    //Insertar marca de entrada
    enviarCodigo(req, res) {
        console.log('llego a enviar correo marca')
        let id_empleado = req.params.id_empleado;
        let codigo = req.body.codigo;
        try {
            
            accesos.enviarCodigo(codigo, id_empleado);
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
        };
    };

    //Insertar marca de entrada
    insertarMarca(req, res) {
        
        let data = [{
            id_empleado:req.body.id_empleado,
            hora_entrada:req.body.hora_entrada      
        }];
        try {
            console.log('Data 1: '+ JSON.stringify(data[0]));
            accesos.insertarMarca(data, (error, fila) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error', error);
                        res.status(400).json({ error: "Hubo un error al registrar su marca " });
                    };
                } else {
                    // Enviamos respuesta de BD
                    res.send(fila);
                }
            });
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
        };
    };

    //Editar registro de marcas
    editarMarca(req, res) {
        let id_empleado = req.params.id_empleado;
        let hora_salida = req.body.hora_salida;

        let date = new Date();
        let ano = date.getFullYear();
        let mes = String(date.getMonth() + 1).padStart(2, '0');
        let dia = String(date.getDate()).padStart(2, '0');
        let fecha = `${ano}-${mes}-${dia}`

        /*let id_empleado = 23;
        let fecha = '2024-05-17';
        let hora_salida = '14:15:00';*/

        try {
        accesos.consultarMarcaIn(id_empleado, fecha, (error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
                
            } else {
                //Revisa si se registró una marca de entrada
                if (filas.length > 0) {
                    let fila = filas[0];
                    let id_marca = fila.id_marca;
                    let entrada = calcularHoras(fila.hora_entrada);
                    let salida = calcularHoras(hora_salida);
                    let msTrabajados = salida - entrada;
                    let horasTrabajadas = msTrabajados/(1000*60*60);
                    console.log('horas trabajadas: ' + horasTrabajadas);
                    let horas_ordinarias = 8;
                    let horas_extras = 0;

                    //Revisa si hay registro de extrass
                    if(horasTrabajadas > horas_ordinarias){ 
                        horas_extras = horasTrabajadas - horas_ordinarias;
                    }else{
                        horas_ordinarias = horasTrabajadas.toFixed(2);
                    }

                    //Hace el registro de las horas ordinarias
                    try {
                        accesos.editarMarca(hora_salida, horas_ordinarias, id_marca, (error, fila) => {
                            
                            if (error) {
                                if (err.code === 'ER_DUP_ENTRY') {
                                    res.status(400).json({ error: "Datos duplicados" });
                                } else {
                                    console.log('Hubo un error', error);
                                };
                            } else {
                                let estado = 'Pendiente';
                                let decision_jefatura = 'Pendiente';
                                let decision_RRHH = 'Pendiente';
                                try {
                                    let data = [{
                                        id_marca,
                                        horas_extras,
                                        estado,
                                        decision_jefatura,
                                        decision_RRHH
                                    }];
                                    //Hace el resgistro de las extras
                                    accesos.insertarHoraExtra(data, (err, fila) => {
                                        
                                        if (err) {
                                            if (err.code === 'ER_DUP_ENTRY') {
                                                res.status(400).json({ error: "Datos duplicados" });
                                            } else {
                                                console.log('Hubo un error')
                                                //throw err;
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
                                res.send(fila);
                            };
                        });
                        } catch (error) {
                            console.error("Error during database insertion:", error);
                            res.status(500).json({ error: "Error de servidor" });
                    };
                } else {
                    console.log('No existe una hora de entrada');
                    res.status(400).json({ error: "Debe existir una hora de entrada para el correcto registro de una hora de salida" });
                }
            }
                
        });  
        } catch (error) {
                console.error("Error during database insertion:", error);
                res.status(500).json({ error: "Error de servidor" });
        };
    };

    
};



//Convierte la hora en milesegundos para sacar la diferencia entre marcas
function calcularHoras(marca) {
    console.log("LLegó a calcular");
    console.log(marca);
    let [horas, minutos, segundos] = marca.split(':');
    let hora = new Date();
    hora.setHours(horas);
    hora.setMinutes(minutos);
    hora.setSeconds(segundos);
    hora.setMilliseconds(0);
    console.log('horaaaaa: ' +hora)
    return hora;
};


module.exports = new Per_MarcasController().router;