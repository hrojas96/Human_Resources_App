const express = require('express');
const cors = require('cors');
const app = express();

const accesos = require('../Modelo/acc_puestos');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    
    accesos.consultarMarcas((error, filas) => {
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
        id_empleado:req.body.id_empleado,
        hora_entrada:req.body.hora_entrada      
    }];
   try {
    accesos.insertarMarca(data, (err, fila) => {
        
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
app.put('/:id_empleado:', (req, res)=>{
    let id_empleado = req.params.id_empleado;
    let hora_salida = req.body.hora_salida;
    

    try {
        accesos.consultarMarcaIn(id_empleado, (err, fila) => {
            
            if (err) {
                console.log('Hubo un error')
                //throw err;
                
            } else {
                let entrada = filas.hora_entrada;
                let hOrdinarias = 0;
                if(1>0){ //VOY AQUI CAMBIAR ESTO (SI HORAS ORDINARIAS SON MAS QUE 8, EDITA LA HORA DE SALIDA Y HORAS ORDINARIAS Y AGREGUE EL RESTANTE A HORAS EXTRAS)
                    try {
                        accesos.editarMarca(nombre_puesto, monto_por_hora, id_puesto, (err, fila) => {
                            
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

                }
                
            };
        });
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
    };
});


module.exports = app;