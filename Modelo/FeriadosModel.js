const conectDB = require('./conexion');

class FeriadosModel {

    // Función para obtener todos los puestos
    consultarFeriados(callback) {

        const query = 'SELECT * FROM Feriados';
        conectDB.conexion.query(query, callback);
    };

    insertarFeriados(data, callback) {
    
        const query = 'INSERT INTO Feriados SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarFeriados(nombre_feriado, fecha_feriado, pago_obligatorio, id_feriado, callback) {

        const query = 'UPDATE Feriados SET nombre_feriado = ?, fecha_feriado = ?, pago_obligatorio = ? WHERE id_feriado = ?';
        conectDB.conexion.query(query, [nombre_feriado, fecha_feriado, pago_obligatorio, id_feriado], callback);
    };

    eliminarFeriados(id_feriado, callback) {
        
        const query = 'DELETE FROM Feriados WHERE id_feriado = ?';
        conectDB.conexion.query(query, id_feriado, callback);
    };
}

module.exports = new FeriadosModel();