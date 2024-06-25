const conectDB = require('./conexion');

class PuestosModel {

    // Función para obtener todos los puestos
    consultarPuestos(callback) {

        const query = 'SELECT * FROM Puesto';
        conectDB.conexion.query(query, callback);
    };

    insertarPuesto(data, callback) {
    
        const query = 'INSERT INTO Puesto SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarPuesto(nombre_puesto, monto_por_hora, salario_base, id_puesto, callback) {

        const query = 'UPDATE Puesto SET nombre_puesto = ?, monto_por_hora = ?, salario_base = ? WHERE id_puesto = ?';
        conectDB.conexion.query(query, [nombre_puesto, monto_por_hora, salario_base, id_puesto], callback);
    };

    eliminarPuesto(id_puesto, callback) {
        
        const query = 'DELETE FROM Puesto WHERE id_puesto = ?';
        conectDB.conexion.query(query, id_puesto, callback);
    };
}

module.exports = new PuestosModel();