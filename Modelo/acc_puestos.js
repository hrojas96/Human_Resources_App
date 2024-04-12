const conectDB = require('./conexion');

// Función para obtener todos los puestos
function consultarPuestos(callback) {
    console.log('Entrando al modelo de consulta puestos');
    const query = 'SELECT * FROM Puesto';
    conectDB.conexion.query(query, callback);
    //console.log(callback)
}

module.exports = {
    consultarPuestos
}