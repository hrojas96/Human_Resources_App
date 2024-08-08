const express = require('express');
const crypto = require('crypto');

const accesos = require('../Modelo/FeriadosModel');

class EmpleadoController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarFeriados);
        this.router.post('/', this.insertarFeriados);
        this.router.put('/:id_feriado', this.editarFeriados);
        this.router.delete('/:id_feriado', this.eliminarFeriados);
    };

    //Consultar empleados
    consultarFeriados(req, res) {
    
        accesos.consultarFeriados((error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                res.send(filas);
                //console.log(filas);
            };
        });
    };
    
    //Insertar feriados
    insertarFeriados(req, res){
        
        let data = [{
            nombre_feriado:req.body.nombre_feriado,
            fecha_feriado:req.body.fecha_feriado,
            pago_obligatorio:req.body.pago_obligatorio
        }];
        try {
            accesos.insertarFeriados(data, (error, respuesta) => {
                
                if (err) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "La feriado que ingresó ya existe." });
                    } else {
                        console.log('Hubo un error', error);
                    };
                } else {
                    console.log(respuesta)
                    // Enviamos respuesta de BD
                    res.json({message:'El registro del feriado se ha realizado correctamente'});
                }
            });
        } catch (error) {
            console.error("Ha ocurrido un error en el servidor", error);
            res.status(500).json({ error: "Ha ocurrido un error en el servidor" });
        };
    };
    
    //Editar registro de feriados
    editarFeriados(req, res){
        let id_feriado = req.params.id_feriado;
        let nombre_feriado = req.body.nombre_feriado;
        let fecha_feriado = req.body.fecha_feriado;
        let pago_obligatorio = req.body.pago_obligatorio;
    
        try {
            accesos.editarFeriados(nombre_feriado, fecha_feriado, pago_obligatorio, id_feriado, (error, resultado) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "La feriado que ingresó ya existe." });
                    } else {
                        console.log('Hubo un error', error)
                    };
                } else {
                    console.log(resultado)
                    // Enviamos respuesta de BD
                    res.json({message: 'La edición del feriado #' + id_feriado + ', se ha realizado correctamente'});
                };
            });
        } catch (error) {
            console.error("Error durante el proceso:", error);
            res.status(500).json({ error: "Error durante el proceso" });
        };
    };
    
    eliminarFeriados(req,res){
        let id_feriado = req.params.id_feriado;
        accesos.eliminarFeriados(id_feriado, (error, resultado) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                console.log(resultado);
                res.json({message: 'La eliminación del feriado #' + id_feriado + ', se ha realizado correctamente'});
            };
        });
        
    };
};


module.exports = new EmpleadoController().router;