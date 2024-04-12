'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/puestos/';
const contenedorPuestos = document.querySelector('tbody');
const modalPuestos = new bootstrap.Modal(document.getElementById('modalPuestos'))
const formEmpleados = document.querySelector('form');
const puesto = document.getElementById('puesto');
const salarioBase = document.getElementById('salarioBase');

let resultados = '';

//Función para Mostrar resultados
const mostrar = (puestos) =>{
    puestos.forEach(p =>{
        resultados += ` <tr>
                            <td>${p.id_puesto}</td>
                            <td>${p.nombre_puesto}</td> 
                            <td>${p.monto_por_hora}</td>   
                            <td class="text-center"> <a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td> 
                        </tr>`
    });
    contenedorPuestos.innerHTML = resultados;
};

cargar();
// Muestra resultados en cuanto la página carga
function cargar () {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrar(data) )
        .catch(error => alert(error))
};