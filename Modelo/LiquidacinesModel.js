const conectDB = require('./conexion');

class PlanillaModel {

    consultarLiquidaciones(callback) {
        const query = `SELECT Liquidacion.id_liquidacion, Liquidacion.fecha,  Liquidacion.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Liquidacion.pago_vacaciones, Liquidacion.pago_aguinaldo, Liquidacion.pago_preaviso, Liquidacion.cesantia, Liquidacion.monto_liquidado
                        FROM Liquidacion 
                        LEFT JOIN Empleado ON Liquidacion.id_empleado = Empleado.id_empleado
                        ORDER BY Liquidacion.fecha DESC;`;
        conectDB.conexion.query(query,callback);
    };

    // Función para obtener todos los puestos
    consultarDatosLiquidacion(fechaYYYY, fechaMM, fecha, ultimo_aguinaldo, id_empleado, callback) {
        console.log('empleado: ', id_empleado)
        console.log('empleado: ', fecha)
        const query = `SELECT Empleado.fecha_ingreso, TIMESTAMPDIFF(YEAR, Empleado.fecha_ingreso, ?) AS años, TIMESTAMPDIFF(MONTH, Empleado.fecha_ingreso, ?) % 12 AS meses, SalarioPromedio.salario_promedio, Vacaciones.vacaciones_disfrutadas, AguinaldoPendiente.salario_total
                        FROM Empleado
                        LEFT JOIN 
                            (SELECT id_empleado, SUM(salario_bruto) AS salario_promedio
                            FROM Planilla WHERE fecha_hasta >= DATE_SUB(?, INTERVAL 6 MONTH)
                            GROUP BY id_empleado) 
                            SalarioPromedio ON Empleado.id_empleado = SalarioPromedio.id_empleado
                        LEFT JOIN 
                            (SELECT id_empleado, SUM(cant_dias_solicitados) AS vacaciones_disfrutadas
                            FROM Vacaciones GROUP BY id_empleado) 
                            Vacaciones ON Empleado.id_empleado = Vacaciones.id_empleado
                        LEFT JOIN 
                            (SELECT id_empleado, SUM(salario_bruto) AS salario_total
                            FROM Planilla WHERE fecha_hasta >= ?
                            GROUP BY id_empleado) 
                            AguinaldoPendiente ON Empleado.id_empleado = AguinaldoPendiente.id_empleado
                        WHERE Empleado.id_empleado = ?`;
        conectDB.conexion.query(query,[fechaYYYY, fechaMM,fecha, ultimo_aguinaldo, id_empleado ], callback);
    };

    insertaLiquidacion(data, callback) {

        const query = 'INSERT INTO Liquidacion SET ?';
        conectDB.conexion.query(query, data, callback);

    };

    eliminarLiquidacion(id_liquidacion, callback) {
        console.log('llego 1' );
        const query = 'DELETE FROM Liquidacion WHERE id_liquidacion = ? ';
        conectDB.conexion.query(query, [id_liquidacion], callback);
    };

    // Función para obtener el delsglose de un salario
    generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, tipoReporte, callback) {
        
        let query2 = ``;
        
        if(tipoReporte == 1){
            query2 = ` WHERE Liquidacion.id_empleado = ${id_empleado} `;

        }else{
            query2 = `WHERE Liquidacion.fecha BETWEEN '${fechaInicioRpt}'  AND '${fechaFinalRpt}' `
        }
        const query =   `SELECT Liquidacion.id_liquidacion, Liquidacion.fecha,  Liquidacion.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Liquidacion.pago_vacaciones, Liquidacion.pago_aguinaldo, Liquidacion.pago_preaviso, Liquidacion.cesantia, Liquidacion.monto_liquidado
                        FROM Liquidacion 
                        LEFT JOIN Empleado ON Liquidacion.id_empleado = Empleado.id_empleado
                        ${query2}
                        ORDER BY Liquidacion.fecha DESC;`;
        conectDB.conexion.query(query, callback);
    };

};


module.exports = new PlanillaModel();