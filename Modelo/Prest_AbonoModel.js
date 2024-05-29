const conectDB = require('./conexion');

class Prest_AbonoModel {

    // Función para obtener los abonos realizados por un empleado específico
    consultarAbonos(prestamo, callback) {
        //const query = 'SELECT id_abono, fecha_abono, monto FROM Abono WHERE id_prestamo = ?;';
        const query = 'CALL SP_ConsultaAbonosPrestamos(?)';
        conectDB.conexion.query(query, [prestamo],callback);
    };
}

module.exports = new Prest_AbonoModel();