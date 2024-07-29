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


    editarRentaxCobrar(id_empleado, fecha_desde, fecha_hasta, monto_por_cobrar, rebajo_semanal, saldo_renta, id_rentaxc, callback) {

        const query = 'UPDATE RentaxCobrar SET id_empleado = ?, fecha_desde = ?, fecha_hasta = ?, monto_por_cobrar = ?, rebajo_semanal = ?, saldo_renta = ? WHERE id_rentaxc = ?';
        conectDB.conexion.query(query, [id_empleado, fecha_desde, fecha_hasta, monto_por_cobrar, rebajo_semanal, saldo_renta, id_rentaxc,], callback);
    };

    eliminarRentaxCobrar(id_rentaxc, callback) {
        
        const query = 'DELETE FROM RentaxCobrar WHERE id_rentaxc = ?';
        conectDB.conexion.query(query, [id_rentaxc], callback);
    };


}
module.exports = new Fact_RentaModel();