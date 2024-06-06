const conectDB = require('./conexion');

class PermisosModel {

    // Función para obtener todos los permisos de un único empleado
    consultarPermEmp(id_empleado, callback) {

        const query = 'SELECT * FROM Permisos WHERE id_empleado = ?';
        conectDB.conexion.query(query, [id_empleado], callback);
    };

    insertarPermEmp(data, callback) {
    
        const query = 'INSERT INTO Permisos SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarPermEmp(inicio_permiso, final_permiso, msj_empleado, id_permiso, callback) {

        const query = 'UPDATE Permisos SET inicio_permiso = ?, final_permiso = ?, msj_empleado = ? WHERE id_permiso = ?';
        conectDB.conexion.query(query, [inicio_permiso, final_permiso, msj_empleado, id_permiso], callback);
    };

    eliminarPermEmp(id_puesto, callback) {
        
        const query = 'DELETE FROM Permisos WHERE id_permiso = ?';
        conectDB.conexion.query(query, id_puesto, callback);
    };

    // Función para obtener todos los permisos pendientes de jefatura
    consultarPermisoJef(id_jefatura, callback) {
        const query = `SELECT Permisos.id_permiso, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Permisos.inicio_permiso, Permisos.final_permiso, Permisos.msj_empleado, Permisos.decision_jefatura, Permisos.msj_jefatura, Permisos.decision_RRHH, Permisos.msj_RRHH   
                        FROM Permisos 
                        LEFT JOIN Empleado ON Permisos.id_empleado = Empleado.id_empleado WHERE Empleado.id_jefatura = ? AND decision_jefatura = "Pendiente"`;
        conectDB.conexion.query(query, [id_jefatura], callback);
    };

    editarPermJefatura(decision_jefatura, msj_jefatura, id_permiso, callback) {
        console.log('Llega a editar');
        const query = 'UPDATE Permisos SET decision_jefatura = ?, msj_jefatura = ? WHERE id_permiso = ?';
        conectDB.conexion.query(query, [decision_jefatura, msj_jefatura, id_permiso], callback);
    };

    consultarPermisoAdm(callback) {
        const query = `SELECT Permisos.id_permiso, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Permisos.inicio_permiso, Permisos.final_permiso, Permisos.msj_empleado, Permisos.decision_jefatura, Permisos.msj_jefatura, Permisos.decision_RRHH, Permisos.msj_RRHH, Permisos.derecho_pago   
                        FROM Permisos 
                        LEFT JOIN Empleado ON Permisos.id_empleado = Empleado.id_empleado WHERE decision_jefatura = "Aprobado" AND decision_RRHH = "Pendiente"`;
        conectDB.conexion.query(query, callback);
    };

    editarPermisoAdm(decision_RRHH, msj_RRHH, derecho_pago, id_permiso, callback) {
        console.log('Llega a editar');
        const query = 'UPDATE Permisos SET decision_RRHH = ?, msj_RRHH = ?, derecho_pago = ? WHERE id_permiso = ?';
        conectDB.conexion.query(query, [decision_RRHH, msj_RRHH, derecho_pago, id_permiso], callback);
    };

}

module.exports = new PermisosModel();