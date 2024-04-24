const conectDB = require('./conexion');

// Función para obtener todos los puestos
function consultarEmpleados(callback) {

    const query = 'SELECT * FROM Empleado';
    conectDB.conexion.query(query, callback);
};

// Carga los empleados ya registrados para lista desplegable
function cargarPuestos(callback) {
    const query = 'SELECT id_puesto, nombre_puesto FROM Puesto';
    conectDB.conexion.query(query, callback);
}

function insertarEmpleado(data, callback) {
   
    const query = 'INSERT INTO Empleado SET ?';
    conectDB.conexion.query(query, data, callback);
};

function editarEmpleado(nombre, apellido1, apellido2, genero, id_puesto, fecha_ingreso, estado, correo, telefono, provincia, canton, distrito, direccion, id_empleado, callback) {

    const query = 'UPDATE Empleado SET nombre = ?, apellido1 = ?, apellido2 = ?, genero = ?, id_puesto = ?, fecha_ingreso = ?, estado = ?, correo = ?, telefono = ?, provincia = ?, canton = ?, distrito = ?, direccion = ? WHERE id_empleado = ?';
    conectDB.conexion.query(query, [nombre, apellido1, apellido2, genero, id_puesto, fecha_ingreso, estado, correo, telefono, provincia, canton, distrito, direccion, id_empleado], callback);
};

function eliminarEmpleado(id_empleado, callback) {
    
    const query = 'DELETE FROM Empleado WHERE id_empleado = ?';
    conectDB.conexion.query(query, id_empleado, callback);
};


module.exports = {
    consultarEmpleados,
    cargarPuestos,
    insertarEmpleado,
    editarEmpleado,
    eliminarEmpleado
};