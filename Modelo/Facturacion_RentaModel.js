const conectDB = require('./conexion');

class Facturacion_RentaModel {

    // Función para obtener los abonos realizados por un empleado específico
    consultarFactRenta(factRenta, callback) {
        
        const query = `SELECT RentaxCobrar.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, RentaxCobrar.fecha_desde, RentaxCobrar.monto_por_cobrar, 
                        FacturacionRenta.id_factRenta, FacturacionRenta.fecha_fact, FacturacionRenta.monto_fact
                        FROM RentaxCobrar
                        LEFT JOIN FacturacionRenta ON RentaxCobrar.id_rentaxc = FacturacionRenta.id_rentaxc
                        LEFT JOIN Empleado ON RentaxCobrar.id_empleado = Empleado.id_empleado
                        WHERE RentaxCobrar.id_rentaxc = ?;`;
        conectDB.conexion.query(query, [factRenta],callback);
    };

    insertarFactRenta(id_rentaxc, monto_fact, saldo_renta, callback) {
    
        const query = 'INSERT INTO FacturacionRenta (id_rentaxc, monto_fact) VALUES (?, ?)';
        conectDB.conexion.query(query, [id_rentaxc, monto_fact], (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                callback(err, null);
            } else {
                callback(null, result);
                this.editaRentaxCobrar(id_rentaxc, saldo_renta);
            };
        });
    };

    editarFactRenta(monto_fact, id_factRenta, id_rentaxc, saldo_renta, callback) {
        
        const query = 'UPDATE FacturacionRenta SET monto_fact = ? WHERE id_factRenta = ?';
        conectDB.conexion.query(query, [monto_fact, id_factRenta], (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                callback(err, null);
            } else {
                callback(null, result);
                this.editaRentaxCobrar(id_rentaxc, saldo_renta);
            };
        });
    };

    eliminarFactRenta(id_rentaxc,saldo_renta, id_factRenta, callback) {
        
        const query = 'DELETE FROM FacturacionRenta WHERE id_factRenta = ?';
        conectDB.conexion.query(query, [id_factRenta], (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                callback(err, null);
            } else {
                callback(null, result);
                this.editaRentaxCobrar(id_rentaxc, saldo_renta);
            };
        });
    };

    editaRentaxCobrar(id_rentaxc, saldo_renta) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE RentaxCobrar SET saldo_renta = ? WHERE id_rentaxc = ?';
            conectDB.conexion.query(query, [saldo_renta, id_rentaxc], (err, result) => {
                if (err) {
                    console.error('Error en la base de datos:', err);
                    return reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

}

module.exports = new Facturacion_RentaModel();

