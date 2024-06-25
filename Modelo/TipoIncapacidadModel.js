const conectDB = require('./conexion');


class TipoIncapacidadModel {

    consultarTipoIncapacidad(callback) {

        const query = 'SELECT * FROM Tipo_Incapacidad';
        conectDB.conexion.query(query, callback);
    };

    insertarTipoIncapacidad(data, callback) {
    
        const query = 'INSERT INTO Tipo_Incapacidad SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarTipoIncapacidad(concepto, porcentaje_salarial, dias_subcidio, id_tipo_incapacidad, callback) {

        const query = 'UPDATE Tipo_Incapacidad SET concepto = ?, porcentaje_salarial = ?, dias_subcidio = ? WHERE id_tipo_incapacidad = ?';
        conectDB.conexion.query(query, [concepto, porcentaje_salarial, dias_subcidio, id_tipo_incapacidad], callback);
    };

    eliminarTipoIncapacidad(id_tipo_incapacidad, callback) {
        
        const query = 'DELETE FROM Tipo_Incapacidad WHERE id_tipo_incapacidad = ?';
        conectDB.conexion.query(query, id_tipo_incapacidad, callback);
    };

}
module.exports = new TipoIncapacidadModel();