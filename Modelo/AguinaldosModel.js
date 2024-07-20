const conectDB = require('./conexion');

class AguinaldosModel {

    consultarAguinaldo(callback) {
        const query = `SELECT Aguinaldo.id_aguinaldo, Aguinaldo.fecha_desde, Aguinaldo.fecha_hasta, Aguinaldo.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Aguinaldo.monto_pagado 
                        FROM Aguinaldo 
                        LEFT JOIN Empleado ON Aguinaldo.id_empleado = Empleado.id_empleado
                        ORDER BY Aguinaldo.fecha_desde DESC;`;
        conectDB.conexion.query(query,callback);
    };

    // Función para obtener el delsglose de un aguinaldo
    consultarDesgloseAguinaldo(id_empleado, fecha_desde, fecha_hasta, callback) {
        const query = `SELECT Aguinaldo.fecha_desde,  Aguinaldo.fecha_hasta, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Aguinaldo.id_aguinaldo,
                                Planilla.id_salario, Planilla.fecha_hasta, Planilla.salario_bruto
                        FROM Empleado
                        LEFT JOIN Planilla ON Empleado.id_empleado = Planilla.id_empleado
                        LEFT JOIN Aguinaldo ON Empleado.id_empleado = Aguinaldo.id_empleado
                        WHERE Planilla.id_empleado = ? AND  Planilla.fecha_hasta BETWEEN ? AND ?;`;
        conectDB.conexion.query(query, [id_empleado, fecha_desde, fecha_hasta], callback);
    };

    // Función para obtener todos los puestos
    consultarFechas(id_aguinaldo) {

        const query = `SELECT Aguinaldo.fecha_desde, Aguinaldo.fecha_hasta, Aguinaldo.id_empleado
                        FROM Aguinaldo 
                        WHERE Aguinaldo.id_aguinaldo = ?`;
        return new Promise((resolve, reject) => {
            conectDB.conexion.query(query, [id_aguinaldo], (err, filas) => {
                if (err){
                    reject(err);
                }
                else { 
                    //const [filas] = results;
                    resolve(filas);
                }
            });
        });
    };

    // Función para obtener información para calcular aguinaldos de todos los empleados
    consultarDatosAguinaldoGeneral(fecha_desde, fecha_hasta) {
        const query = `SELECT Planilla.id_empleado, SUM(Planilla.salario_bruto) AS total_salarios_recibidos, Empleado.nombre, Empleado.apellido1, Empleado.apellido2
                        FROM Planilla
                        LEFT JOIN Empleado ON Planilla.id_empleado = Empleado.id_empleado
                        WHERE Planilla.fecha_hasta BETWEEN ? AND ?
                        GROUP BY Planilla.id_empleado;`;
                        return new Promise((resolve, reject) => {
            conectDB.conexion.query(query,[fecha_desde, fecha_hasta], (err, filas) => {
                if (err){
                    reject(err);
                }
                else { 
                    resolve(filas);
                }
            });
        });
    };

    // Función para obtener información para calcular aguinaldo individual
    consultarDatosAguinaldoIndividual(id_empleado, fecha_desde, fecha_hasta) {
        const query = `SELECT Planilla.id_empleado, SUM(Planilla.salario_bruto) AS total_salarios_recibidos, Empleado.nombre, Empleado.apellido1, Empleado.apellido2
                        FROM Planilla
                        LEFT JOIN Empleado ON Planilla.id_empleado = Empleado.id_empleado
                        WHERE Planilla.id_empleado = ? AND Planilla.fecha_hasta BETWEEN ? AND ?
                        GROUP BY Planilla.id_empleado;`;
                        return new Promise((resolve, reject) => {
            conectDB.conexion.query(query,[id_empleado, fecha_desde, fecha_hasta], (err, filas) => {
                if (err){
                    reject(err);
                }
                else { 
                    resolve(filas);
                }
            });
        });
    };

    insertarAguinaldo(data, callback) {

        const query = 'INSERT INTO Aguinaldo (id_empleado, fecha_desde, fecha_hasta, monto_pagado) VALUES ?';
        const valores = data.map(i =>[i.id_empleado, i.fecha_desde, i.fecha_hasta, i.monto_pagado])
        conectDB.conexion.query(query, [valores], callback);

    };

    eliminarAguinaldoGeneral(fecha_desde, fecha_hasta, callback) {
        
        const query = 'DELETE FROM Aguinaldo WHERE fecha_desde = ? AND fecha_hasta = ?';
        conectDB.conexion.query(query, [fecha_desde, fecha_hasta], callback);
    };

    eliminarAguinaldoIndividual(id_empleado, fecha_desde, fecha_hasta, callback) {
        
        const query = 'DELETE FROM Aguinaldo WHERE id_empleado = ? AND fecha_desde = ? AND fecha_hasta = ?';
        conectDB.conexion.query(query, [id_empleado, fecha_desde, fecha_hasta], callback);
    };

    // Función para obtener el delsglose de un salario
    generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, minimo,maximo,repoteMonetario, tipoReporte, callback) {
        
        let query2 = ``;
        
        if(tipoReporte == 2 && repoteMonetario == 2){
            query2 = ` AND Aguinaldo.monto_pagado BETWEEN ${minimo} AND ${maximo} `;

        }else if(tipoReporte == 1 && repoteMonetario == 1){
            query2 = ` AND Aguinaldo.id_empleado = ${id_empleado} `;

        }else if(tipoReporte == 1 && repoteMonetario == 2){
            query2 = ` AND Aguinaldo.id_empleado = ${id_empleado} AND Aguinaldo.monto_pagado BETWEEN ${minimo} AND ${maximo} `;

        }else{
            query2 = ``
        }
        const query = `SELECT Aguinaldo.id_aguinaldo, Aguinaldo.fecha_desde, Aguinaldo.fecha_hasta, Aguinaldo.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Aguinaldo.monto_pagado 
                        FROM Aguinaldo 
                        LEFT JOIN Empleado ON Aguinaldo.id_empleado = Empleado.id_empleado
                        WHERE Aguinaldo.fecha_desde >= '${fechaInicioRpt}'  AND Aguinaldo.fecha_hasta <= '${fechaFinalRpt}' ${query2}
                        ORDER BY Aguinaldo.fecha_desde DESC;`;
        
        conectDB.conexion.query(query, callback);
    };

    //Usr
     // Función para obtener los aguinaldos de un empleado
     consultarAguinaldoUsr(id_empleado, callback) {
        const query = `SELECT id_aguinaldo, fecha_desde, fecha_hasta, monto_pagado
                        FROM Aguinaldo 
                        WHERE id_empleado = ?
                        ORDER BY Aguinaldo.fecha_desde DESC;`;
        conectDB.conexion.query(query, [id_empleado], callback);
    };
};


module.exports = new AguinaldosModel();


/*
consultarDatosAguinaldoGeneral(fecha1, fecha2, callback) {
        const query = `SELECT Planilla.id_empleado, SUM(Planilla.salario_bruto) AS total_salarios_recibidos, Empleado.nombre, Empleado.apellido1, Empleado.apellido2
                        FROM Planilla
                        LEFT JOIN Empleado ON Planilla.id_empleado = Empleado.id_empleado
                        WHERE Planilla.fecha_hasta BETWEEN ? AND ?
                        GROUP BY Planilla.id_empleado;`;
        conectDB.conexion.query(query,[fecha1, fecha2], callback);
    };

*/