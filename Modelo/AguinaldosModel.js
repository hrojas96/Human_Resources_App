const conectDB = require('./conexion');

class AguinaldosModel {

    consultarAguinaldo(callback) {
        const query = `SELECT Aguinaldo.id_aguinaldo, Aguinaldo.fecha_desde, Aguinaldo.fecha_hasta, Aguinaldo.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Aguinaldo.monto_pagado 
                        FROM Aguinaldo 
                        LEFT JOIN Empleado ON Aguinaldo.id_empleado = Empleado.id_empleado
                        ORDER BY Aguinaldo.fecha_desde DESC;`;
        conectDB.conexion.query(query,callback);
    };

    // Función para obtener todos los puestos
    consultarDatosAguinaldo(fecha1, fecha2, callback) {
        const query = `SELECT Planilla.id_empleado, SUM(Planilla.salario_bruto) AS total_salarios_recibidos, Empleado.nombre, Empleado.apellido1, Empleado.apellido2
                        FROM Planilla
                        LEFT JOIN Empleado ON Planilla.id_empleado = Empleado.id_empleado
                        WHERE Planilla.fecha_hasta BETWEEN ? AND ?
                        GROUP BY Planilla.id_empleado;`;
        conectDB.conexion.query(query,[fecha1, fecha2], callback);
    };

    insertarAguinaldo(data, callback) {

        const query = 'INSERT INTO Aguinaldo (id_empleado, fecha_desde, fecha_hasta, monto_pagado) VALUES ?';
        const valores = data.map(i =>[i.id_empleado, i.fecha_desde, i.fecha_hasta, i.monto_pagado])
        conectDB.conexion.query(query, [valores], callback);

    };

    eliminarAguinaldo(fecha_desde, fecha_hasta, callback) {
        
        const query = 'DELETE FROM Aguinaldo WHERE fecha_desde AND fecha_hasta BETWEEN ? AND ?';
        conectDB.conexion.query(query, [fecha_desde, fecha_hasta], callback);
    };

};


module.exports = new AguinaldosModel();