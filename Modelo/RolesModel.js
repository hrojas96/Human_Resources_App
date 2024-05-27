const conectDB = require('./conexion');

class RolesModel {

    // Función para obtener todos los puestos
    consultarRoles(callback) {

        const query = 'SELECT * FROM Rol';
        conectDB.conexion.query(query, callback);
    };

    insertarRol(data, callback) {
    
        const query = 'INSERT INTO Rol SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarRol(nombre_rol, acc_mantenimeintos, acc_planilla, acc_horasExtras_RRHH, acc_prestamos,acc_permisos_RRHH,
                        acc_vacaciones_RRHH, acc_incapacidades, acc_aguinaldo, acc_liquidacion, acc_horasExtras_jefatura, 
                        acc_vacaciones_jefatura, acc_permisos_jefatura, acc_marcas, id_rol, callback) {

        const query = 'UPDATE Rol SET nombre_rol = ?, acc_mantenimeintos = ?, acc_planilla = ?, acc_horasExtras_RRHH = ?, acc_prestamos = ?, acc_permisos_RRHH = ?, acc_vacaciones_RRHH = ?, acc_incapacidades = ?, acc_aguinaldo = ?,acc_liquidacion = ?, acc_horasExtras_jefatura = ?, acc_vacaciones_jefatura = ?, acc_permisos_jefatura = ?, acc_marcas = ? WHERE id_rol = ?';
        conectDB.conexion.query(query, [nombre_rol, acc_mantenimeintos, acc_planilla, acc_horasExtras_RRHH, acc_prestamos, acc_permisos_RRHH,
                                        acc_vacaciones_RRHH, acc_incapacidades, acc_aguinaldo, acc_liquidacion, acc_horasExtras_jefatura, 
                                        acc_vacaciones_jefatura, acc_permisos_jefatura, acc_marcas, id_rol], callback);
    };

    eliminarRol(id_rol, callback) {
        
        const query = 'DELETE FROM Rol WHERE id_rol = ?';
        conectDB.conexion.query(query, id_rol, callback);
    };
}

module.exports = new RolesModel();