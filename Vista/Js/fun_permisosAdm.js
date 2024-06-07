'use strict'

//VARIABLES 
const url = 'http://localhost:8000/api/permisosAdm/';
const contenedorPermisosAdm = document.getElementById('contenedorPermisosAdm');
const contenedorDeligenciasos = document.getElementById('contenedorDeligenciasos');
const modalPermisosAdm = new bootstrap.Modal(document.getElementById('modalPermisosAdm'))
const formPermisosAdm = document.getElementById('formPermisosAdm');
const desicionRRHH = document.getElementById('desicionRRHH');
const msjRRHH = document.getElementById('msjRRHH');
const derechoPago = document.getElementById('derechoPago');

let resultados = '';
let resultadosx = '';

verificarUsuario ();
consultarDatos();

//Verifica si el usuario tiene acceso a esta página
function verificarUsuario () {
    const urlAccesos = 'http://localhost:8000/api/accesos/';
    const usuario = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAccesos + usuario)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            
            if (data[0].acc_permisos_RRHH!== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};


// Muestra resultados en cuanto la página carga
function cargarTabla(permisos) {
    permisos.forEach(p =>{
        if (p.msj_jefatura == null){
            p.msj_jefatura = " ";
        } if (p.msj_RRHH == null){
            p.msj_RRHH = " ";
        };
        if (p.decision_RRHH == 'Pendiente'){
            resultados += ` <tr data-idCliente="${p.id_empleado}" data-decision_RRHH="${p.decision_RRHH}" data-msj_RRHH"${p.msj_RRHH}">
                                <td class="text-center">${(p.id_permiso)}</td> 
                                <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td>
                                <td class="text-center">${new Date(p.inicio_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(p.final_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${p.msj_empleado}</td>
                                <td class="text-center">${p.decision_jefatura}: ${p.msj_jefatura}</td>
                                <td class="text-center">${p.decision_RRHH}: ${p.msj_RRHH}</td>
                                <td class="text-center">${p.derecho_pago}</td>
                                <td class="centrar"> 
                                    <a class="btnEditar btn btn-primary btn-sm" style="background-color:#255387; border-color: #255387;">
                                        <i class="fa-regular fa-pen-to-square"></i>
                                    </a>
                                </td> 
                            </tr>`
            contenedorPermisosAdm.innerHTML = resultados;
        }else {
            resultadosx += ` <tr data-idCliente="${p.id_empleado}" data-decision_RRHH="${p.decision_RRHH}" data-msj_RRHH"${p.msj_RRHH}">
                                <td class="text-center">${(p.id_permiso)}</td> 
                                <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td>
                                <td class="text-center">${new Date(p.inicio_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(p.final_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${p.msj_empleado}</td>
                                <td class="text-center">${p.decision_jefatura}: ${p.msj_jefatura}</td>
                                <td class="text-center">${p.decision_RRHH}: ${p.msj_RRHH}</td>
                                <td class="text-center">${p.derecho_pago}</td>
                                 
                            </tr>`
            contenedorDeligenciasos.innerHTML = resultadosx;

        }
    });
    
};
//Función para Mostrar resultados
function consultarDatos () {

    fetch(url)
        .then(response => response.json())
        .then(data => cargarTabla(data))
        
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
    const desicionRRHHForm = fila.getAttribute('data-decision_RRHH');
    const msjRRHHForm = fila.getAttribute('data-msj_RRHH');
    const derechoPagoForm = fila.children[7].innerHTML;

    desicionRRHH.value = desicionRRHHForm;
    msjRRHH.value = msjRRHHForm;
    derechoPago.value = derechoPagoForm;


    modalPermisosAdm.show();
});


//Guardar cambios editados o creados
formPermisosAdm.addEventListener('submit', (e)=> {
    e.preventDefault();

    fetch(url+idForm, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            decision_RRHH:desicionRRHH.value,
            msj_RRHH:msjRRHH.value,
            derecho_pago:derechoPago.value,
        })
    })
    .then( response => response.json())
    .then( data =>{
        //console.log(data);
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
    
    modalPermisosAdm.hide();

});