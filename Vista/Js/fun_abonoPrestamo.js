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
let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

verificarUsuario ();
cargarAbonos();

//Verifica si el usuario tiene acceso a esta página
function verificarUsuario () {
    const urlAccesos = 'http://localhost:8000/api/accesos/';
    const usuario = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAccesos + usuario)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            
            if (data[0].acc_prestamos !== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};

function mostrarAbonos(abonos) {
    abonos.forEach(a => {
        numPrestamo.textContent = JSON.parse(localStorage.getItem("prestamoid")) || false;
        empleadoA.textContent = a.nombre + ' ' + a.apellido1 + ' ' + a.apellido2;
        fechaA.textContent = new Date(a.fecha_solicitud).toLocaleDateString('es-ES');
        montoOriginal.textContent = colon.format(a.monto_solicitado);
        rebajoA.textContent = colon.format(a.rebajo_salarial);
        datos += `<tr>
                            <td>${a.id_abono}</td>
                            <td>${new Date(a.fecha_abono).toLocaleDateString('es-ES')}</td>
                            <td>${colon.format(a.monto)}</td>
                            <td>${colon.format(a.saldo)}</td>
                        </tr>    
                     `
        saldoA.textContent = colon.format(a.saldo);
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
