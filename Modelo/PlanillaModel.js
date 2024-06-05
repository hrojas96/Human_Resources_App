const conectDB = require('./conexion');
const email = require('../Controlador/Servicios/servidorEmail');

class PlanillaModel {

    consultarPlanilla(callback) {
        const query = `SELECT Planilla.id_salario, Planilla.fecha_desde, Planilla.fecha_hasta, Planilla.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Planilla.monto_cancelado 
                        FROM Planilla 
                        LEFT JOIN Empleado ON Planilla.id_empleado = Empleado.id_empleado
                        ORDER BY Planilla.fecha_desde DESC;`;
        conectDB.conexion.query(query,callback);
    };



    // Función para obtener todos los puestos
    consultarDatosPlanilla(fecha1, fecha2, callback) {
        const query = 'CALL SP_CalcularPlanilla(?,?)';
        conectDB.conexion.query(query,[fecha1, fecha2], callback);
    };

    insertarPlanilla(data, callback) {

        const query = 'INSERT INTO Planilla SET ?';
        conectDB.conexion.query(query, data, callback);

    };

    eliminarPlanilla(fecha_desde, fecha_hasta, callback) {
        
        const query = 'DELETE FROM Planilla WHERE fecha_desde AND fecha_hasta BETWEEN ? AND ?';
        conectDB.conexion.query(query, [fecha_desde, fecha_hasta], callback);
    };

};


module.exports = new PlanillaModel();