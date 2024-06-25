const express = require('express');

const accesos = require('../Modelo/PuestosModel');

class PuestosController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarPuestos);
        this.router.post('/', this.insertarPuesto);
        this.router.put('/:id_puesto', this.editarPuesto);
        this.router.delete('/:id_puesto', this.eliminarPuesto);
    };
    //Consultar empleados
    consultarPuestos(req, res) {
        
        accesos.consultarPuestos((error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
    };

    //Insertar puestos
    insertarPuesto(req, res) {
        
        let data = [{
            nombre_puesto:req.body.nombre_puesto,
            monto_por_hora:req.body.monto_por_hora,   
            salario_base:req.body.salario_base   
        }];
        try {
            accesos.insertarPuesto(data, (err, fila) => {
                
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error');
                        //throw err;
                    };
                } else {
                    //console.log('Datos insertados')
                    // Enviamos respuesta de BD
                    res.send(fila);
                }
            });
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
        };
    };

    //Editar registro de puestos
    editarPuesto(req, res){
        let id_puesto = req.params.id_puesto;
        let nombre_puesto = req.body.nombre_puesto;
        let monto_por_hora = req.body.monto_por_hora;
        let salario_base = req.body.salario_base;

        try {
            accesos.editarPuesto(nombre_puesto, monto_por_hora, salario_base, id_puesto, (err, fila) => {
                
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error')
                        //throw err;
                    };
                } else {
                    //console.log('Datos insertados')
                    // Enviamos respuesta de BD
                    res.send(fila);
                };
            });
            } catch (error) {
                console.error("Error during database insertion:", error);
                res.status(500).json({ error: "Error de servidor" });
        };
    };

    eliminarPuesto(req,res) {
        let id_puesto = req.params.id_puesto;
        accesos.eliminarPuesto(id_puesto, (error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
        
    };

}

module.exports = new PuestosController().router;