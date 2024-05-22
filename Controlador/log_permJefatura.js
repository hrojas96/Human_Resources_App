const express = require('express');
const cors = require('cors');
const app = express();

const accesos = require('../Modelo/acc_permEmp');

app.use(cors());
app.use(express.json());


//Consultar los permisos pendientes de jefatura
app.get('/', (req, res) => {
    accesos.consultarPermJefatura((error, filas) => {
        if (error) {
            console.log('Hubo un error');
            //throw error;
        } else {
            res.send(filas);
        };
    });
});

//Editar desición de la jefatura
app.put('/:id_permiso', (req, res)=>{
    let id_permiso = req.params.id_permiso;
    let decision_jefatura = req.body.decision_jefatura;

    try {
        accesos.editarPermJefatura(decision_jefatura, id_permiso, (err, fila) => {
            
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ error: "Datos duplicados" });
                } else {
                    console.log('Hubo un error')
                    //throw err;
                };
            } else {
                console.log('Datos insertados')
                // Enviamos respuesta de BD
                res.send(fila);
            };
        });
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
    };
});

module.exports = app;