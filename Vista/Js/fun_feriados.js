'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/feriados/';
const contenedorFeriados = document.querySelector('tbody');
const modalFeriados = new bootstrap.Modal(document.getElementById('modalFeriados'))
const formFeriados = document.getElementById('formFeriados');
const feriado = document.getElementById('feriado');
const fecha = document.getElementById('fecha');
const derechoPago = document.getElementById('derechoPago');
let opcion = '';
let resultados = '';

verificarUsuario ();
//Verifica si el usuario tiene acceso a esta página
function verificarUsuario () {
    const urlAccesos = 'http://localhost:8000/api/accesos/';
    const usuario = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAccesos + usuario)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            
            if (data[0].acc_mantenimeintos !== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};

//Boton de crear abre modal y limpio
btnCrear.addEventListener('click', ()=>{
    feriado.value = ""; 
    fecha.value = ""; 
    derechoPago.value = ""; 
    modalFeriados.show();
    opcion = 'crear';
});

//Función para Mostrar resultados
function mostrar(feriados) {
    feriados.forEach(p =>{
        resultados += ` <tr data-fecha="${p.fecha_feriado.slice(0, 10)}">
                            <td class="text-center">${p.id_feriado}</td>
                            <td class="text-center">${p.nombre_feriado}</td> 
                            <td class="text-center">${new Date(p.fecha_feriado).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${p.pago_obligatorio}</td>  
                            <td class="centrar"> 
                                <a class="btnEditar btn btn-primary btn-sm" style="background-color:#255387; border-color: #255387;">
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </a>
                                <a class="btnBorrar btn btn-danger btn-sm"> 
                                    <i class="fa-regular fa-trash-can"></i>
                                </a>
                            </td> 
                        </tr>`
    });
    contenedorFeriados.innerHTML = resultados;
};

cargar();
// Muestra resultados en cuanto la página carga
function cargar () {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrar(data) )
        .catch(error => console.log(error))
};

//Configuración de botones
const on = (element, event, selector, handler) => { 

    element.addEventListener(event, e => { 

        if(e.target.closest(selector)){
            handler(e)
        };
    });
};

//Editar 
let idForm = 0;
on(document, 'click', '.btnEditar', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idForm = fila.children[0].innerHTML;
    const feriadoForm = fila.children[1].innerHTML;
    const fechaForm = fila.getAttribute('data-fecha');
    const derechoPagoForm = fila.children[3].innerHTML;
    
    feriado.value = feriadoForm;
    fecha.value = fechaForm;
    derechoPago.value = derechoPagoForm;
    
    opcion = 'editar';
    modalFeriados.show();
});

//Borrar.
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_feriado = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_feriado, {
            method: 'DELETE'
        })
        .then( res => res.json() )
        .then( data =>{
            console.log(data);
            if (data.error) {
                
                alertify
                    .alert('Aviso', data.error, function(){
                        alertify.message('OK');
                    });
                //alert(data.error)
            } else {
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
});

//Guardar cambios editados o creados
formFeriados.addEventListener('submit', (e)=> {
 
    //Previene que se recargue la página
    e.preventDefault();  
    //Insert
    if (opcion == 'crear'){
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                nombre_feriado:feriado.value,
                fecha_feriado:fecha.value,
                pago_obligatorio:derechoPago.value
            })
        })
        .then( response => response.json())
        .then( data =>{
            if (data.error) {
                
                alertify
                    .alert('Aviso', data.error, function(){
                        alertify.message('OK');
                    });
                //alert(data.error)
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
    //Update
    if(opcion == 'editar'){
        fetch(url+idForm, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                nombre_feriado:feriado.value,
                fecha_feriado:fecha.value,
                pago_obligatorio:derechoPago.value
            })
        })
        .then( response => response.json())
        .then( data =>{
            if (data.error) {
                
                alertify
                    .alert('Aviso', data.error, function(){
                        alertify.message('OK');
                    });
                //alert(data.error)
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
    
    modalFeriados.hide();

});
