const conectDB = require('./conexion');


function consultarNotificaciones(callback) {
    //console.log('Llega a consulta notificaciones');
    const query = `SELECT Permisos.id_permiso, Permisos.decision_jefatura    
                    FROM Permisos 
                    WHERE decision_jefatura = "Pendiente"`;
    conectDB.conexion.query(query, callback);
};

module.exports = {
    consultarNotificaciones
};