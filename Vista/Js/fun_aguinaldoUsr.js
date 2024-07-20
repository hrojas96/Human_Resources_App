'use strict'

//Variables

const urlAbonos = 'http://localhost:8000/api/aguinaldoUsr/';
const contenedorAguinaldoUsr = document.querySelector('tbody');
let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

let resultados = '';

cargarSalarios();


function mostrarSalarios(salarios) {
    salarios.forEach(a => {
        resultados += `<tr>
                            <td class="text-center">${a.id_aguinaldo}</td>
                            <td class="text-center">${new Date(a.fecha_desde).toLocaleDateString('es-ES')}</td>
                            <td class="text-center">${new Date(a.fecha_hasta).toLocaleDateString('es-ES')}</td>
                            <td class="text-end">${colon.format(a.monto_pagado)}</td>
                            <td class="centrar"> 
                                <a class="btnDesglose btn btn-primary btn-sm" style="background-color:green; border-color: green;">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </a>
                            </td>
                        </tr>    
                     `
    });
    contenedorAguinaldoUsr.innerHTML = resultados;
};

function cargarSalarios() {
    const empleado = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAbonos + empleado)
        .then(response => response.json())
        .then(data => mostrarSalarios(data))

        .catch(error =>console.log(error))
};

//Configuración de botones
const on = (element, event, selector, handler) => { 
    element.addEventListener(event, e => { 

        if(e.target.closest(selector)){
            handler(e)
        };
    });
};

on(document, 'click', '.btnDesglose', e => {
    const fila = e.target.closest('tr');
    let aguinaldo = fila.children[0].innerHTML;
    localStorage.setItem("aguinaldoid", JSON.stringify(aguinaldo));
    window.location.assign("desgloseAguinaldo.html");
});