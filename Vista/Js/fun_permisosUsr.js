'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/permisosEmpl/';
const contenedorPermisosUsr = document.getElementById('contenedorPermisosUsr');
const contenedorDeligenciados = document.getElementById('contenedorDeligenciados');
const modalPermisosUsr = new bootstrap.Modal(document.getElementById('modalPermisosUsr'))
const formPermisosUsr = document.getElementById('formPermisosUsr');
const empleado = JSON.parse(localStorage.getItem("userID")) || false;
const fechaInicio = document.getElementById('fechaInicio');
const fechaFinal = document.getElementById('fechaFinal');
const msjEmp = document.getElementById('msjEmp');

let opcion = '';
let resultados = '';
let resultadosx = '';

consultarDatos();


// Muestra resultados en cuanto la página carga
function cargarTabla(permisos) {
    permisos.forEach(p =>{
        if (p.msj_jefatura == null || p.msj_RRHH == null ){
            p.msj_jefatura = " ";
            p.msj_RRHH = " "
        }
        if (p.decision_jefatura == 'Pendiente' || p.decision_RRHH == 'Pendiente'){
            resultados += ` <tr data-fechaInicio="${p.inicio_permiso.slice(0, 10)}" data-fechaFinal="${p.final_permiso.slice(0, 10)}">
                                <td class="text-center">${(p.id_permiso)}</td> 
                                <td class="text-center">${new Date(p.inicio_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(p.final_permiso).toLocaleDateString('es-ES')}</td>
                                <td class="text-center">${p.cant_dias_solicitados}</td>
                                <td class="text-center">${p.msj_empleado}</td>
                                <td class="text-center">${p.decision_jefatura}: ${p.msj_jefatura}</td> 
                                <td class="text-center">${p.decision_RRHH}: ${p.msj_RRHH}</td> 
                                <td class="text-center">${p.derecho_pago}</td>
                                <td class="centrar"> 
                                    <a class="btnEditar btn btn-primary btn-sm" style="background-color:#255387; border-color: #255387;">
                                        <i class="fa-regular fa-pen-to-square"></i>
                                    </a>
                                    <a class="btnBorrar btn btn-danger btn-sm"> 
                                        <i class="fa-regular fa-trash-can"></i>
                                    </a>
                                </td> 
                            </tr>`
            contenedorPermisosUsr.innerHTML = resultados;
        }else{
            resultadosx += ` <tr>
                                <td class="text-center">${(p.id_permiso)}</td> 
                                <td class="text-center">${new Date(p.inicio_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(p.final_permiso).toLocaleDateString('es-ES')}</td>
                                <td class="text-center">${p.cant_dias_solicitados}</td>
                                <td class="text-center">${p.msj_empleado}</td>
                                <td class="text-center">${p.decision_jefatura}: ${p.msj_jefatura}</td> 
                                <td class="text-center">${p.decision_RRHH}: ${p.msj_RRHH}</td> 
                                <td class="text-center">${p.derecho_pago}</td>
                                
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
    msjEmp.value = ""; 
    modalPermisosUsr.show();
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
    const msjEmpForm = fila.children[4].innerHTML;

    fechaInicio.value = fechaInicioForm;
    fechaFinal.value = fechaFinalForm;
    msjEmp.value = msjEmpForm;
    opcion = 'editar';
    modalPermisosUsr.show();
});

//Borrar. 1 parent node toma solo los botones, el 2 toma toda la fila. Se toma el Id para pasarselo al API con target    
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_permiso = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_permiso, {
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
formPermisosUsr.addEventListener('submit', (e)=> {
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
                inicio_permiso:fechaInicio.value,
                final_permiso:fechaFinal.value,
                msj_empleado:msjEmp.value,
                decision_jefatura:pendiente,
                decision_RRHH:pendiente,
                derecho_pago:pendiente
                
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
                inicio_permiso:fechaInicio.value,
                final_permiso:fechaFinal.value,
                msj_empleado:msjEmp.value,
                decision_jefatura:pendiente,
                decision_RRHH:pendiente,
                derecho_pago:pendiente
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
    
    modalPermisosUsr.hide();

});