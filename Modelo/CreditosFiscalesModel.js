const conectDB = require('./conexion');

class CreditosFiscalesModel {

    consultarCreditosFiscales(callback) {

        const query = 'SELECT * FROM Créditos_Fiscal_Renta';
        conectDB.conexion.query(query, callback);
    };

    editarCreditosFiscales(monto_rebajo, id_credFiscal, callback) {

        const query = 'UPDATE Créditos_Fiscal_Renta SET monto_rebajo = ? WHERE id_credFiscal = ?';
        conectDB.conexion.query(query, [monto_rebajo, id_credFiscal], callback);
    };


}

module.exports = new CreditosFiscalesModel();