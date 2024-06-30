'use strict'

//Variables

const urlAbonos = 'http://localhost:8000/api/planillaUsr/';
const contenedorPlanillaUsr = document.querySelector('tbody');
let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

let resultados = '';

cargarSalarios();


function mostrarSalarios(salarios) {
    salarios.forEach(a => {
        resultados += `<tr>
                            <td>${a.id_salario}</td>
                            <td>${a.fecha_desde.slice(0, 10)}</td>
                            <td>${a.fecha_hasta}</td>
                            <td class="text-end">${colon.format(a.monto_cancelado)}</td>
                            <td class="centrar"> 
                                <a class="btnDesglose btn btn-primary btn-sm" style="background-color:green; border-color: green;">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </a>
                            </td>
                        </tr>    
                     `
    });
    contenedorPlanillaUsr.innerHTML = resultados;
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
    let salario = fila.children[0].innerHTML;
    localStorage.setItem("salarioid", JSON.stringify(salario));
    window.location.assign("desgloseSalario.html");
});