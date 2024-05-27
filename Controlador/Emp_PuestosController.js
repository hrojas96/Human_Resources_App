const express = require('express');

const accesos = require('../Modelo/EmpleadosModel');

class Emp_PuestosController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.cargarPuestos);
    };

    //Carga los empleados en el form
    cargarPuestos(req, res) {
        accesos.cargarPuestos((error, filas) => {
            if (error) {
                throw error;
            } else {
                //console.log(filas)
                res.send(filas);
            }
        });
    };
}

module.exports = new Emp_PuestosController().router;;







/*const express = require('express');
const cors = require('cors');


const accesos = require('../Modelo/acc_empleados');

const app = express();
app.use(cors());
app.use(express.json());


//Carga los empleados en el form
app.get('/', (req, res) => {
    accesos.cargarPuestos((error, filas) => {
        if (error) {
            throw error;
        } else {
            //console.log(filas)
            res.send(filas);
        }
    });
});


module.exports = app;*/