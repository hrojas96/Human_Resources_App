'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/vacacionesUsr/';
const contenedorVacacionesUsr = document.getElementById('contenedorVacacionesUsr');
const contenedorDeligenciados = document.getElementById('contenedorDeligenciados');
const modalVacacionesUsr = new bootstrap.Modal(document.getElementById('modalVacacionesUsr'))
const formVacacionesUsr = document.getElementById('formVacacionesUsr');
const empleado = JSON.parse(localStorage.getItem("userID")) || false;
const fechaInicio = document.getElementById('fechaInicio');
const fechaFinal = document.getElementById('fechaFinal');
const diasDisponibles = document.getElementById('diasDisponibles');

let opcion = '';
let resultados = '';
let resultadosx = '';

consultarDatos();


// Muestra resultados en cuanto la página carga
function cargarTabla(vacaciones) {
    
    vacaciones.forEach(v =>{
        diasDisponibles.value = v.dias_acumulados.toFixed(1);
        if (v.id_vacaciones === null) {
            return;  
        }
        if (v.msj_jefatura == null || v.msj_RRHH == null ){
            v.msj_jefatura = " ";
            v.msj_RRHH = " "
        }
        if (v.decision_jefatura == 'Pendiente' && v.decision_RRHH == 'Pendiente'){
            resultados += ` <tr data-fechaInicio="${v.inicio_vacacion.slice(0, 10)}" data-fechaFinal="${v.final_vacacion.slice(0, 10)}">
                                <td class="text-center">${(v.id_vacaciones)}</td> 
                                <td class="text-center">${new Date(v.inicio_vacacion).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(v.final_vacacion).toLocaleDateString('es-ES')}</td>
                                <td class="text-center">${v.cant_dias_solicitados}</td>
                                <td class="text-center">${v.decision_jefatura}: ${v.msj_jefatura}</td> 
                                <td class="text-center">${v.decision_RRHH}: ${v.msj_RRHH}</td> 
                                <td class="centrar"> 
                                    <a class="btnEditar btn btn-primary btn-sm" style="background-color:#255387; border-color: #255387;">
                                        <i class="fa-regular fa-pen-to-square"></i>
                                    </a>
                                    <a class="btnBorrar btn btn-danger btn-sm"> 
                                        <i class="fa-regular fa-trash-can"></i>
                                    </a>
                                </td> 
                            </tr>`
             
            contenedorVacacionesUsr.innerHTML = resultados; 
        } else {
            resultadosx += ` <tr>
                                <td class="text-center">${(v.id_vacaciones)}</td> 
                                <td class="text-center">${new Date(v.inicio_vacacion).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(v.final_vacacion).toLocaleDateString('es-ES')}</td>
                                <td class="text-center">${v.cant_dias_solicitados}</td>
                                <td class="text-center">${v.decision_jefatura}: ${v.msj_jefatura}</td> 
                                <td class="text-center">${v.decision_RRHH}: ${v.msj_RRHH}</td> 
                                
                            </tr>`
            
            contenedorDeligenciados.innerHTML = resultadosx;
            
        } 
    });
    
};


//Función para Mostrar resultados
function consultarDatos () {
    fetch(url + empleado)
        .then(response => response.json())
        .then(data => cargarTabla(data))
        
        .catch(error => console.log(error))
};

//Boton de crear abre modal y limpio
btnCrear.addEventListener('click', ()=>{
    
    fechaInicio.value = ""; 
    fechaFinal.value = ""; 
    modalVacacionesUsr.show();
    opcion = 'crear';
});

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
    const fechaInicioForm = fila.getAttribute('data-fechaInicio');
    const fechaFinalForm = fila.getAttribute('data-fechaFinal');

    fechaInicio.value = fechaInicioForm;
    fechaFinal.value = fechaFinalForm;
    opcion = 'editar';
    modalVacacionesUsr.show();
});

//Borrar. 1 parent node toma solo los botones, el 2 toma toda la fila. Se toma el Id para pasarselo al API con target    
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_vacaciones = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_vacaciones, {
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
formVacacionesUsr.addEventListener('submit', (e)=> {
    //Previene que se recargue la página
    e.preventDefault();  
    const pendiente = 'Pendiente';

    //Insert
    if (opcion == 'crear'){
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id_empleado:empleado,
                inicio_vacacion:fechaInicio.value,
                final_vacacion:fechaFinal.value,
                decision_jefatura:pendiente,
                decision_RRHH:pendiente,
                diasDisponibles:diasDisponibles.value
                
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
                id_empleado:empleado,
                inicio_vacacion:fechaInicio.value,
                final_vacacion:fechaFinal.value,
                decision_jefatura:pendiente,
                decision_RRHH:pendiente,
                diasDisponibles:diasDisponibles.value
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
    
    modalVacacionesUsr.hide();

});