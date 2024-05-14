'use strict'



//Variables

const urlAbonos = 'http://localhost:8000/api/abonoPrestamos/';
const contenedorAbonos = document.querySelector('tbody');
const numPrestamo = document.getElementById('numPrestamo');
const empleadoA = document.getElementById('empleadoA');
const fechaA = document.getElementById('fechaA');
const montoOriginal = document.getElementById('montoOriginal');
const rebajoA = document.getElementById('rebajoA');
const saldoA = document.getElementById('saldoA');
let datos = '';

cargarAbonos();

function mostrarAbonos(abonos) {
    abonos.forEach(a => {
        numPrestamo.textContent = JSON.parse(localStorage.getItem("prestamoid")) || false;
        empleadoA.textContent = a.id_empleado;
        fechaA.textContent = a.fecha_solicitud.slice(0, 10);
        montoOriginal.textContent = a.monto_solicitado;
        rebajoA.textContent = a.rebajo_salarial;
        datos += `<tr>
                            <td>${a.id_abono}</td>
                            <td>${a.fecha_abono.slice(0, 10)}</td>
                            <td>${a.monto}</td>
                            <td>${a.saldo}</td>
                        </tr>    
                     `
        saldoA.textContent = a.saldo;
    });
    contenedorAbonos.innerHTML = datos;
};

function cargarAbonos() {
    const prestamo = JSON.parse(localStorage.getItem("prestamoid")) || false;
    console.log(prestamo);
    fetch(urlAbonos + prestamo)
        .then(response => response.json())
        .then(data => mostrarAbonos(data))

        .catch(error =>console.log(error))
};
