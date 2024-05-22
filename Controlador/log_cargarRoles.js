const express = require('express');
const cors = require('cors');


const accesos = require('../Modelo/acc_empleados');

const app = express();
app.use(cors());
app.use(express.json());


//Carga los empleados en el form
app.get('/', (req, res) => {
    accesos.cargarRoles((error, filas) => {
        if (error) {
            throw error;
        } else {
            //console.log(filas)
            res.send(filas);
        }
    });
});


module.exports = app;