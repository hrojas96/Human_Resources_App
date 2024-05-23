const express = require('express');
const cors = require('cors');
const app = express();


const accesos = require('../Modelo/acc_header');

app.use(cors());
app.use(express.json());
 

app.get('/:usuario', (req, res) => {
    let usuario = req.params.usuario;
    accesos.consultarAccesos(usuario,(error, filas) => {
        if (error) {
            console.log('Hubo un error');
            //throw error;
        } else {
            //console.log(filas[0]);
            res.send(filas[0]);
            
        };
    });
});


module.exports = app;