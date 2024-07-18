const conectDB = require('./conexion');

class IncapacidadesModel {

    consultarTiposIncapacidades(callback) {
        const query = `SELECT * FROM Tipo_Incapacidad;`;
        conectDB.conexion.query(query, callback);
    };

    consultarIncapacidadesAdm(callback) {
        const query = `SELECT Incapacidad.id_incapacidad, Incapacidad.id_empleado,  Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Incapacidad.id_tipo_incapacidad, Tipo_Incapacidad.concepto, Incapacidad.fecha_desde, Incapacidad.fecha_hasta, Incapacidad.monto_subcidio, Incapacidad.estado
                        FROM Incapacidad 
                        LEFT JOIN Empleado ON Incapacidad.id_empleado = Empleado.id_empleado
                        LEFT JOIN Tipo_Incapacidad ON Incapacidad.id_tipo_incapacidad = Tipo_Incapacidad.id_tipo_incapacidad
                        ORDER BY Incapacidad.fecha_desde DESC;`;
        conectDB.conexion.query(query,callback);
    };

    // Función para obtener todos los puestos
    consultarDatosIncapacidades(fecha_desde, id_empleado, callback) {
       
        const query = `SELECT Empleado.id_empleado, Puesto.salario_base, SalarioPromedio.salario_promedio
                        FROM Empleado
                        LEFT JOIN 
                            (SELECT id_empleado, SUM(salario_bruto) AS salario_promedio
                            FROM Planilla WHERE fecha_desde >= DATE_SUB(?, INTERVAL 3 MONTH)
                            GROUP BY id_empleado) 
                            SalarioPromedio ON Empleado.id_empleado = SalarioPromedio.id_empleado
                        LEFT JOIN Puesto ON Empleado.id_puesto = Puesto.id_puesto
                        WHERE Empleado.id_empleado = ?;`;
        conectDB.conexion.query(query,[fecha_desde, id_empleado ], callback);
    };


    insertarIncapacidadesAdm(data, callback) {

        const query = 'INSERT INTO Incapacidad SET ?';
        conectDB.conexion.query(query, data, callback);

    };

    editarIncapacidadesAdm(id_empleado, id_tipo_incapacidad, fecha_desde, fecha_hasta, monto_subcidio, id_incapacidad, callback) {
        
        const query = 'UPDATE Incapacidad SET id_empleado = ?, id_tipo_incapacidad = ?, fecha_desde = ?, fecha_hasta = ?,monto_subcidio = ? WHERE id_incapacidad = ?';
        conectDB.conexion.query(query, [id_empleado, id_tipo_incapacidad, fecha_desde, fecha_hasta, monto_subcidio, id_incapacidad], callback);
    };

    eliminarIncapacidadesAdm(id_incapacidad, callback) {
        console.log('llego 1' );
        const query = 'DELETE FROM Incapacidad WHERE id_incapacidad = ? ';
        conectDB.conexion.query(query, [id_incapacidad], callback);
    };

    aceptarIncapacidad(estado, id_incapacidad, callback) {
        
        const query = 'UPDATE Incapacidad SET estado = ? WHERE id_incapacidad = ?';
        conectDB.conexion.query(query, [estado, id_incapacidad], callback);
    };

    generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, reporteTipoInc,reporteDecision, tipoReporte, callback) {
        
        let query2 = ``;
        
        if(tipoReporte == 2 && reporteDecision == 2){
            query2 = ` AND Incapacidad.id_tipo_incapacidad = "${reporteTipoInc}"`;

        }else if(tipoReporte == 1 && reporteDecision == 1){
            query2 = ` AND Incapacidad.id_empleado = ${id_empleado} `;

        }else if(tipoReporte == 1 && reporteDecision == 2){
            query2 = ` AND Incapacidad.id_empleado = ${id_empleado} AND Incapacidad.id_tipo_incapacidad = "${reporteTipoInc}" `;

        }else{
            query2 = ``
        }
        const query =   `SELECT Incapacidad.id_incapacidad, Incapacidad.id_empleado,  Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Incapacidad.id_tipo_incapacidad, Tipo_Incapacidad.concepto, Incapacidad.fecha_desde, Incapacidad.fecha_hasta, Incapacidad.monto_subcidio
                        FROM Incapacidad 
                        LEFT JOIN Empleado ON Incapacidad.id_empleado = Empleado.id_empleado
                        LEFT JOIN Tipo_Incapacidad ON Incapacidad.id_tipo_incapacidad = Tipo_Incapacidad.id_tipo_incapacidad
                        WHERE Incapacidad.fecha_desde BETWEEN '${fechaInicioRpt}' AND '${fechaFinalRpt}'  ${query2}
                        ORDER BY Incapacidad.fecha_desde DESC;`;
        
        conectDB.conexion.query(query, callback);
    };

};


module.exports = new IncapacidadesModel();




/*consultarPorcentaje(id_tipo_incapacidad, callback) {
       
    const query = `SELECT Tipo_Incapacidad.porcentaje_salarial FROM Tipo_Incapacidad WHERE Tipo_Incapacidad.id_tipo_incapacidad = ?;`;
    conectDB.conexion.query(query,[id_tipo_incapacidad], callback); 
};*/