const express = require('express');
const crypto = require('crypto');

const accesos = require('../Modelo/EmpleadosModel');

class EmpleadoController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/', this.consultarEmpleados);
        this.router.post('/', this.insertarEmpleado);
        this.router.put('/:id_empleado', this.editarEmpleado);
        this.router.delete('/:id_empleado', this.eliminarEmpleado);
    };

    //Consultar empleados
    consultarEmpleados(req, res) {
    
        accesos.consultarEmpleados((error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw error;
            } else {
                res.send(filas);
                //console.log(filas);
            };
        });
    };
    
    //Insertar empleados
    insertarEmpleado(req, res){
        let pass = '';
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz0123456789@#$';
        for (let i = 1; i <= 8; i++) {
            let char = Math.floor(Math.random()
                * str.length + 1);
            pass += str.charAt(char)
        };
     
        const contrasena = crypto.createHash('md5').update(pass).digest('hex');
        
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
            estado_civil:req.body.estado_civil,
            hijos_dependientes:req.body.hijos_dependientes,
            provincia:req.body.provincia,
            canton:req.body.canton,
            distrito:req.body.distrito,
            direccion:req.body.direccion
        }];
        try {
            accesos.insertarEmpleado(data, pass, (error, respuesta) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "La cédula que ingresó ya existe." });
                    } else {
                        console.log('Hubo un error');
                        //throw error;
                    };
                } else {
                    console.log(respuesta)
                    // Enviamos respuesta de BD
                    res.json({message:'El registro del empleado se ha realizado correctamente'});
                }
            });
        } catch (error) {
            console.error("Ha ocurrido un error en el servidor", error);
            res.status(500).json({ error: "Ha ocurrido un error en el servidor" });
        };
    };
    
    //Editar registro de empleados
    editarEmpleado(req, res){
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
        let estado_civil = req.body.estado_civil;
        let hijos_dependientes = req.body.hijos_dependientes;
        let provincia = req.body.provincia;
        let canton = req.body.canton;
        let distrito = req.body.distrito;
        let direccion = req.body.direccion;
    
        try {
            accesos.editarEmpleado(nombre, apellido1, apellido2, genero, id_puesto, id_rol, id_jefatura, fecha_ingreso, estado, correo, telefono, estado_civil, hijos_dependientes, provincia, canton, distrito, direccion, id_empleado, (error, resultado) => {
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "La cédula que ingresó ya existe." });
                    } else {
                        console.log('Hubo un error')
                        //throw error;
                    };
                } else {
                    console.log(resultado)
                    // Enviamos respuesta de BD
                    res.json({message: 'La edición del empleado #' + id_empleado + ', se ha realizado correctamente'});
                };
            });
        } catch (error) {
            console.error("Error durante el proceso:", error);
            res.status(500).json({ error: "Error durante el proceso" });
        };
    };
    
    eliminarEmpleado(req,res){
        let id_empleado = req.params.id_empleado;
        accesos.eliminarEmpleado(id_empleado, (error, resultado) => {
            if (error) {
                console.log('Hubo un error', error);
                //throw error;
            } else {
                console.log(resultado);
                res.json({message: 'La eliminación del empleado #' + id_empleado + ', se ha realizado correctamente'});
            };
        });
        
    };
};


module.exports = new EmpleadoController().router;















/*const express = require('express');
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
 
    const contrasena = crypto.createHash('md5').update(pass).digest('hex');
    
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

module.exports = app;*/