const express = require('express');

const accesos = require('../Modelo/Facturacion_RentaModel');

class Facturacion_RentaController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:factRenta', this.consultarFactRenta);
        this.router.post('/', this.insertarFactRenta);
        this.router.put('/:id_factRenta', this.editarFactRenta);
        this.router.delete('/:id_factRenta', this.eliminarFactRenta);
    };

    //Consultar facturacion renta
    consultarFactRenta(req, res)  {
        let factRenta = req.params.factRenta;
        accesos.consultarFactRenta(factRenta,(error, filas) => {
            if (error) {
                console.log('Hubo un error', error);
            } else {
                let saldo = filas[0].monto_por_cobrar;
                filas.forEach(a => {
                    saldo -= a.monto_fact;
                    a.saldo = saldo;
                });
                //console.log(filas[0]);
                res.send(filas);
                
            };
        });
    };

     //Insertar prestamos
    insertarFactRenta(req, res) {
        let monto_fact = req.body.monto_fact;
        let id_rentaxc = req.body.id_rentaxc;
        let saldo_renta = req.body.saldo_renta;
        
        try {
            accesos.insertarFactRenta(id_rentaxc, monto_fact,  saldo_renta, (err, fila) => {
                
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error', err);
                        return res.status(500).json({ error: 'Error al insertar el abono en la base de datos' });
                    };
                } else {
                    //console.log(fila);
                    return res.json({message:'El abono se ha registrado correctamente'});
                }
            });
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: "Error durante el proceso" });
        };
    };

    //Editar registro de facturacion renta
    editarFactRenta(req, res) {
        let id_factRenta = req.params.id_factRenta;
        let monto_fact = req.body.monto_fact;
        let id_rentaxc = req.body.id_rentaxc;
        let saldo_renta = req.body.saldo_renta;

        try {
            accesos.editarFactRenta(monto_fact, id_factRenta, id_rentaxc, saldo_renta, (error, fila) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error', error )    
                        res.status(500).json({ error: 'Error al editar el abono en la base de datos' });
                    }
                } else {
                    //console.log(fila);
                    res.json({message: 'La edición del registro #' + id_factRenta + ', se ha realizado correctamente'});
                }
            });
        } catch (error) {
            console.error("Error durante el proceso:", error);
            res.status(500).json({ error: "Error durante el proceso" });
        };
    };

    //Eliminar registro de facturacion renta
    eliminarFactRenta (req,res) {
        let id_factRenta = req.params.id_factRenta;
        let id_rentaxc = req.body.id_rentaxc;
        let saldo_renta = req.body.saldo_renta;
        accesos.eliminarFactRenta(id_rentaxc,saldo_renta, id_factRenta, (error, resultado) => {
            if (error) {
                console.log('Hubo un error', error);
                return res.status(500).json({ error: 'Error al eliminar el registro' });
            } else {
                console.log(resultado);
                return res.json({message: 'La eliminación del registro #' + id_factRenta + ', se ha realizado correctamente.'});
            }
        });
        
    };

}

module.exports = new Facturacion_RentaController().router;