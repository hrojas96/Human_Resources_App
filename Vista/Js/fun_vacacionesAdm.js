'use strict'

//VARIABLES 
const url = 'http://localhost:8000/api/vacacionesAdm/';
const contenedorVacacionesAdm = document.getElementById('contenedorVacacionesAdm');
const contenedorDeligenciasos = document.getElementById('contenedorDeligenciasos');
const modalVacacionesAdm = new bootstrap.Modal(document.getElementById('modalVacacionesAdm'))
const formVacacionesAdm = document.getElementById('formVacacionesAdm');
const desicionRRHH = document.getElementById('desicionRRHH');
const msjRRHH = document.getElementById('msjRRHH');

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
            
            if (data[0].acc_vacaciones_RRHH!== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};

// Muestra resultados en cuanto la página carga
function cargarTabla(vacaciones) {
    
    vacaciones.forEach(v =>{
        
        if (v.msj_jefatura == null || v.msj_RRHH == null ){
            v.msj_jefatura = " ";
            v.msj_RRHH = " "
        }
        if (v.decision_jefatura == 'Aprobado' && v.decision_RRHH == 'Pendiente'){
            resultados += ` <tr data-decision_RRHH="${v.decision_RRHH}" data-msj_RRHH"${v.msj_RRHH}">
                                <td class="text-center">${(v.id_vacaciones)}</td> 
                                <td class="text-center">${v.nombre} ${v.apellido1} ${v.apellido2}</td>
                                <td class="text-center">${new Date(v.inicio_vacacion).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(v.final_vacacion).toLocaleDateString('es-ES')}</td>
                                <td class="text-center">${v.decision_jefatura}: ${v.msj_jefatura}</td> 
                                <td class="text-center">${v.decision_RRHH}: ${v.msj_RRHH}</td>   
                                <td class="centrar"> 
                                    <a class="btnDecision btn btn-primary btn-sm" style="background-color:green; border-color: #255387;">
                                    Decisión
                                    </a>
                                </td> 
                            </tr>`
            contenedorVacacionesAdm.innerHTML = resultados;
        } else{
            resultadosx += ` <tr>
                            <td class="text-center">${(v.id_vacaciones)}</td> 
                            <td class="text-center">${v.nombre} ${v.apellido1} ${v.apellido2}</td>
                            <td class="text-center">${new Date(v.inicio_vacacion).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${new Date(v.final_vacacion).toLocaleDateString('es-ES')}</td>
                            <td class="text-center">${v.decision_jefatura}: ${v.msj_jefatura}</td> 
                            <td class="text-center">${v.decision_RRHH}: ${v.msj_RRHH}</td> 
                            </tr>`
            contenedorDeligenciasos.innerHTML = resultadosx;

        }

    });
    
   
};

//Función para Mostrar resultados
function consultarDatos () {
    console.log('funciones');
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
on(document, 'click', '.btnDecision', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idForm = fila.children[0].innerHTML;
    const desicionRRHHForm = fila.getAttribute('data-decision_RRHH');
    const msjRRHHForm = fila.getAttribute('data-msj_RRHH');

    desicionRRHH.value = desicionRRHHForm;
    msjRRHH.value = msjRRHHForm;

    modalVacacionesAdm.show();
});


//Guardar cambios editados o creados
formVacacionesAdm.addEventListener('submit', (e)=> {
    e.preventDefault();

    fetch(url+idForm, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            decision_RRHH:desicionRRHH.value,
            msj_RRHH:msjRRHH.value
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
    
    modalVacacionesAdm.hide();

});