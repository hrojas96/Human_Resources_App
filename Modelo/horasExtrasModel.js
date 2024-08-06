const conectDB = require('./conexion');

class HorasExtrasModel {

    // USUARIO
    consultarHorasExtrasUsr(id_empleado, callback) {

        const query = `SELECT Horas_Extras.id_marca, Marcas.fecha, Horas_Extras.horas_extras, Horas_Extras.estado  
                            FROM Horas_Extras 
                            LEFT JOIN Marcas ON Horas_Extras.id_marca = Marcas.id_marca
                            WHERE id_empleado = ? AND Horas_Extras.horas_extras > 0
                            ORDER BY fecha DESC;`;
        conectDB.conexion.query(query, [id_empleado], callback);
    };

    editarHorasExtrasUsr(estado, id_marca, callback) {

        const query = 'UPDATE Horas_Extras SET estado = ? WHERE id_marca = ?';
        conectDB.conexion.query(query, [estado, id_marca,], callback);
    };

    generarReportesUsr(fechaInicioRpt,fechaFinalRpt, id_empleado, callback) {
        const query =  `SELECT Marcas.id_marca, Marcas.fecha, Marcas.hora_entrada, Marcas.hora_salida, Marcas.horas_ordinarias, Horas_Extras.horas_extras   
                        FROM Horas_Extras 
                        LEFT JOIN Marcas ON Horas_Extras.id_marca = Marcas.id_marca
                        LEFT JOIN Empleado ON Marcas.id_empleado = Empleado.id_empleado
                        WHERE Marcas.fecha BETWEEN '${fechaInicioRpt}' AND '${fechaFinalRpt}' AND Marcas.id_empleado = ${id_empleado}
                        ORDER BY Marcas.fecha DESC`;
        
        conectDB.conexion.query(query, callback);
    };

    //JEFATURA

    consultarHorasExtrasJef(id_jefatura, callback) {
        const query = `SELECT Horas_Extras.id_marca, Marcas.fecha, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Horas_Extras.horas_extras, Horas_Extras.decision_jefatura    
                        FROM Horas_Extras 
                        LEFT JOIN Marcas ON Horas_Extras.id_marca = Marcas.id_marca
                        LEFT JOIN Empleado ON Marcas.id_empleado = Empleado.id_empleado
                        WHERE  Horas_Extras.estado = "Solicitado" OR Horas_Extras.estado = "Denegado" OR Horas_Extras.estado = "Aprobado" AND Empleado.id_jefatura = ? 
                        ORDER BY fecha DESC`; 
        conectDB.conexion.query(query, [id_jefatura], callback);
    };

    editarHorasExtrasJef(estado, decision_jefatura, id_marca, callback) {
        
        const query = 'UPDATE Horas_Extras SET estado = ?, decision_jefatura = ? WHERE id_marca = ?';
        conectDB.conexion.query(query, [estado, decision_jefatura, id_marca], callback);
    };

    //ADMINISTRADOR

    consultarHorasExtrasAdm(callback) {
        const query = `SELECT Horas_Extras.id_marca, Marcas.fecha, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Horas_Extras.horas_extras, Horas_Extras.decision_jefatura, Horas_Extras.decision_RRHH    
                        FROM Horas_Extras 
                        LEFT JOIN Marcas ON Horas_Extras.id_marca = Marcas.id_marca
                        LEFT JOIN Empleado ON Marcas.id_empleado = Empleado.id_empleado
                        WHERE Horas_Extras.decision_jefatura = "Aprobado" 
                        ORDER BY fecha DESC`;
        conectDB.conexion.query(query, callback);
    };

    editarHorasExtrasAdm(estado, decision_RRHH, id_marca, callback) {
        console.log('Llega a editar');
        const query = 'UPDATE Horas_Extras SET estado = ?, decision_RRHH = ? WHERE id_marca = ?';
        conectDB.conexion.query(query, [estado, decision_RRHH, id_marca], callback);
    };

    generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, decision,reporteDecision, tipoReporte, callback) {
        
        let query2 = ``;
        
        if(tipoReporte == 2 && reporteDecision == 2){
            query2 = ` AND Horas_Extras.decision_RRHH  = "${decision}"`;

        }else if(tipoReporte == 1 && reporteDecision == 1){
            query2 = ` AND Marcas.id_empleado = ${id_empleado} `;

        }else if(tipoReporte == 1 && reporteDecision == 2){
            query2 = ` AND Marcas.id_empleado = ${id_empleado} AND Horas_Extras.decision_RRHH  = "${decision}" `;

        }else{
            query2 = ``
        }
        const query =  `SELECT Horas_Extras.id_marca, Marcas.fecha, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Horas_Extras.horas_extras, Horas_Extras.decision_jefatura, Horas_Extras.decision_RRHH    
                        FROM Horas_Extras 
                        LEFT JOIN Marcas ON Horas_Extras.id_marca = Marcas.id_marca
                        LEFT JOIN Empleado ON Marcas.id_empleado = Empleado.id_empleado
                        WHERE Marcas.fecha BETWEEN '${fechaInicioRpt}' AND '${fechaFinalRpt}'  ${query2}
                        ORDER BY Marcas.fecha DESC`;
        
        conectDB.conexion.query(query, callback);
    };

}

module.exports = new HorasExtrasModel();