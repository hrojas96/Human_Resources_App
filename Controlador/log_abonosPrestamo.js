const express = require('express');
const cors = require('cors');
const app = express();


const accesos = require('../Modelo/acc_abonoPrestamo');

app.use(cors());
app.use(express.json());
 

app.get('/:prestamo', (req, res) => {
    let prestamo = req.params.prestamo;
    accesos.consultarAbonos(prestamo,(error, filas) => {
        if (error) {
            console.log('Hubo un error');
            //throw error;
        } else {
            let saldo = filas[0][0].monto_solicitado;
            filas[0].forEach(a => {
                saldo -= a.monto;
                a.saldo = saldo;
            });
            //console.log(filas[0]);
            res.send(filas[0]);
            
        };
    });
});


module.exports = app;