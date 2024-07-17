const express = require('express');

const accesos = require('../Modelo/SolicitudesModel');
const diasHabiles = require('./DiasHabilesController');

class SolicitudesController {
    constructor () {
        
    }

    //Insertar puestos
    async solicitudesVacaciones(id_vacaciones) {
        console.log('id vacaciones: ', id_vacaciones)
        try {
            const vacaciones = await accesos.consultarVacaciones(id_vacaciones);
            console.log('Vacaciones: ', vacaciones);
            console.log('length: ', vacaciones.length);
            if (vacaciones.length > 0) {
                let fechaInicial = vacaciones[0].inicio_vacacion;
                console.log('fechaInicial: ', fechaInicial);
                let fechaFinal = vacaciones[0].final_vacacion;
                console.log('fechaFinal: ', fechaFinal);
                const filas = await diasHabiles.prosesarDiasHabiles(fechaInicial, fechaFinal);
                if (filas.length > 0){
                    console.log('Filas: ', filas);
                    let id_empleado = vacaciones[0].id_empleado;
                    const pagoHora = await accesos.consultarPagoDia(id_empleado);
                    console.log('pagoHora: ', pagoHora);
                    let pago_dia = pagoHora[0].monto_por_hora * 8;

                    for (const i of filas) {

                        console.log('pago_dia: ', pago_dia);
                        let dia_solicitado = i;
                        console.log('dia_solicitado: ', dia_solicitado);

                        try {

                            await accesos.insertarSolicitudVacaciones(id_vacaciones, id_empleado, dia_solicitado, pago_dia);
                            
                        } catch (error) {
                            if (error.code === 'ER_DUP_ENTRY') {
                                console.error("Error: Datos duplicados", error);
                            } else {
                                console.error("Error de servidor", error);
                            }
                        }

                    }
                    console.log ('solicitudes agregadas')
                }
                
            }

            
        } catch (error) {
            console.error("Error de servidor", error);
        }
        
    }

}

module.exports = new SolicitudesController();
