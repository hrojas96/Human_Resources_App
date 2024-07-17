const conectDB = require('./conexion');

class SolicitudesModel {

   
    consultarVacaciones(id_vacaciones) {

        const query = `SELECT Vacaciones.id_vacaciones, Vacaciones.id_empleado, Vacaciones.inicio_vacacion, Vacaciones.final_vacacion
                        FROM Vacaciones 
                        WHERE Vacaciones.id_vacaciones = ?`;
        return new Promise((resolve, reject) => {
            conectDB.conexion.query(query, [id_vacaciones], (err, filas) => {
                if (err){
                    reject(err);
                }
                else { 
                    //const [filas] = results;
                    resolve(filas);
                }
            });
        });
    };

    consultarPagoDia(id_empleado) {

        const query = `SELECT Empleado.id_puesto, Puesto.monto_por_hora
                        FROM Empleado
                        LEFT JOIN Puesto ON Empleado.id_puesto = Puesto.id_puesto
                        WHERE Empleado.id_empleado = ?;`;
        return new Promise((resolve, reject) => {
            conectDB.conexion.query(query, [id_empleado], (err, filas) => {
                if (err){
                    reject(err);
                }
                else { 
                    //const [filas] = results;
                    resolve(filas);
                }
            });
        });
    };

    insertarSolicitudVacaciones(id_vacaciones, id_empleado, dia_solicitado, pago_dia, callback) {
        console.log('diadiadia: ', dia_solicitado)
        const query = 'INSERT INTO Solicitudes (`id_vacaciones`, `id_empleado`, `dia_solicitado`, `pago_dia`) VALUES (?, ?, ?, ?); ';
        
        conectDB.conexion.query(query, [id_vacaciones, id_empleado, dia_solicitado, pago_dia], callback);
                
    };

}

module.exports = new SolicitudesModel();