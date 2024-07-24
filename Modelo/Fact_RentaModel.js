const conectDB = require('./conexion');

class Fact_RentaModel {

    // Función para obtener todos los puestos
    consultarRentaxCobrar(callback) {
        const query = `SELECT RentaxCobrar.id_rentaxc, RentaxCobrar.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, RentaxCobrar.fecha_desde, RentaxCobrar.fecha_hasta,
                        RentaxCobrar.monto_por_cobrar, RentaxCobrar.rebajo_semanal, RentaxCobrar.saldo_renta
                        FROM RentaxCobrar
                        LEFT JOIN Empleado ON RentaxCobrar.id_empleado = Empleado.id_empleado
                        WHERE RentaxCobrar.saldo_renta >= 0
                        ORDER BY Empleado.nombre ASC, RentaxCobrar.fecha_desde DESC;`;
        
        conectDB.conexion.query(query, callback);
    };

    // Carga los empleados ya registrados para lista desplegable
    cargarEmpleados(callback) {
        const query = 'SELECT id_empleado, nombre, apellido1, apellido2  FROM Empleado WHERE estado != "Liquidado" ORDER BY nombre';
        conectDB.conexion.query(query, callback);
    }

   insertarPrestamo(data, callback) {
    
        const query = 'INSERT INTO Prestamos SET ?';
        conectDB.conexion.query(query, data, callback);
    };

    editarPrestamo(id_empleado, fecha_solicitud, monto_solicitado, rebajo_salarial, saldo, id_prestamo, callback) {

        const query = 'UPDATE Prestamos SET id_empleado = ?, fecha_solicitud = ?, monto_solicitado = ?, rebajo_salarial = ?, saldo = ? WHERE id_prestamo = ?';
        conectDB.conexion.query(query, [id_empleado, fecha_solicitud, monto_solicitado, rebajo_salarial, saldo, id_prestamo], callback);
    };

    eliminarPrestamo(id_prestamo, callback) {
        
        const query = 'DELETE FROM Prestamos WHERE id_prestamo = ?';
        conectDB.conexion.query(query, id_prestamo, callback);
    };

    generarReportes(id_empleado, fechaInicioRpt,fechaFinalRpt, reporteSaldo,reporteDecision, tipoReporte, callback) {
        
        let query2 = ``;
        
        if(tipoReporte == 2 && reporteDecision == 2){
            if (reporteSaldo == "Pendiente"){
                query2 = ` Prestamos.fecha_solicitud BETWEEN '${fechaInicioRpt}' AND '${fechaFinalRpt}' AND Prestamos.saldo > 0`;
            }
            if (reporteSaldo == "Cancelado"){
                query2 = ` Prestamos.fecha_solicitud BETWEEN '${fechaInicioRpt}' AND '${fechaFinalRpt}' AND Prestamos.saldo <= 0`;
            }

        }else if(tipoReporte == 1 && reporteDecision == 1){
            query2 = `Prestamos.id_empleado = ${id_empleado} `;

        }else if(tipoReporte == 1 && reporteDecision == 2){
           
            if (reporteSaldo == "Pendiente"){
                 query2 = `Prestamos.id_empleado = ${id_empleado}  AND Prestamos.saldo > 0`;
            }
            if (reporteSaldo == "Cancelado"){
                 query2 = `Prestamos.id_empleado = ${id_empleado} AND Prestamos.saldo <= 0`;
            }
        }else{
            query2 = ` Prestamos.fecha_solicitud BETWEEN '${fechaInicioRpt}' AND '${fechaFinalRpt}'`;
        }
        
        const query =  `SELECT Prestamos.id_prestamo, Prestamos.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Prestamos.fecha_solicitud,
                        Prestamos.monto_solicitado, Prestamos.rebajo_salarial, Prestamos.saldo
                        FROM Prestamos
                        LEFT JOIN Empleado ON Prestamos.id_empleado = Empleado.id_empleado
                        WHERE ${query2}
                        ORDER BY Prestamos.fecha_solicitud DESC ;`;
        conectDB.conexion.query(query, callback);
    };

}
module.exports = new Fact_RentaModel();