const conectDB = require('./conexion');

// Función para obtener todos los puestos
function consultarPuestos(callback) {

    const query = 'SELECT * FROM Puesto';
    conectDB.conexion.query(query, callback);
};

function insertarPuesto(data, callback) {
   
    const query = 'INSERT INTO Puesto SET ?';
    conectDB.conexion.query(query, data, callback);
};

function editarPuesto(nombre_puesto, monto_por_hora, id_puesto, callback) {

    const query = 'UPDATE Puesto SET nombre_puesto = ?, monto_por_hora = ? WHERE id_puesto = ?';
    conectDB.conexion.query(query, [nombre_puesto, monto_por_hora, id_puesto], callback);
};

function eliminarPuesto(id_puesto, callback) {
    
    const query = 'DELETE FROM Puesto WHERE id_puesto = ?';
    conectDB.conexion.query(query, id_puesto, callback);
};


module.exports = {
    consultarPuestos,
    insertarPuesto,
    editarPuesto,
    eliminarPuesto
};