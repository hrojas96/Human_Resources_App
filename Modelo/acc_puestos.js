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



module.exports = {
    consultarPuestos,
    insertarPuesto
}