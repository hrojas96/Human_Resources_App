const conectDB = require('./conexion');

// Función para obtener todos los accesos
function consultarAccesos(usuario, callback) {
    const query = 'CALL SP_ConsultaTipoUsuario(?)';
    conectDB.conexion.query(query, [usuario],callback);
};



module.exports = {
    consultarAccesos
};