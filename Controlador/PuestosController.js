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
    //Consultar puestos
    consultarPuestos(req, res) {
        
        accesos.consultarPuestos((error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
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
            //Se hace la solicitud de insertar y se envián los datos 
            accesos.insertarPuesto(data, (error, resultado) => {
                //Si ocurre un error se verifica el tipo de error y se notifica al usuario
                if (error) {
                    //Si es un error de duplicidad de datos
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados. El registro ya existe" });
                    } else {
                        //De lo contrario
                        console.log('Hubo un error', error);
                        res.status(500).json({ error: 'Error al insertar el puesto en la base de datos' });
                    };
                //Si la inserción es un éxito se notifica al usuario
                } else {
                    //console.log(resultado);
                    res.json({message:'La solicitud de su permiso se ha realizado correctamente'});
                }
            });
        //Si no se ejecuta el proceso
        } catch (error) {
            console.error("Error durante el proceso", error);
            res.status(500).json({ error: "Error durante el proceso" });
        };
    };

    //Editar registro de puestos
    editarPuesto(req, res){
        let id_puesto = req.params.id_puesto;
        let nombre_puesto = req.body.nombre_puesto;
        let monto_por_hora = req.body.monto_por_hora;
        let salario_base = req.body.salario_base;

        try {
            //Se hace la solicitud de editar y se envián los datos 
            accesos.editarPuesto(nombre_puesto, monto_por_hora, salario_base, id_puesto, (error, resultado) => {
                //Si ocurre un error se verifica el tipo de error y se notifica al usuario
                if (error) {
                    //Si es un error de duplicidad de datos
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados. El registro ya existe" });
                    } else {
                        console.log('Hubo un error', error)
                        res.status(500).json({ error: 'Error al editar el puesto en la base de datos' });
                    }
                //Si la edición es un éxito se notifica al usuario
                } else {
                console.log(resultado);
                res.json({message: 'La edición del puesto #' + id_puesto + ', se ha realizado correctamente'});
                }
            });
        //Si no se ejecuta el proceso
        } catch (error) {
            console.error("Error durante el proceso ", error);
            res.status(500).json({ error: "Error durante el proceso" });
        };
    };

    eliminarPuesto(req,res) {
        let id_puesto = req.params.id_puesto;
            try{
                //Se hace la solicitud de insertar y se envián el identificador
                accesos.eliminarPuesto(id_puesto, (error, resultado) => {
                    //Si ocurre un error se notifica al usuario
                    if (error) {
                        console.log('Hubo un error', error);
                        res.status(500).json({ error: 'Error al eliminar el registro' });
                    //Si la eliminacion es un éxito se notifica al usuario
                    } else {
                        console.log(resultado);
                        res.json({message: 'La eliminación del puesto #' + id_puesto + ', se ha realizado correctamente'});
                    }
                });
            //Si no se ejecuta el proceso
            } catch (error) {
                console.error("Error durante el proceso ", error);
                res.status(500).json({ error: "Error durante el proceso" });
            };
    };

}

module.exports = new PuestosController().router;