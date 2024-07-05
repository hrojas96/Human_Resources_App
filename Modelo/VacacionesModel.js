const conectDB = require('./conexion');

class VacacionesModel {

    // USUARIO
    consultarVacacionesUsr(id_empleado, callback) {

        const query = `SELECT Vacaciones.id_vacaciones, Vacaciones.inicio_vacacion, Vacaciones.final_vacacion, Vacaciones.cant_dias_solicitados, 
		                Vacaciones.decision_jefatura, Vacaciones.msj_jefatura, Vacaciones.decision_RRHH, Vacaciones.msj_RRHH, Empleado.fecha_ingreso   
                        FROM Vacaciones 
                        LEFT JOIN Empleado ON Vacaciones.id_empleado = Empleado.id_empleado 
                        WHERE Vacaciones.id_empleado = ?
                        ORDER BY inicio_vacacion DESC;`;
        conectDB.conexion.query(query, [id_empleado], callback);
    };

    insertarVacacionesUsr(data, callback) {
    
        const query = 'INSERT INTO Vacaciones SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarVacacionesUsr(inicio_vacacion, final_vacacion, cant_dias_solicitados, decision_jefatura, decision_RRHH, id_vacaciones, callback) {

        const query = 'UPDATE Vacaciones SET inicio_vacacion = ?, final_vacacion = ?, cant_dias_solicitados = ?, decision_jefatura = ?, decision_RRHH = ? WHERE id_vacaciones = ?';
        conectDB.conexion.query(query, [inicio_vacacion, final_vacacion, cant_dias_solicitados, decision_jefatura, decision_RRHH, id_vacaciones], callback);
    };

    eliminarVacacionesUsr(id_vacaciones, callback) {
        
        const query = 'DELETE FROM Vacaciones WHERE id_vacaciones = ?';
        conectDB.conexion.query(query, id_vacaciones, callback);
    };

    //JEFATURA

    consultarVacacionesJef(id_jefatura, callback) {
        const query = `SELECT Vacaciones.id_vacaciones, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Vacaciones.inicio_vacacion, Vacaciones.final_vacacion, Vacaciones.decision_jefatura, Vacaciones.msj_jefatura, Vacaciones.decision_RRHH, Vacaciones.msj_RRHH   
                        FROM Vacaciones 
                        LEFT JOIN Empleado ON Vacaciones.id_empleado = Empleado.id_empleado WHERE Empleado.id_jefatura = ? ORDER BY inicio_vacacion DESC`; 
        conectDB.conexion.query(query, [id_jefatura], callback);
    };

    editarVacacionesJef(decision_jefatura, msj_jefatura, id_vacaciones, callback) {
        
        const query = 'UPDATE Vacaciones SET decision_jefatura = ?, msj_jefatura = ? WHERE id_vacaciones = ?';
        conectDB.conexion.query(query, [decision_jefatura, msj_jefatura, id_vacaciones], callback);
    };

    //ADMINISTRADOR

    consultarVacacionesAdm(callback) {
        const query = `SELECT Vacaciones.id_vacaciones, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Vacaciones.inicio_vacacion, Vacaciones.final_vacacion, Vacaciones.decision_jefatura, Vacaciones.msj_jefatura, Vacaciones.decision_RRHH, Vacaciones.msj_RRHH   
                        FROM Vacaciones 
                        LEFT JOIN Empleado ON Vacaciones.id_empleado = Empleado.id_empleado WHERE decision_jefatura = "Aprobado" ORDER BY inicio_vacacion DESC `; //AND decision_RRHH = "Pendiente"
        conectDB.conexion.query(query, callback);
    };

    editarVacacionesAdm(decision_RRHH, msj_RRHH, id_vacaciones, callback) {

        const query = 'UPDATE Vacaciones SET decision_RRHH = ?, msj_RRHH = ? WHERE id_vacaciones = ?';
        conectDB.conexion.query(query, [decision_RRHH, msj_RRHH, derecho_pago, id_vacaciones], callback);
    };

    // Función para obtener el delsglose de un salario
    generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, decision,reporteDecision, tipoReporte, callback) {
        
        let query2 = ``;
        
        if(tipoReporte == 2 && reporteDecision == 2){
            query2 = ` AND Vacaciones.decision_RRHH = "${decision}"`;

        }else if(tipoReporte == 1 && reporteDecision == 1){
            query2 = ` AND Vacaciones.id_empleado = ${id_empleado} `;

        }else if(tipoReporte == 1 && reporteDecision == 2){
            query2 = ` AND Vacaciones.id_empleado = ${id_empleado} AND Vacaciones.decision_RRHH = "${decision}" `;

        }else{
            query2 = ``
        }
        const query =  `SELECT Vacaciones.id_vacaciones, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Vacaciones.inicio_vacacion, Vacaciones.final_vacacion, Vacaciones.decision_jefatura, Vacaciones.msj_jefatura, Vacaciones.decision_RRHH, Vacaciones.msj_RRHH   
                        FROM Vacaciones 
                        LEFT JOIN Empleado ON Vacaciones.id_empleado = Empleado.id_empleado
                        WHERE Vacaciones.inicio_vacacion BETWEEN '${fechaInicioRpt}' AND '${fechaFinalRpt}'  ${query2}
                        ORDER BY Vacaciones.id_vacaciones DESC `; 
                        
        
        conectDB.conexion.query(query, callback);
    };

}

module.exports = new VacacionesModel();