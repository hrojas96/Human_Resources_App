const express = require('express');

const accesos = require('../Modelo/Fact_RentaModel');

class Fact_RentaController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarRentaxCobrar);
        this.router.put('/:id_rentaxc', this.editarRentaxCobrar);
        this.router.delete('/:id_rentaxc', this.eliminarRentaxCobrar);
    };

    //Consultar prestamos
    consultarRentaxCobrar(req, res) {
        
        accesos.consultarRentaxCobrar((err, filas) => {
            if (err) {
                console.log('Hubo un error', err);
            } else {
                res.send(filas);
            };
        });
    };

    //Editar registro de prestamos
    editarRentaxCobrar(req, res) {
        let id_rentaxc = req.params.id_rentaxc;
        let id_empleado = req.body.id_empleado;
        let fecha_desde = req.body.fecha_desde;
        let fecha_hasta = req.body.fecha_hasta;
        let monto_por_cobrar = req.body.monto_por_cobrar;
        let rebajo_semanal = req.body.rebajo_semanal;
        let saldo_renta = req.body.saldo_renta;

        try {
            accesos.editarRentaxCobrar(id_empleado, fecha_desde, fecha_hasta, monto_por_cobrar, rebajo_semanal, saldo_renta, id_rentaxc, (err, fila) => {
                
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error', err);
                        return res.status(500).json({ error: 'Error al editar la renta en la base de datos' });
                    };
                } else {
                    console.log(fila);
                    return res.json({message:'La solicitud se ha realizado correctamente'});
                }
            });
            } catch (error) {
                console.error("Error de servidor: ", error);
                res.status(500).json({ error: "Error de servidor" });
            };
    };

    eliminarRentaxCobrar(req,res) {

        let id_rentaxc = req.params.id_rentaxc;
        accesos.eliminarRentaxCobrar(id_rentaxc, (err, filas) => {
            if (err) {
                console.log('Hubo un error', err);
                //throw err;
                return res.status(500).json({ error: 'Error al eliminar el registro' });
            } else {
                console.log(filas);
                return res.json({message: 'La eliminación del registro #' + id_rentaxc + ', se ha realizado correctamente'});
            }
        });
        
    };
}

module.exports = new Fact_RentaController().router;

    