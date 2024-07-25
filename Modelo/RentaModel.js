const conectDB = require('./conexion');

class RentaModel {

    consultarImpuestoRenta(callback) {

        const query = 'SELECT * FROM Impuesto_Renta';
        conectDB.conexion.query(query, callback);
    };

    // Función para obtener todos los datos para el cálculo de la renta
    consultarDatosRentaGeneral(fecha1, fecha2) {
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
        return new Promise((resolve, reject) => {
            conectDB.conexion.query(query,[fecha1, fecha2], (err, results) => {
                if (err){
                    reject(err);
                }
                else { 
                    //const [filas] = results;
                    resolve(results);
                }
            });
        });
    };

    consultarDatosRentaIndividual(fecha1, fecha2, id_empleado) {
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
                        JOIN Empleado ON Subconsulta.id_empleado = Empleado.id_empleado
                        WHERE Empleado.id_empleado =? ;`;
        return new Promise((resolve, reject) => {
            conectDB.conexion.query(query,[fecha1, fecha2, id_empleado], (err, results) => {
                if (err){
                    reject(err);
                }
                else { 
                    //const [filas] = results;
                    resolve(results);
                }
            });
        });
    };


    insertarRenta(data, callback) {

        const query = 'INSERT INTO RentaxCobrar SET ?';
        conectDB.conexion.query(query, data, callback);

    };

    registrarFactRenta(id_rentaxc, fecha_fact, monto_fact, saldo_renta) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO FacturacionRenta (id_rentaxc, fecha_fact, monto_fact) VALUES ( ?, ?, ?)'; 
            conectDB.conexion.query(query, [id_rentaxc, fecha_fact, monto_fact], (err, result) => {
                if (err) {
                    console.error('Error en la base de datos:', err);
                    return reject(err);
                } else {
                
                    this.editaRentaxCobrar(id_rentaxc, saldo_renta)
                        .then(resolve)
                        .catch(reject);
                };
            });
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

    editarImpuestoRenta(tramo1,tramo2, porcentaje_salarial, id_impuesto, callback) {

        const query = 'UPDATE Impuesto_Renta SET tramo1 = ?, tramo2 = ?, porcentaje_salarial = ? WHERE id_impuesto = ?';
        conectDB.conexion.query(query, [tramo1,tramo2, porcentaje_salarial, id_impuesto], callback);
    };

};


module.exports = new RentaModel();




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