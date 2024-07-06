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

    //Usr
     // Función para obtener los salarios de un empleado
     consultarPlanillaUsr(id_empleado, callback) {
        const query = `SELECT id_salario, fecha_desde, fecha_hasta, monto_cancelado
                        FROM Planilla 
                        WHERE id_empleado = ?
                        ORDER BY Planilla.fecha_desde DESC;`;
        conectDB.conexion.query(query, [id_empleado], callback);
    };

    // Función para obtener el delsglose de un salario
    consultarDesgloseSalario(id_salario, callback) {
        const query = `SELECT Planilla.fecha_desde,  Planilla.fecha_hasta, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, 
                                Planilla.id_salario, Planilla.monto_horas_ordinarias, Planilla.monto_horas_extras, Planilla.monto_bono, 
                                Planilla.deduccion_ccss, Planilla.deduccion_bancopopular, Planilla.deduccion_renta, Planilla.deduccion_prestamo,
                                Planilla.salario_bruto, SUM(Planilla.deduccion_ccss + Planilla.deduccion_bancopopular + Planilla.deduccion_renta + Planilla.deduccion_prestamo) AS total_deducciones,   Planilla.monto_cancelado
                        FROM Planilla
                        LEFT JOIN Empleado ON Planilla.id_empleado = Empleado.id_empleado
                        WHERE Planilla.id_salario = ?;`;
        conectDB.conexion.query(query, [id_salario], callback);
    };

    // Función para obtener el reporte de salarios
    generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, minimo,maximo,repoteMonetario, tipoReporte, callback) {
        
        let query2 = ``;
        
        if(tipoReporte == 2 && repoteMonetario == 2){
            query2 = ` AND Planilla.monto_cancelado BETWEEN ${minimo} AND ${maximo} `;

        }else if(tipoReporte == 1 && repoteMonetario == 1){
            query2 = ` AND Planilla.id_empleado = ${id_empleado} `;

        }else if(tipoReporte == 1 && repoteMonetario == 2){
            query2 = ` AND Planilla.id_empleado = ${id_empleado} AND Planilla.monto_cancelado BETWEEN ${minimo} AND ${maximo} `;

        }else{
            query2 = ``
        }
        const query = `SELECT Planilla.fecha_desde,  Planilla.fecha_hasta, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, 
                                Planilla.id_salario, Planilla.monto_horas_ordinarias, Planilla.monto_horas_extras, Planilla.monto_bono, 
                                Planilla.deduccion_ccss, Planilla.deduccion_bancopopular, Planilla.deduccion_renta, Planilla.deduccion_prestamo,
                                Planilla.salario_bruto, SUM(Planilla.deduccion_ccss + Planilla.deduccion_bancopopular + Planilla.deduccion_renta + Planilla.deduccion_prestamo) AS total_deducciones,   Planilla.monto_cancelado
                        FROM Planilla
                        LEFT JOIN Empleado ON Planilla.id_empleado = Empleado.id_empleado
                        WHERE Planilla.fecha_desde >= '${fechaInicioRpt}'  AND Planilla.fecha_hasta <= '${fechaFinalRpt}' ${query2}
                        Group by Planilla.id_salario;`;
        
        conectDB.conexion.query(query, callback);
    };

};


module.exports = new PlanillaModel();