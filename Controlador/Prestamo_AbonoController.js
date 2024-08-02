const express = require('express');

const accesos = require('../Modelo/Prest_AbonoModel');

class Prest_AbonoController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:prestamo', this.consultarAbonos);
        this.router.post('/', this.insertarAbono);
        this.router.put('/:id_abono', this.editarAbono);
        this.router.delete('/:id_abono', this.eliminarAbono);
    };

    //Consultar abonos
    consultarAbonos(req, res)  {
        let prestamo = req.params.prestamo;
        accesos.consultarAbonos(prestamo,(error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw error;
            } else {
                let saldo = filas[0].monto_solicitado;
                filas.forEach(a => {
                    saldo -= a.monto;
                    a.saldo = saldo;
                });
                //console.log(filas[0]);
                res.send(filas);
                
            };
        });
    };

     //Insertar prestamos
    insertarAbono(req, res) {
        let id_prestamo = req.body.id_prestamo;
        let monto = req.body.monto;
        let saldo = req.body.saldo;
        
        try {
            accesos.insertarAbono(id_prestamo, monto, saldo, (err, fila) => {
                
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

    //Editar registro de prestamos
    editarAbono(req, res) {
        let id_abono = req.params.id_abono;
        let monto = req.body.monto;
        let id_prestamo = req.body.id_prestamo;
        let saldo = req.body.saldo;

        try {
            accesos.editarAbono(monto, id_abono, id_prestamo, saldo, (err, fila) => {
                
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error', err )    
                        res.status(500).json({ error: 'Error al editar el abono en la base de datos' });
                    }
                } else {
                    //console.log(fila);
                    res.json({message: 'La edición del abono #' + id_abono + ', se ha realizado correctamente'});
                }
            });
        } catch (error) {
            console.error("Error durante el proceso:", error);
            res.status(500).json({ error: "Error durante el proceso" });
        };
    };

    eliminarAbono(req,res) {
        let id_abono = req.params.id_abono;
        let id_prestamo = req.body.id_prestamo;
        let saldo = req.body.saldo;
        accesos.eliminarAbono(id_prestamo,saldo, id_abono, (err, resultado) => {
            if (err) {
                console.log('Hubo un error', err);
                //throw err;
                return res.status(500).json({ error: 'Error al eliminar el registro' });
            } else {
                console.log(resultado);
                return res.json({message: 'La eliminación del abono #' + id_abono + ', se ha realizado correctamente. Recuerde, si este fue un abono realizado automaticamente por planillas, modifique la planilla'});
            }
        });
        
    };

}

module.exports = new Prest_AbonoController().router;