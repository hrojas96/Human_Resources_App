'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/aguinaldos/';
const contenedorAguinaldo = document.querySelector('tbody');
const modalAguinaldo = new bootstrap.Modal(document.getElementById('modalAguinaldo'))
const formAguinaldo = document.getElementById('formAguinaldo');
const fechaDesde = document.getElementById('fechaDesde');
const fechaHasta = document.getElementById('fechaHasta');
let opcion = '';
let resultados = '';


verificarUsuario();
cargarTabla();

//Verifica si el usuario tiene acceso a esta página
function verificarUsuario () {
    const urlAccesos = 'http://localhost:8000/api/accesos/';
    const usuario = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAccesos + usuario)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            
            if (data[0].acc_aguinaldo !== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};

// Muestra resultados en cuanto la página carga
function mostrar(aguinaldos) {
    aguinaldos.forEach(a =>{
        resultados += ` <tr data-idCliente="${a.id_empleado}">
                            <td class="text-center">${a.id_aguinaldo}</td>
                            <td class="text-center">${new Date(a.fecha_desde).toLocaleDateString('es-ES')}</td>  
                            <td class="text-center">${new Date(a.fecha_hasta).toLocaleDateString('es-ES')}</td>  
                            <td class="text-center">${a.nombre} ${a.apellido1} ${a.apellido2}</td>  
                            <td class="text-center">${a.monto_pagado}</td>  
                            <td class="centrar"> 
                                <a class="btnAbonos btn btn-primary btn-sm" style="background-color:green; border-color: green;">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </a>
                            </td> 
                        </tr>`
    });
    contenedorAguinaldo.innerHTML = resultados;
};

//Función para Mostrar resultados
function cargarTabla () {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrar(data))
        
        .catch(error => console.log(error))
};

//Boton de crear abre modal y limpio
nuevoAguinaldo.addEventListener('click', ()=>{
    fechaDesde.value = "23/12/2003"; 
    fechaHasta.value = "";  
    modalAguinaldo.show();
    opcion = 'crear';
});

//Borra los aguinaldos de una fecha específica
btnBorrar.addEventListener('click', e => {
    fechaDesde.value = ""; 
    fechaHasta.value = "";  
    modalAguinaldo.show();
    opcion = 'borrar';
});

//Configuración de botones
const on = (element, event, selector, handler) => { 
    // on en un metodo de jquery que sirve para asignar eventos a los elementos del DOM
    //element pasa todo el doc //event el click //selector el bnt borrar //handler lo que se libera
    element.addEventListener(event, e => { 

        if(e.target.closest(selector)){
            handler(e)
        };
    });
};

//Guardar cambios editados o creados
formAguinaldo.addEventListener('submit', (e)=> {
    e.preventDefault();  
    //Insert
    if (opcion == 'crear'){
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                fecha_desde:fechaDesde.value,
                fecha_hasta:fechaHasta.value
                
            })
        })
        .then( response => response.json())
        .then( data =>{
            console.log(data);
            if (data.error) {
            
                alertify
                    .alert('Aviso', data.error, function(){
                        alertify.message('OK');
                    });
                
            } else {
                alertify
                    .alert('Aviso', data.message, function(){
                        alertify.message('OK');
                        location.reload();
                    });
            }
        })
        .catch((error) => console.error("Error en la solicitud:", error));
    };

    //Borrar
    if(opcion == 'borrar'){
        
        alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
        function(){

            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    fecha_desde:fechaDesde.value,
                    fecha_hasta:fechaHasta.value
                })
            })
            .then( response => response.json())
            .then( data => {
                console.log(data);
                if (data.error) {
                    console.log('Error recibido:', data.error);
                    alertify
                        .alert('Aviso', data.error, function(){
                            alertify.message('OK');
                        });
                    //alert(data.error)
                } else {
                    console.log('Mensaje recibido:', data.message);
                    alertify
                        .alert('Aviso', data.message, function(){
                            alertify.message('OK');
                            location.reload();
                        });
                }
            })
            .catch((error) => console.error("Error en la solicitud:", error));
            
        },
        function(){
            alertify.error('Cancelado');
        });
    };
    
    modalAguinaldo.hide();

});


