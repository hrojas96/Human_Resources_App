const conectDB = require('./conexion');

class CargasSocialesModel {

    consultarCargasSociales(callback) {

        const query = 'SELECT * FROM Deducciones_Legales';
        conectDB.conexion.query(query, callback);
    };

    editarCargasSociales(porcentaje_salarial, id_deduccion, callback) {

        const query = 'UPDATE Deducciones_Legales SET porcentaje_salarial = ? WHERE id_deduccion = ?';
        conectDB.conexion.query(query, [porcentaje_salarial, id_deduccion], callback);
    };


}

module.exports = new CargasSocialesModel();