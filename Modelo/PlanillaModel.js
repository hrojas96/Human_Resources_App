const conectDB = require('./conexion');

class PlanillaModel {

    consultarPlanilla(callback) {
        const query = `SELECT Planilla.id_salario, Planilla.fecha_desde, Planilla.fecha_hasta, Planilla.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Planilla.monto_cancelado 
                        FROM Planilla 
                        LEFT JOIN Empleado ON Planilla.id_empleado = Empleado.id_empleado
                        ORDER BY Planilla.fecha_desde DESC;`;
        conectDB.conexion.query(query,callback);
    };

    consultarDatosPlanilla(fecha1, fecha2) {
        const query = 'CALL SP_CalcularPlanilla(?,?)';
        return new Promise((resolve, reject) => {
            conectDB.conexion.query(query, [fecha1, fecha2], (err, results) => {
                if (err){
                    reject(err);
                }
                else { 
                    const [filas] = results;
                    resolve(filas);
                }
            });
        });
    };

    insertarPlanilla(data) {
        const query = 'INSERT INTO Planilla SET ?';
        return new Promise((resolve, reject) => {
            conectDB.conexion.query(query, data, (err, results) => {
                if (err){
                    reject(err);
                }
                else { resolve(results);
                }
            });
        });
    };

    eliminarPlanilla(fecha_desde, fecha_hasta, callback) {
        
        const query = 'DELETE FROM Planilla WHERE fecha_desde AND fecha_hasta BETWEEN ? AND ?';
        conectDB.conexion.query(query, [fecha_desde, fecha_hasta], callback);
    };


};


module.exports = new PlanillaModel();