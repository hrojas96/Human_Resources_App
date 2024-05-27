const conectDB = require('./conexion');

class AccesosModel {

    // Función para obtener todos los accesos
    consultarAccesos(usuario, callback) {
        const query = 'CALL SP_ConsultaTipoUsuario(?)';
        conectDB.conexion.query(query, [usuario],callback);
    };

}
module.exports = new AccesosModel();