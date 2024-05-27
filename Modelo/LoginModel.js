const conectDB = require('./conexion');

class LoginModel {

    consultarUsuario(id_empleado, callback) {
        const query = 'SELECT contrasena FROM Empleado WHERE id_empleado = ?';
        conectDB.conexion.query(query, [id_empleado], callback); 
    };

    editarContrasena(id_empleado, contrasena, callback) {
        const query = 'UPDATE Empleado SET contrasena = ? WHERE id_empleado = ?';
        conectDB.conexion.query(query, [contrasena, id_empleado], callback);
    }

}

module.exports = new LoginModel();