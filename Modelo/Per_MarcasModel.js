const conectDB = require('./conexion');

class MarcasModel {

    // Función para obtener todos las marcas
    consultarMarcas(callback) {
        const query = 'SELECT * FROM Marcas';
        conectDB.conexion.query(query, callback);
    };

     // Función para obtener las marcas de un empleado
     consultarMarcasEmp(id_empleado, callback) {
        const query = `SELECT Marcas.id_marca, Marcas.fecha, Marcas.hora_entrada, Marcas.hora_salida, Marcas.horas_ordinarias, Horas_Extras.horas_extras 
                        FROM Marcas 
                        LEFT JOIN Horas_Extras ON Marcas.id_marca = Horas_Extras.id_marca
                        WHERE id_empleado = ?
                        ORDER BY Marcas.fecha DESC;`;
        conectDB.conexion.query(query, [id_empleado], callback);
    };

    insertarMarca(data, callback) {
        const query = 'INSERT INTO Marcas SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarMarca(hora_salida, horas_ordinarias, id_marca, callback) {
        const query = 'UPDATE Marcas SET hora_salida = ?, horas_ordinarias = ? WHERE id_marca = ?';
        conectDB.conexion.query(query, [hora_salida, horas_ordinarias, id_marca], callback);
    };

    insertarHoraExtra(data, callback) {
        const query = 'INSERT INTO Horas_Extras SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    consultarMarcaIn(id_empleado, fecha, callback) {
        const query = 'SELECT id_marca, hora_entrada FROM Marcas WHERE id_empleado = ? AND fecha = ?';
        conectDB.conexion.query(query, [id_empleado, fecha], callback);
    };
}

module.exports = new MarcasModel();