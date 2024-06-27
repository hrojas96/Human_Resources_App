const conectDB = require('./conexion');
const email = require('../Controlador/Servicios/servidorEmail');

class EmpleadoModel {

    // Función para obtener todos los puestos
    consultarEmpleados(callback) {
        const query = 'CALL SP_ConsultaEmpleados()';
        //const query = 'SELECT * FROM Empleado';
        conectDB.conexion.query(query, callback);
    };

    // Carga los empleados ya registrados para lista desplegable
    cargarPuestos(callback) {
        const query = 'SELECT id_puesto, nombre_puesto FROM Puesto';
        conectDB.conexion.query(query, callback);
    }

    cargarRoles(callback) {
        const query = 'SELECT id_rol, nombre_rol FROM Rol';
        conectDB.conexion.query(query, callback);
    }

    insertarEmpleado(data, pass, callback) {
    
        const query = 'INSERT INTO Empleado SET ?';
        conectDB.conexion.query(query, data, (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                callback(err, null);
            } else {
                callback(null, result);
                console.log("Resultado: ",data)
                var idColaborador = data[0].id_empleado;
                console.log ('id a enviar ', idColaborador);
                this.generarEmailCol(idColaborador, pass);
            };
        });
    };

    editarEmpleado(nombre, apellido1, apellido2, genero, id_puesto, id_rol, id_jefatura, fecha_ingreso, estado, correo, telefono,estado_civil, hijos_dependientes, provincia, canton, distrito, direccion, id_empleado, callback) {

        const query = 'UPDATE Empleado SET nombre = ?, apellido1 = ?, apellido2 = ?, genero = ?, id_puesto = ?, id_rol = ?, id_jefatura = ?, fecha_ingreso = ?, estado = ?, correo = ?, telefono = ?, estado_civil = ?, hijos_dependientes = ?, provincia = ?, canton = ?, distrito = ?, direccion = ? WHERE id_empleado = ?';
        conectDB.conexion.query(query, [nombre, apellido1, apellido2, genero, id_puesto, id_rol, id_jefatura, fecha_ingreso, estado, correo, telefono, estado_civil, hijos_dependientes, provincia, canton, distrito, direccion, id_empleado], callback);
    };

    eliminarEmpleado(id_empleado, callback) {
        
        const query = 'DELETE FROM Empleado WHERE id_empleado = ?';
        conectDB.conexion.query(query, id_empleado, callback);
    };

    generarEmailCol(idColaborador, pass){
        console.log('llega a la funcion de email con el paquete:' + idColaborador);
        const query = 'SELECT nombre, correo FROM Empleado WHERE id_empleado = ?';
        conectDB.conexion.query(query,[idColaborador], (error,filas)=>{
            if(error){
                console.log('No se envío el email, ') 
            }else{
                console.log(filas)
                var usuario = filas[0].nombre;
                var correo = filas[0].correo;
                
            //console.log('lo que se va a enviar: ' + usuario, correo);
            
                email.correoEmpleados(usuario, correo, pass);
            };
        });
        
    };

};


module.exports = new EmpleadoModel();