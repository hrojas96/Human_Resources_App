const conectDB = require('./conexion');

// Función para obtener todos los puestos
function consultarPrestamos(callback) {
    const query = 'CALL SP_ConsultaPrestamos()';
    //const query = 'SELECT * FROM Empleado';
    conectDB.conexion.query(query, callback);
};

// Carga los empleados ya registrados para lista desplegable
function cargarEmpleados(callback) {
    const query = 'SELECT id_empleado, nombre, apellido1, apellido2  FROM Empleado';
    conectDB.conexion.query(query, callback);
}

function insertarPrestamo(data, callback) {
   
    const query = 'INSERT INTO Prestamos SET ?';
    conectDB.conexion.query(query, data, callback);
};

function editarPrestamo(id_empleado, fecha_solicitud, monto_solicitado, rebajo_salarial, id_prestamo, callback) {

    const query = 'UPDATE Prestamos SET id_empleado = ?, fecha_solicitud = ?, monto_solicitado = ?, rebajo_salarial = ? WHERE id_prestamo = ?';
    conectDB.conexion.query(query, [id_empleado, fecha_solicitud, monto_solicitado, rebajo_salarial, id_prestamo], callback);
};

function eliminarPrestamo(id_prestamo, callback) {
    
    const query = 'DELETE FROM Prestamos WHERE id_prestamo = ?';
    conectDB.conexion.query(query, id_prestamo, callback);
};


module.exports = {
    consultarPrestamos,
    cargarEmpleados,
    insertarPrestamo,
    editarPrestamo,
    eliminarPrestamo
};