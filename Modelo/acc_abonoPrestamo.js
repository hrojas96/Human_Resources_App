const conectDB = require('./conexion');

// Función para obtener todos los puestos
function consultarAbonos(prestamo, callback) {
    //const query = 'SELECT id_abono, fecha_abono, monto FROM Abono WHERE id_prestamo = ?;';
    const query = 'CALL SP_ConsultaAbonosPrestamos(?)';
    conectDB.conexion.query(query, [prestamo],callback);
};



module.exports = {
    consultarAbonos
};