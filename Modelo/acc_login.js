const conectDB = require('./conexion');

function consultarUsuario(id_empleado, callback) {
    //console.log('llega a los accesos Usuario', id_empleado)
    const query = 'SELECT contrasena FROM Empleado WHERE id_empleado = ?';
    conectDB.conexion.query(query, [id_empleado], callback); 
};

function editarContrasena(id_empleado, contrasena, callback) {
    //console.log('Entrando al controlador de editar');
    const query = 'UPDATE Empleado SET contrasena = ? WHERE id_empleado = ?';
    conectDB.conexion.query(query, [contrasena, id_empleado], callback);
}



module.exports = {
    consultarUsuario,
    editarContrasena
};