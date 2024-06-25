const conectDB = require('./conexion');

class PrestamosModel {

    // Función para obtener todos los puestos
    consultarPrestamos(callback) {
        const query = 'CALL SP_ConsultaPrestamos()';
        //const query = 'SELECT * FROM Empleado';
        conectDB.conexion.query(query, callback);
    };

    // Carga los empleados ya registrados para lista desplegable
    cargarEmpleados(callback) {
        const query = 'SELECT id_empleado, nombre, apellido1, apellido2  FROM Empleado WHERE estado != "Liquidado"';
        conectDB.conexion.query(query, callback);
    }

   insertarPrestamo(data, callback) {
    
        const query = 'INSERT INTO Prestamos SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarPrestamo(id_empleado, fecha_solicitud, monto_solicitado, rebajo_salarial, saldo, id_prestamo, callback) {

        const query = 'UPDATE Prestamos SET id_empleado = ?, fecha_solicitud = ?, monto_solicitado = ?, rebajo_salarial = ?, saldo = ? WHERE id_prestamo = ?';
        conectDB.conexion.query(query, [id_empleado, fecha_solicitud, monto_solicitado, rebajo_salarial, saldo, id_prestamo], callback);
    };

    eliminarPrestamo(id_prestamo, callback) {
        
        const query = 'DELETE FROM Prestamos WHERE id_prestamo = ?';
        conectDB.conexion.query(query, id_prestamo, callback);
    };

}
module.exports = new PrestamosModel();