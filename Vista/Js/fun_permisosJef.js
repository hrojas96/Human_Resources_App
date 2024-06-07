'use strict'

//VARIABLES 
const url = 'http://localhost:8000/api/permisosJefatura/';
const contenedorPermisosJef = document.getElementById('contenedorPermisosJef');
const contenedorDeligenciasos = document.getElementById('contenedorDeligenciasos');
const modalPermisosJef = new bootstrap.Modal(document.getElementById('modalPermisosJef'))
const formPermisosJef = document.getElementById('formPermisosJef');
const desicionJefatura = document.getElementById('desicionJefatura');
const msjJefatura = document.getElementById('msjJefatura');

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
            
            if (data[0].acc_permisos_jefatura!== 1) {
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
        if (p.decision_jefatura == 'Pendiente'){
            resultados += ` <tr data-idCliente="${p.id_empleado}" data-decision_jefatura="${p.decision_jefatura}" data-msj_jefatura"${p.msj_jefatura}">
                                <td class="text-center">${(p.id_permiso)}</td> 
                                <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td>
                                <td class="text-center">${new Date(p.inicio_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(p.final_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${p.msj_empleado}</td>
                                <td class="text-center">${p.decision_jefatura}: ${p.msj_jefatura}</td>
                                <td class="text-center">${p.decision_RRHH}: ${p.msj_RRHH}</td>
                                <td class="centrar"> 
                                    <a class="btnEditar btn btn-primary btn-sm" style="background-color:#255387; border-color: #255387;">
                                        <i class="fa-regular fa-pen-to-square"></i>
                                    </a>
                                </td> 
                            </tr>`
            contenedorPermisosJef.innerHTML = resultados;
        } else{
            resultadosx += ` <tr data-idCliente="${p.id_empleado}" data-decision_jefatura="${p.decision_jefatura}" data-msj_jefatura"${p.msj_jefatura}">
                                <td class="text-center">${(p.id_permiso)}</td> 
                                <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td>
                                <td class="text-center">${new Date(p.inicio_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(p.final_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${p.msj_empleado}</td>
                                <td class="text-center">${p.decision_jefatura}: ${p.msj_jefatura}</td>
                                <td class="text-center">${p.decision_RRHH}: ${p.msj_RRHH}</td> 
                            </tr>`
            contenedorDeligenciasos.innerHTML = resultadosx;

        }

    });
    
   
};

//Función para Mostrar resultados
function consultarDatos () {
    const id_jefatura = JSON.parse(localStorage.getItem("userID")) || false;
    console.log('funciones');
    fetch(url + id_jefatura)
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
    const desicionJefaturaForm = fila.getAttribute('data-decision_jefatura');
    const msjJefaturaForm = fila.getAttribute('data-msj_jefatura');

    desicionJefatura.value = desicionJefaturaForm;
    msjJefatura.value = msjJefaturaForm;

    modalPermisosJef.show();
});


//Guardar cambios editados o creados
formPermisosJef.addEventListener('submit', (e)=> {
    e.preventDefault();

    fetch(url+idForm, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            decision_jefatura:desicionJefatura.value,
            msj_jefatura:msjJefatura.value
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
    
    modalPermisosJef.hide();

});