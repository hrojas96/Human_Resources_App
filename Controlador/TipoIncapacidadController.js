const express = require('express');

const accesos = require('../Modelo/TipoIncapacidadModel');

class TipoIncapacidadController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarTipoIncapacidad);
        this.router.post('/', this.insertarTipoIncapacidad);
        this.router.put('/:id_tipo_incapacidad', this.editarTipoIncapacidad);
        this.router.delete('/:id_tipo_incapacidad', this.eliminarTipoIncapacidad);
    };

    consultarTipoIncapacidad(req, res) {
        
        accesos.consultarTipoIncapacidad((error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
    };

    //Insertar tipo incapacidad
    insertarTipoIncapacidad(req, res) {
        
        let data = [{
            concepto:req.body.concepto,
            porcentaje_salarial:req.body.porcentaje_salarial, 
            dias_subcidio:req.body.dias_subcidio   
        }];
    try {
        accesos.insertarTipoIncapacidad(data, (err, fila) => {
            
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ error: "Datos duplicados" });
                } else {
                    console.log('Hubo un error');
                    throw err;
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
    editarTipoIncapacidad (req, res) {
        let id_tipo_incapacidad = req.params.id_tipo_incapacidad;
        let concepto = req.body.concepto;
        let porcentaje_salarial = req.body.porcentaje_salarial;
        let dias_subcidio = req.body.dias_subcidio;

        try {
            accesos.editarTipoIncapacidad(concepto, porcentaje_salarial, dias_subcidio, id_tipo_incapacidad, (err, fila) => {
                
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

    eliminarTipoIncapacidad(req,res) {
        let id_tipo_incapacidad = req.params.id_tipo_incapacidad;
        accesos.eliminarTipoIncapacidad(id_tipo_incapacidad, (error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
        
    };
}

module.exports = new TipoIncapacidadController().router;