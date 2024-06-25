express = require('express');

const accesos = require('../Modelo/IncapacidadesModel');

class Incapacidades_TiposController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarTiposIncapacidades);
    };


    //Consultar las vacaciones de un único empleado
    consultarTiposIncapacidades(req, res) {
        accesos.consultarTiposIncapacidades((err, resultado) => {
            if (err) {
                console.log('Hubo un error');
                //throw err;
            } else {
                
                //console.log(resultado)
                res.send(resultado);
            };
        });
    };  

}

module.exports = new Incapacidades_TiposController().router;