const conectDB = require('./conexion');

class NotificacionesModel {

    consultarNotificacionesJef(id_jefatura, callback) {
        //console.log('Llega a consulta notificaciones');
        const query = `SELECT Permisos.id_permiso, Vacaciones.id_vacaciones, Horas_Extras.id_marca
                        FROM Empleado 
                        LEFT JOIN Permisos ON Empleado.id_empleado = Permisos.id_empleado AND Permisos.decision_jefatura = "Pendiente"
                        LEFT JOIN Vacaciones ON Empleado.id_empleado = Vacaciones.id_empleado AND Vacaciones.decision_jefatura= "Pendiente"
                        LEFT JOIN  Marcas ON Empleado.id_empleado = Marcas.id_empleado
                        LEFT JOIN Horas_Extras ON Marcas.id_marca = Horas_Extras.id_marca AND Horas_Extras.estado = "Solicitado" AND Horas_Extras.decision_jefatura = "Pendiente"
                        WHERE Empleado.id_jefatura = ?  ;`
        conectDB.conexion.query(query, [id_jefatura], callback);
    };

    consultarNotificacionesAdm(id_jefatura, callback) {
        //console.log('Llega a consulta notificaciones');
        const query = `SELECT Permisos.id_permiso, Vacaciones.id_vacaciones, Horas_Extras.id_marca
                        FROM Empleado 
                        LEFT JOIN Permisos ON Empleado.id_empleado = Permisos.id_empleado AND Permisos.decision_jefatura = "Aprobado" AND Permisos.decision_RRHH = "Pendiente"
                        LEFT JOIN Vacaciones ON Empleado.id_empleado = Vacaciones.id_empleado AND Vacaciones.decision_jefatura= "Aprobado" AND Vacaciones.decision_RRHH= "Pendiente" 
                        LEFT JOIN  Marcas ON Empleado.id_empleado = Marcas.id_empleado 
                        LEFT JOIN Horas_Extras ON Marcas.id_marca = Horas_Extras.id_marca AND Horas_Extras.decision_jefatura = "Aprobado" AND Horas_Extras.decision_RRHH = "Pendiente"
                        LEFT JOIN  Rol ON Empleado.id_rol = Rol.id_rol
                        WHERE Rol.acc_horasExtras_RRHH = 1 OR  Rol.acc_permisos_RRHH = 1 OR Rol.acc_vacaciones_RRHH;`
        conectDB.conexion.query(query, [id_jefatura], callback);
    };
}

module.exports = new NotificacionesModel();