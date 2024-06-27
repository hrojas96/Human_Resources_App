const conectDB = require('./conexion');

class Prest_AbonoModel {

    // Función para obtener los abonos realizados por un empleado específico
    consultarAbonos(prestamo, callback) {
        //const query = 'SELECT id_abono, fecha_abono, monto FROM Abono WHERE id_prestamo = ?;';
        const query = 'CALL SP_ConsultaAbonosPrestamos(?)';
        conectDB.conexion.query(query, [prestamo],callback);
    };



    /*registrarAbono(id_prestamo,monto, saldo, callback) {
        const query = 'INSERT INTO Abono (id_prestamo, monto) VALUES ( ?, ?)'; 
        conectDB.conexion.query(query, [id_prestamo, monto], (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                callback(err, null);
            } else {
                callback(null, result);
                this.editaPrestamo(id_prestamo, saldo);
                
            };
        });
    };

    editaPrestamo(id_prestamo, saldo, callback) {
        const query = 'UPDATE Prestamos SET  saldo = ? WHERE id_prestamo = ?';
        conectDB.conexion.query(query, [saldo, id_prestamo], callback);
    };*/

    registrarAbono(id_prestamo, monto, saldo) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Abono (id_prestamo, monto) VALUES (?, ?)';
            conectDB.conexion.query(query, [id_prestamo, monto], (err, result) => {
                if (err) {
                    console.error('Error en la base de datos:', err);
                    return reject(err);
                } else {
                    this.editaPrestamo(id_prestamo, saldo)
                        .then(resolve)
                        .catch(reject);
                }
            });
        });
    }

    editaPrestamo(id_prestamo, saldo) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Prestamos SET saldo = ? WHERE id_prestamo = ?';
            conectDB.conexion.query(query, [saldo, id_prestamo], (err, result) => {
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

module.exports = new Prest_AbonoModel();