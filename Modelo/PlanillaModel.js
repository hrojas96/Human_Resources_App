const conectDB = require('./conexion');
const email = require('../Controlador/Servicios/servidorEmail');

class PlanillaModel {

    consultarPlanilla(fecha1, fecha2, callback) {
        const query = 'SELECT * FROM Salarios';
        conectDB.conexion.query(query,[fecha1, fecha2], callback);
    };



    // Función para obtener todos los puestos
    consultarDatosPlanilla(fecha1, fecha2, callback) {
        const query = 'CALL SP_CalcularPlanilla80(?,?)';
        //const query = 'SELECT * FROM Empleado';
        conectDB.conexion.query(query,[fecha1, fecha2], callback);
    };

    



    insertarEmpleado(data, pass, callback) {
    
        const query = 'INSERT INTO Empleado SET ?';
        conectDB.conexion.query(query, data, (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                callback(err, null);
            } else {
                callback(null, result);
                var idColaborador = result.insertId;
                //console.log ('id a enviar ', idColaborador);
                this.generarEmailCol(idColaborador, pass);
            };
        });
    };

    

};


module.exports = new PlanillaModel();