const express = require('express');
const cors = require('cors');
const app = express();

const accesos = require('../Modelo/acc_puestos');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    
    accesos.consultarPuestos((error, filas) => {
        if (error) {
            console.log('Hubo un error');
            //throw err;
        } else {
            res.send(filas);
        }
    });
});

//Insertar puestos
app.post('/',(req, res) => {
    console.log('llegó a la logica insertar');
    let data = [{
        nombre_puesto:req.body.nombre_puesto,
        monto_por_hora:req.body.monto_por_hora      
    }];
   try {
    accesos.insertarPuesto(data, (err, fila) => {
        
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ error: "Datos duplicados" });
            } else {
                console.log('Hubo un error');
                //throw err;
            };
        } else {
            //console.log('Datos insertados')
            res.send(fila);
        }
    });
    } catch (error) {
        console.error("Error during database insertion:", error);
        res.status(500).json({ error: "Error de servidor" });
    }
});

module.exports = app;