const express = require('express');
const cors = require('cors');
const app = express();

const accesos = require('../Modelo/acc_notificaciones');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    
    accesos.consultarNotificaciones((error, filas) => {
        if (error) {
            console.log('Hubo un error');
            //throw error;
        } else {
            res.send(filas);
            //console.log(filas);
        };
    });
});

module.exports = app;