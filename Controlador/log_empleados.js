const express = require('express');
const cors = require('cors');
const app = express();
const crypto = require('crypto');

const accesos = require('../Modelo/acc_empleados');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    
    accesos.consultarEmpleados((error, filas) => {
        if (error) {
            console.log('Hubo un error');
            //throw error;
        } else {
            res.send(filas);
            //console.log(filas);
        };
    });
});

//Insertar empleados
app.post('/',(req, res) => {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';
    for (let i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random()
            * str.length + 1);
        pass += str.charAt(char)
    };
    //console.log('Esta es la contraseña', contrasena);
    const contrasena = crypto.createHash('md5').update(pass).digest('hex');
    console.log('Esta es pass', pass);
    console.log('Esta es contrasena', contrasena);
    let data = [{
        id_empleado:req.body.id_empleado,
        nombre:req.body.nombre,
        apellido1:req.body.apellido1,
        apellido2:req.body.apellido2,
        genero:req.body.genero,
        id_puesto:req.body.id_puesto,
        id_rol:req.body.id_rol,
        id_jefatura:req.body.id_jefatura,
        fecha_ingreso:req.body.fecha_ingreso,
        estado:req.body.estado,
        correo:req.body.correo,
        contrasena,
        telefono:req.body.telefono,
        provincia:req.body.provincia,
        canton:req.body.canton,
        distrito:req.body.distrito,
        direccion:req.body.direccion
    }];
   try {
    accesos.insertarEmpleado(data, pass, (error, fila) => {
        
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ error: "Datos duplicados" });
            } else {
                console.log('Hubo un error');
                //throw error;
            };
        } else {
            console.log('Datos insertados')
            // Enviamos respuesta de BD
            res.send(fila);
        }
    });
    } catch (error) {
        console.error("Error during database insertion:", error);
        res.status(500).json({ error: "Error de servidor" });
    };
});

//Editar registro de empleados
app.put('/:id_empleado', (req, res)=>{
    let id_empleado = req.params.id_empleado;
    let nombre = req.body.nombre;
    let apellido1 = req.body.apellido1;
    let apellido2 = req.body.apellido2;
    let genero = req.body.genero;
    let id_puesto = req.body.id_puesto;
    let id_rol = req.body.id_rol;
    let id_jefatura = req.body.id_jefatura;
    let fecha_ingreso = req.body.fecha_ingreso;
    let estado = req.body.estado;
    let correo = req.body.correo;
    let telefono = req.body.telefono;
    let provincia = req.body.provincia;
    let canton = req.body.canton;
    let distrito = req.body.distrito;
    let direccion = req.body.direccion;

    try {
        accesos.editarEmpleado(nombre, apellido1, apellido2, genero, id_puesto, id_rol, id_jefatura, fecha_ingreso, estado, correo, telefono, provincia, canton, distrito, direccion, id_empleado, (error, fila) => {
            
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ error: "Datos duplicados" });
                } else {
                    console.log('Hubo un error')
                    //throw error;
                };
            } else {
                //console.log('Datos editados')
                // Enviamos respuesta de BD
                res.send(fila);
            };
        });
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
    };
});

app.delete('/:id_empleado', (req,res)=>{
    let id_empleado = req.params.id_empleado;
    accesos.eliminarEmpleado(id_empleado, (error, filas) => {
        if (error) {
            console.log('Hubo un error', error);
            //throw error;
        } else {
            res.send(filas);
        };
    });
    
});

module.exports = app;