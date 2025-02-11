const conectDB = require('./conexion');
const email = require('../Controlador/Servicios/servidorEmail');

class MarcasModel {

    //Usuario

    // Función para obtener las marcas de un empleado
     consultarMarcasEmp(id_empleado, callback) {
        const query = `SELECT Marcas.id_marca, Marcas.fecha, Marcas.hora_entrada, Marcas.hora_salida, Marcas.horas_ordinarias, Horas_Extras.horas_extras 
                        FROM Marcas 
                        LEFT JOIN Horas_Extras ON Marcas.id_marca = Horas_Extras.id_marca
                        WHERE id_empleado = ?
                        ORDER BY Marcas.fecha DESC;`;
        conectDB.conexion.query(query, [id_empleado], callback);
    };

    enviarCodigo(codigo, id_empleado){
        
        const query = 'SELECT nombre, correo FROM Empleado WHERE id_empleado = ?';
        conectDB.conexion.query(query,[id_empleado], (error,filas)=>{
            if(error){
                console.log('No se envío el email, ') 
            }else{
                //console.log(filas)
                var colaborador = filas[0].nombre;
                var correo = filas[0].correo;
            
                email.correoMarcas(colaborador, correo, codigo);
            };
        });
        
    };

    insertarMarca(data, callback) {
        const query = 'INSERT INTO Marcas SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarMarca(hora_salida, horas_ordinarias, id_marca, callback) {
        const query = 'UPDATE Marcas SET hora_salida = ?, horas_ordinarias = ? WHERE id_marca = ?';
        conectDB.conexion.query(query, [hora_salida, horas_ordinarias, id_marca], callback);
    };

    insertarHoraExtra(data, callback) {
        const query = 'INSERT INTO Horas_Extras SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    consultarMarcaIn(id_empleado, fecha, callback) {
        const query = 'SELECT id_marca, hora_entrada FROM Marcas WHERE id_empleado = ? AND fecha = ?';
        conectDB.conexion.query(query, [id_empleado, fecha], callback);
    };

    //Administrador
    // Función para obtener todos las marcas
    consultarMarcasAdm(callback) {
        const query =   `SELECT Marcas.id_marca, Marcas.fecha, Marcas.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Marcas.hora_entrada, Marcas.hora_salida, Marcas.horas_ordinarias, Horas_Extras.horas_extras 
                        FROM Marcas 
                        LEFT JOIN Horas_Extras ON Marcas.id_marca = Horas_Extras.id_marca
                        LEFT JOIN Empleado ON Marcas.id_empleado = Empleado.id_empleado
                        ORDER BY Marcas.fecha DESC;`;
        conectDB.conexion.query(query, callback);
    };

    insertarMarcaAdm(data, callback) {
        const query = 'INSERT INTO Marcas SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarMarcaAdm(id_empleado, fecha, hora_entrada, hora_salida, horas_ordinarias, id_marca, callback) {
        const query = 'UPDATE Marcas SET id_empleado = ?, fecha = ?, hora_entrada = ?, hora_salida = ?, horas_ordinarias = ? WHERE id_marca = ?';
        conectDB.conexion.query(query, [id_empleado, fecha, hora_entrada, hora_salida, horas_ordinarias, id_marca], callback);
    };

    editarHoraExtraAdm(horas_extras, id_marca, callback) {
        console.log(horas_extras, id_marca );
        const query = 'UPDATE Horas_Extras SET horas_extras = ? WHERE id_marca = ?';
        conectDB.conexion.query(query, [horas_extras, id_marca], callback);
    };

    eliminarHoraExtraAdm(id_marca, callback) {
        
        const query = 'DELETE FROM Horas_Extras WHERE id_marca = ? ';
        conectDB.conexion.query(query, [id_marca], (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                callback(err, null);
            } else {
                callback(null, result);
                this.eliminarMarcaAdm(id_marca);
            };
        });
    };

    eliminarMarcaAdm(id_marca) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM Marcas WHERE id_marca = ? ';
            conectDB.conexion.query(query, [id_marca], (err, result) => {
                if (err) {
                    console.error('Error en la base de datos:', err);
                    return reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, tipoReporte, callback) {
        
        let query2 = ``;
        
        if(tipoReporte == 1){
            query2 = ` AND Marcas.id_empleado = ${id_empleado} `;

        }else{
            query2 = ``
        }
        const query =  `SELECT Marcas.id_marca, Marcas.fecha, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Marcas.hora_entrada, Marcas.hora_salida, Marcas.horas_ordinarias, Horas_Extras.horas_extras   
                        FROM Horas_Extras 
                        LEFT JOIN Marcas ON Horas_Extras.id_marca = Marcas.id_marca
                        LEFT JOIN Empleado ON Marcas.id_empleado = Empleado.id_empleado
                        WHERE Marcas.fecha BETWEEN '${fechaInicioRpt}' AND '${fechaFinalRpt}'  ${query2}
                        ORDER BY Marcas.fecha DESC`;
        
        conectDB.conexion.query(query, callback);
    };
}

module.exports = new MarcasModel();