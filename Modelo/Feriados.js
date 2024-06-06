const conectDB = require('./conexion');

class FeriadosModel {

    // Función para obtener todos los feriados registrados
    consultarFeriados( callback) {

        const query = 'SELECT fecha_feriado FROM Feriados';
        conectDB.conexion.query(query, callback);
    };
}

module.exports = new FeriadosModel();