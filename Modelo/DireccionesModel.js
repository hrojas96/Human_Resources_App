const conectDB = require('./conexion');

class DireccionesModel {

    consultarProvincias(callback) {

        const query = 'SELECT id_provincia, descripcion  FROM provincia';
        conectDB.conexion.query(query, callback);
    };

    consultarCantones(id_provincia, callback) {

        const query = 'SELECT id_canton, descripcion  FROM canton WHERE codigo_provincia = ?';
        conectDB.conexion.query(query, [id_provincia], callback);
    };

    consultarDistritos(id_canton, callback) {

        const query = 'SELECT id_distrito, descripcion  FROM distrito WHERE codigo_canton = ?';
        conectDB.conexion.query(query, [id_canton], callback);
    };

    


}

module.exports = new DireccionesModel();