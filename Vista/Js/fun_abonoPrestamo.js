'use strict'



//Variables

const urlAbonos = 'http://localhost:8000/api/abonoPrestamos/';
const contenedorAbonos = document.querySelector('tbody');
const empleado = document.getElementById('empleado');
const fecha = document.getElementById('fecha');
const montoOriginal = document.getElementById('montoOriginal');
const rebajo = document.getElementById('rebajo');
const saldoP = document.getElementById('saldoP');
//const prestamoo = JSON.parse(localStorage.getItem("prestamo")) || false;
let datos = '';
let prestamo = 1;
cargarAbonos();

function mostrar(abonos) {
    //let saldo = 6700;
    abonos.forEach(a => {
        //saldo -= a.monto;
        empleado.textContent = a.id_empleado;
        fecha.textContent = a.fecha_abono;
        montoOriginal.textContent = a.monto_solicitado;
        rebajo.textContent = a.rebajo_salarial;
        datos += `<tr>
                            <td>${a.id_abono}</td>
                            <td>${a.fecha_abono}</td>
                            <td>${a.monto}</td>
                            <td>${a.saldo}</td>
                        </tr>    
                     `
    });
    contenedorAbonos.innerHTML = datos;
};

function cargarAbonos() {
    console.log(prestamo);
    fetch(urlAbonos + prestamo)
        .then(response => response.json())
        .then(data => mostrar(data))

        .catch(error =>console.log(error))
};
