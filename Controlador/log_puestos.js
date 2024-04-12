const express = require('express');
const cors = require('cors');
const app = express();

const accesos = require('../Modelo/acc_puestos');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log('llegó a la logica');
    accesos.consultarPuestos((error, filas) => {
        if (error) {
            console.log('hubo un error');
            //throw err;
        } else {
            console.log(filas)
            res.send(filas);
        }
    });
});

module.exports = app;