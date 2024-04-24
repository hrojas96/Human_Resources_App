const conectDB = require('./conexion');

// Función para obtener todos los puestos
function consultarTipoIncapacidad(callback) {

    const query = 'SELECT * FROM Tipo_Incapacidad';
    conectDB.conexion.query(query, callback);
};

function insertarTipoIncapacidad(data, callback) {
   
    const query = 'INSERT INTO Tipo_Incapacidad SET ?';
    conectDB.conexion.query(query, data, callback);
};

function editarTipoIncapacidad(concepto, porcentaje_salarial, id_tipo_incapacidad, callback) {

    const query = 'UPDATE Tipo_Incapacidad SET concepto = ?, porcentaje_salarial = ? WHERE id_tipo_incapacidad = ?';
    conectDB.conexion.query(query, [concepto, porcentaje_salarial, id_tipo_incapacidad], callback);
};

function eliminarTipoIncapacidad(id_tipo_incapacidad, callback) {
    
    const query = 'DELETE FROM Tipo_Incapacidad WHERE id_tipo_incapacidad = ?';
    conectDB.conexion.query(query, id_tipo_incapacidad, callback);
};


module.exports = {
    consultarTipoIncapacidad,
    insertarTipoIncapacidad,
    editarTipoIncapacidad,
    eliminarTipoIncapacidad
};