const express = require('express');
const crypto = require('crypto');

const accesos = require('../Modelo/BonosModel');

class BonosController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarBonos);
        this.router.post('/', this.insertarBonos);
        this.router.put('/:id_bono', this.editarBonos);
        this.router.delete('/:id_bono', this.eliminarBonos);
    };

    //Consultar bonos
    consultarBonos(req, res) {
    
        accesos.consultarBonos((error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
                //throw error;
            } else {
                res.send(filas);
                //console.log(filas);
            };
        });
    };
    
    //Insertar bonos
    insertarBonos(req, res){
        
        let data = [{
            id_empleado:req.body.id_empleado,
            fecha:req.body.fecha,
            monto_bono:req.body.monto_bono,
            razon:req.body.razon
        }];
        try {
            accesos.insertarBonos(data, (error, respuesta) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "La bono que ingresó ya existe." });
                    } else {
                        console.log('Hubo un error', error);
                        //throw error;
                    };
                } else {
                    console.log(respuesta)
                    // Enviamos respuesta de BD
                    res.json({message:'El registro del bono se ha realizado correctamente'});
                }
            });
        } catch (error) {
            console.error("Ha ocurrido un error en el servidor", error);
            res.status(500).json({ error: "Ha ocurrido un error en el servidor" });
        };
    };
    
    //Editar registro de bonos
    editarBonos(req, res){
        let id_bono = req.params.id_bono;
        let id_empleado = req.body.id_empleado;
        let fecha = req.body.fecha;
        let monto_bono = req.body.monto_bono;
        let razon = req.body.razon;
    
        try {
            accesos.editarBonos(id_empleado, fecha, monto_bono, razon, id_bono, (error, resultado) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "El bono que ingresó ya existe." });
                    } else {
                        console.log('Hubo un error')
                        //throw error;
                    };
                } else {
                    console.log(resultado)
                    // Enviamos respuesta de BD
                    res.json({message: 'La edición del bono #' + id_bono + ', se ha realizado correctamente'});
                };
            });
        } catch (error) {
            console.error("Error durante el proceso:", error);
            res.status(500).json({ error: "Error durante el proceso" });
        };
    };
    
    eliminarBonos(req,res){
        let id_bono = req.params.id_bono;
        accesos.eliminarBonos(id_bono, (error, resultado) => {
            if (error) {
                console.log('Hubo un error', error);
                //throw error;
            } else {
                console.log(resultado);
                res.json({message: 'La eliminación del feriado #' + id_bono + ', se ha realizado correctamente'});
            };
        });
        
    };
};


module.exports = new BonosController().router;