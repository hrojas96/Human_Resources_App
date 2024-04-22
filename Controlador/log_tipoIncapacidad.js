const express = require('express');
const cors = require('cors');
const app = express();

const accesos = require('../Modelo/acc_tipoIncapacidad');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    
    accesos.consultarTipoIncapacidad((error, filas) => {
        if (error) {
            console.log('Hubo un error');
            //throw err;
        } else {
            res.send(filas);
        };
    });
});

//Insertar puestos
app.post('/',(req, res) => {
    
    let data = [{
        concepto:req.body.concepto,
        porcentaje_salarial:req.body.porcentaje_salarial      
    }];
   try {
    accesos.insertarTipoIncapacidad(data, (err, fila) => {
        
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ error: "Datos duplicados" });
            } else {
                console.log('Hubo un error');
                //throw err;
            };
        } else {
            //console.log('Datos insertados')
            // Enviamos respuesta de BD
            res.send(fila);
        }
    });
    } catch (error) {
        console.error("Error during database insertion:", error);
        res.status(500).json({ error: "Error de servidor" });
    };
});

//Editar registro de puestos
app.put('/:id_tipo_incapacidad', (req, res)=>{
    let id_tipo_incapacidad = req.params.id_tipo_incapacidad;
    let concepto = req.body.concepto;
    let porcentaje_salarial = req.body.porcentaje_salarial;

    try {
        accesos.editarTipoIncapacidad(concepto, porcentaje_salarial, id_tipo_incapacidad, (err, fila) => {
            
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ error: "Datos duplicados" });
                } else {
                    console.log('Hubo un error')
                    //throw err;
                };
            } else {
                //console.log('Datos insertados')
                // Enviamos respuesta de BD
                res.send(fila);
            };
        });
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
    };
});

app.delete('/:id_tipo_incapacidad', (req,res)=>{
    let id_tipo_incapacidad = req.params.id_tipo_incapacidad;
    accesos.eliminarTipoIncapacidad(id_tipo_incapacidad, (error, filas) => {
        if (error) {
            console.log('Hubo un error');
            //throw err;
        } else {
            res.send(filas);
        };
    });
    
});

module.exports = app;