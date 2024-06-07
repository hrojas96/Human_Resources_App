const conectDB = require('./conexion');

class PermisosModel {

    // USUARIO
    consultarPermisosUsr(id_empleado, callback) {

        const query = 'SELECT * FROM Permisos WHERE id_empleado = ? ORDER BY inicio_permiso DESC';
        conectDB.conexion.query(query, [id_empleado], callback);
    };

    insertarPermisosUsr(data, callback) {
    
        const query = 'INSERT INTO Permisos SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarPermisosUsr(inicio_permiso, final_permiso, cant_dias_solicitados, msj_empleado, decision_jefatura, decision_RRHH, derecho_pago,  id_permiso, callback) {

        const query = 'UPDATE Permisos SET inicio_permiso = ?, final_permiso = ?, cant_dias_solicitados = ?, msj_empleado = ?, decision_jefatura = ?, decision_RRHH = ?, derecho_pago = ? WHERE id_permiso = ?';
        conectDB.conexion.query(query, [inicio_permiso, final_permiso, cant_dias_solicitados, msj_empleado, decision_jefatura, decision_RRHH, derecho_pago,  id_permiso,], callback);
    };

    eliminarPermisosUsr(id_puesto, callback) {
        
        const query = 'DELETE FROM Permisos WHERE id_permiso = ?';
        conectDB.conexion.query(query, id_puesto, callback);
    };

    //JEFATURA

    consultarPermisoJef(id_jefatura, callback) {
        const query = `SELECT Permisos.id_permiso, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Permisos.inicio_permiso, Permisos.final_permiso, Permisos.msj_empleado, Permisos.decision_jefatura, Permisos.msj_jefatura, Permisos.decision_RRHH, Permisos.msj_RRHH   
                        FROM Permisos 
                        LEFT JOIN Empleado ON Permisos.id_empleado = Empleado.id_empleado WHERE Empleado.id_jefatura = ? ORDER BY inicio_permiso DESC`; //AND decision_jefatura = "Pendiente"
        conectDB.conexion.query(query, [id_jefatura], callback);
    };

    editarPermJefatura(decision_jefatura, msj_jefatura, id_permiso, callback) {
        
        const query = 'UPDATE Permisos SET decision_jefatura = ?, msj_jefatura = ? WHERE id_permiso = ?';
        conectDB.conexion.query(query, [decision_jefatura, msj_jefatura, id_permiso], callback);
    };

    //ADMINISTRADOR

    consultarPermisoAdm(callback) {
        const query = `SELECT Permisos.id_permiso, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Permisos.inicio_permiso, Permisos.final_permiso, Permisos.msj_empleado, Permisos.decision_jefatura, Permisos.msj_jefatura, Permisos.decision_RRHH, Permisos.msj_RRHH, Permisos.derecho_pago   
                        FROM Permisos 
                        LEFT JOIN Empleado ON Permisos.id_empleado = Empleado.id_empleado WHERE decision_jefatura = "Aprobado" ORDER BY inicio_permiso DESC `; //AND decision_RRHH = "Pendiente"
        conectDB.conexion.query(query, callback);
    };

    editarPermisoAdm(decision_RRHH, msj_RRHH, derecho_pago, id_permiso, callback) {
        console.log('Llega a editar');
        const query = 'UPDATE Permisos SET decision_RRHH = ?, msj_RRHH = ?, derecho_pago = ? WHERE id_permiso = ?';
        conectDB.conexion.query(query, [decision_RRHH, msj_RRHH, derecho_pago, id_permiso], callback);
    };

}

module.exports = new PermisosModel();