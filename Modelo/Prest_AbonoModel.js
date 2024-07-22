const conectDB = require('./conexion');

class Prest_AbonoModel {

    // Función para obtener los abonos realizados por un empleado específico
    consultarAbonos(prestamo, callback) {
        
        const query = `SELECT Prestamos.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Prestamos.fecha_solicitud, Prestamos.monto_solicitado, 
                        Prestamos.rebajo_salarial, Abono.id_abono, Abono.fecha_abono, Abono.monto
                        FROM Prestamos
                        LEFT JOIN Abono ON Prestamos.id_prestamo = Abono.id_prestamo
                        LEFT JOIN Empleado ON Prestamos.id_empleado = Empleado.id_empleado
                        WHERE Prestamos.id_prestamo = ?;`;
        conectDB.conexion.query(query, [prestamo],callback);
    };

    insertarAbono(id_prestamo, monto, saldo, callback) {
    
        const query = 'INSERT INTO Abono (id_prestamo, monto) VALUES (?, ?)';
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

    editarAbono( monto, id_abono, id_prestamo, saldo, callback) {
        
        const query = 'UPDATE Abono SET monto = ? WHERE id_abono = ?';
        conectDB.conexion.query(query, [monto, id_abono], (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                callback(err, null);
            } else {
                callback(null, result);
                this.editaPrestamo(id_prestamo, saldo);
            };
        });
    };

    eliminarAbono(id_prestamo, saldo, id_abono, callback) {
        
        const query = 'DELETE FROM Abono WHERE id_abono = ?';
        conectDB.conexion.query(query, [id_abono], (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                callback(err, null);
            } else {
                callback(null, result);
                this.editaPrestamo(id_prestamo, saldo);
            };
        });
    };
    
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
        console.log('llega a editar prestamo')
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