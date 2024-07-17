const express = require('express');

const accesos = require('../Modelo/SolicitudesModel');
const diasHabiles = require('./DiasHabilesController');

class SolicitudesController {
    constructor () {
        
    }

    //Insertar puestos
    async solicitudesVacaciones(id_vacaciones) {
    
        try {
            const vacaciones = await accesos.consultarVacaciones(id_vacaciones);
            
            if (vacaciones.length > 0) {

                let fechaInicialFormato = vacaciones[0].inicio_vacacion.toISOString().slice(0, 10);
                let fechaInicial = new Date(fechaInicialFormato);
                let fechaFinalFormato = vacaciones[0].final_vacacion.toISOString().slice(0, 10);
                let fechaFinal = new Date(fechaFinalFormato);
             
                const filas = await diasHabiles.prosesarDiasHabiles(fechaInicial, fechaFinal);

                if (filas.length > 0){ 
                    let id_empleado = vacaciones[0].id_empleado;
                    const pagoHora = await accesos.consultarPagoDia(id_empleado);
                    let pago_dia = pagoHora[0].monto_por_hora * 8;

                    for (const i of filas) {
                        let dia_solicitado = i.toISOString().slice(0, 10);

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
