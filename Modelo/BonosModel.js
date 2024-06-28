const conectDB = require('./conexion');

class BonosModel {

    // Función para obtener todos los puestos
    consultarBonos(callback) {

        const query = `SELECT Bonos.id_bono, Bonos.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Bonos.fecha, Bonos.monto_bono, Bonos.razon 
                        FROM Bonos
                        LEFT JOIN Empleado ON Bonos.id_empleado = Empleado.id_empleado
                        ORDER BY Bonos.fecha DESC;`;
        conectDB.conexion.query(query, callback);
    };

    insertarBonos(data, callback) {
    
        const query = 'INSERT INTO Bonos SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarBonos(id_empleado, fecha, monto_bono, razon, id_bono, callback) {

        const query = 'UPDATE Bonos SET id_empleado = ?, fecha = ?, monto_bono = ?, razon = ? WHERE id_bono = ?';
        conectDB.conexion.query(query, [id_empleado, fecha, monto_bono, razon, id_bono], callback);
    };

    eliminarBonos(id_bono, callback) {
        
        const query = 'DELETE FROM Bonos WHERE id_bono = ?';
        conectDB.conexion.query(query, id_bono, callback);
    };
}

module.exports = new BonosModel();