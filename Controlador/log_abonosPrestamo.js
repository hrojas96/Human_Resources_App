const express = require('express');
const cors = require('cors');
const app = express();


const accesos = require('../Modelo/acc_abonoPrestamo');

app.use(cors());
app.use(express.json());

app.get('/:prestamo', (req, res) => {
    console.log('llegó a logica');
    let prestamo = req.params.prestamo;
    accesos.consultarAbonos(prestamo,(error, filas) => {
        if (error) {
            console.log('Hubo un error');
            throw error;
        } else {
            let saldo = 6700;
            filas[0].forEach(a => {
                saldo -= a.monto;
                a.saldo = saldo;
            });
            
            res.send(filas[0]);
            console.log(filas);
        };
    });
});


module.exports = app;