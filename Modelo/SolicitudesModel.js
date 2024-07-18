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

    consultarPermisos(id_permiso) {

        const query = `SELECT Permisos.id_permiso, Permisos.id_empleado, Permisos.inicio_permiso, Permisos.final_permiso
                        FROM Permisos 
                        WHERE Permisos.id_permiso = ?`;
        return new Promise((resolve, reject) => {
            conectDB.conexion.query(query, [id_permiso], (err, filas) => {
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

    insertarSolicitudPermisos(id_permiso, id_empleado, dia_solicitado, pago_dia, callback) {
        console.log('diadiadia: ', dia_solicitado)
        const query = 'INSERT INTO Solicitudes (`id_permiso`, `id_empleado`, `dia_solicitado`, `pago_dia`) VALUES (?, ?, ?, ?); ';
        
        conectDB.conexion.query(query, [id_permiso, id_empleado, dia_solicitado, pago_dia], callback);
                
    };

    consultarIncapacidades(id_incapacidad) {

        const query = `SELECT Incapacidad.id_incapacidad, Incapacidad.id_empleado, Incapacidad.fecha_desde, Incapacidad.fecha_hasta, Incapacidad.monto_subcidio
                        FROM Incapacidad 
                        WHERE Incapacidad.id_incapacidad = ?`;
        return new Promise((resolve, reject) => {
            conectDB.conexion.query(query, [id_incapacidad], (err, filas) => {
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

    insertarSolicitudIncapacidad(id_incapacidad, id_empleado, dia_solicitado, pago_dia, callback) {
        console.log('diadiadia: ', dia_solicitado)
        const query = 'INSERT INTO Solicitudes (`id_incapacidad`, `id_empleado`, `dia_solicitado`, `pago_dia`) VALUES (?, ?, ?, ?); ';
        
        conectDB.conexion.query(query, [id_incapacidad, id_empleado, dia_solicitado, pago_dia], callback);
                
    };
}

module.exports = new SolicitudesModel();