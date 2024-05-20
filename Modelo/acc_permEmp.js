const conectDB = require('./conexion');

// Función para obtener todos los puestos
function consultarPermEmp(callback) {

    const query = 'SELECT * FROM Permisos';
    conectDB.conexion.query(query, callback);
};

function insertarPermEmp(data, callback) {
   
    const query = 'INSERT INTO Permisos SET ?';
    conectDB.conexion.query(query, data, callback);
};

function editarPermEmp(inicio_permiso, final_permiso, msj_empleado, id_permiso, callback) {

    const query = 'UPDATE Permisos SET inicio_permiso = ?, final_permiso = ?, msj_empleado = ? WHERE id_permiso = ?';
    conectDB.conexion.query(query, [inicio_permiso, final_permiso, msj_empleado, id_permiso], callback);
};

function eliminarPermEmp(id_puesto, callback) {
    
    const query = 'DELETE FROM Permisos WHERE id_permiso = ?';
    conectDB.conexion.query(query, id_puesto, callback);
};


module.exports = {
    consultarPermEmp,
    insertarPermEmp,
    editarPermEmp,
    eliminarPermEmp
};