'use strict'

//VARIABLES 
const url = 'http://localhost:8000/api/vacacionesJef/';
const contenedorVacacionesJef = document.getElementById('contenedorVacacionesJef');
const contenedorDeligenciasos = document.getElementById('contenedorDeligenciasos');
const modalVacacionesJef = new bootstrap.Modal(document.getElementById('modalVacacionesJef'))
const formVacacionesJef = document.getElementById('formVacacionesJef');
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
            
            if (data[0].acc_vacaciones_jefatura!== 1) {
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
        if (v.decision_jefatura == 'Pendiente'){
            resultados += ` <tr data-decision_jefatura="${v.decision_jefatura}" data-msj_jefatura"${v.msj_jefatura}">
                                <td class="text-center">${(v.id_vacaciones)}</td> 
                                <td class="text-center">${v.nombre} ${v.apellido1} ${v.apellido2}</td>
                                <td class="text-center">${new Date(v.inicio_vacacion).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(v.final_vacacion).toLocaleDateString('es-ES')}</td>
                                <td class="text-center">${v.decision_jefatura}. ${v.msj_jefatura}</td>  
                                <td class="centrar"> 
                                    <a class="btnDecision btn btn-primary btn-sm" style="background-color:green; border-color: #255387;">
                                    Decisión
                                    </a>
                                </td> 
                            </tr>`
            contenedorVacacionesJef.innerHTML = resultados;
        } else{
            resultadosx += ` <tr>
                            <td class="text-center">${(v.id_vacaciones)}</td> 
                            <td class="text-center">${v.nombre} ${v.apellido1} ${v.apellido2}</td>
                            <td class="text-center">${new Date(v.inicio_vacacion).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${new Date(v.final_vacacion).toLocaleDateString('es-ES')}</td>
                            <td class="text-center">${v.decision_jefatura}. ${v.msj_jefatura}</td> 
                            <td class="text-center">${v.decision_RRHH}. ${v.msj_RRHH}</td> 
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
on(document, 'click', '.btnDecision', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idForm = fila.children[0].innerHTML;
    const desicionJefaturaForm = fila.getAttribute('data-decision_jefatura');
    const msjJefaturaForm = fila.getAttribute('data-msj_jefatura');

    desicionJefatura.value = desicionJefaturaForm;
    msjJefatura.value = msjJefaturaForm;

    modalVacacionesJef.show();
});


//Guardar cambios editados o creados
formVacacionesJef.addEventListener('submit', (e)=> {
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
    
    modalVacacionesJef.hide();

});