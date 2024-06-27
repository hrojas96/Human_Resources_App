const conectDB = require('./conexion');

class RentaModel {

    /*consultarPlanilla(callback) {
        const query = `SELECT Planilla.id_salario, Planilla.fecha_desde, Planilla.fecha_hasta, Planilla.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Planilla.monto_cancelado 
                        FROM Planilla 
                        LEFT JOIN Empleado ON Planilla.id_empleado = Empleado.id_empleado
                        ORDER BY Planilla.fecha_desde DESC;`;
        conectDB.conexion.query(query,callback);
    };*/


    // Función para obtener todos los datos para el cálculo de la renta
    consultarDatosRenta(fecha1, fecha2, callback) {
        const query = `SELECT Subconsulta.id_empleado, Subconsulta.suma_total, Impuesto_Renta.id_impuesto, Impuesto_Renta.porcentaje_salarial, Empleado.hijos_dependientes, Empleado.estado_civil,
                            (SELECT monto_rebajo FROM Créditos_Fiscal_Renta WHERE concepto = 'Cónyugue') AS rebajo_matrimonio,
                            (SELECT monto_rebajo FROM Créditos_Fiscal_Renta WHERE concepto = 'Hijo') AS rebajo_hijo
                        FROM 
                            (SELECT Planilla.id_empleado, SUM(Planilla.salario_bruto) AS suma_total
                            FROM Planilla
                            WHERE Planilla.fecha_desde >= ? AND Planilla.fecha_hasta <= ?
                            GROUP BY Planilla.id_empleado) Subconsulta
                        JOIN Impuesto_Renta ON Subconsulta.suma_total 
                        BETWEEN Impuesto_Renta.tramo1 AND COALESCE(Impuesto_Renta.tramo2, Subconsulta.suma_total)
                        JOIN Empleado ON Subconsulta.id_empleado = Empleado.id_empleado;`;
        conectDB.conexion.query(query,[fecha1, fecha2], callback);
    };

    insertarRenta(data, callback) {

        const query = 'INSERT INTO RentaxCobrar SET ?';
        conectDB.conexion.query(query, data, callback);

    };

   /* registrarFactRenta(id_rentaxc, fecha_fact, monto_fact, saldo_renta, callback) {
        const query = 'INSERT INTO FacturacionRenta (id_rentaxc, fecha_fact, monto_fact) VALUES ( ?, ?, ?)'; 
        conectDB.conexion.query(query, [id_rentaxc, fecha_fact, monto_fact], (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                callback(err, null);
            } else {
                callback(null, result);
                this.editaRentaxCobrar(id_rentaxc, saldo_renta);
                
            };
        });
    };

    editaRentaxCobrar(id_rentaxc, saldo_renta, callback) {
        const query = 'UPDATE RentaxCobrar SET  saldo_renta = ? WHERE id_rentaxc = ?';
        conectDB.conexion.query(query, [saldo_renta, id_rentaxc], callback);
    };*/

    registrarFactRenta(id_rentaxc, fecha_fact, monto_fact, saldo_renta) {
        const query = 'INSERT INTO FacturacionRenta (id_rentaxc, fecha_fact, monto_fact) VALUES ( ?, ?, ?)'; 
        conectDB.conexion.query(query, [id_rentaxc, fecha_fact, monto_fact], (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                return reject(err);
            } else {
                callback(null, result);
                this.editaRentaxCobrar(id_rentaxc, saldo_renta)
                    .then(resolve)
                    .catch(reject);
            };
        });
    };

    editaRentaxCobrar(id_rentaxc, saldo_renta ) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE RentaxCobrar SET  saldo_renta = ? WHERE id_rentaxc = ?';
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

    





    /*eliminarPlanilla(fecha_desde, fecha_hasta, callback) {
        
        const query = 'DELETE FROM Planilla WHERE fecha_desde AND fecha_hasta BETWEEN ? AND ?';
        conectDB.conexion.query(query, [fecha_desde, fecha_hasta], callback);
    };*/


     

};


module.exports = new RentaModel();