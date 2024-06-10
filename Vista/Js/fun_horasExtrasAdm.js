'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/horasExtrasAdm/';
const contenedorhExtrasAdm = document.getElementById('contenedorhExtrasAdm');
const contenedorDeligenciados = document.getElementById('contenedorDeligenciados');
const modalhorasExtrasAdm = new bootstrap.Modal(document.getElementById('modalhorasExtrasAdm'))
const formHExtrasAdm = document.getElementById('formHExtrasAdm');
const desicionRRHH = document.getElementById('desicionRRHH');

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
            
            if (data[0].acc_horasExtras_RRHH!== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};

// Muestra resultados en cuanto la página carga
function cargarTabla(extras) {
    console.log('hola', extras);
    extras.forEach(e =>{
        
        if (e.decision_RRHH == 'Pendiente'){
            resultados += ` <tr>
                                <td class="text-center">${(e.id_marca)}</td> 
                                <td class="text-center">${new Date(e.fecha).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${e.nombre} ${e.apellido1} ${e.apellido2}</td>
                                <td class="text-center">${e.horas_extras}</td>
                                <td class="text-center">${e.decision_RRHH}</td>
                                <td class="centrar"> 
                                    <a class="btnDecision btn btn-primary btn-sm" style="background-color:green; border-color: #255387;">
                                        Decisión
                                    </a>
                                </td> 
                            </tr>`
            
                contenedorhExtrasAdm.innerHTML = resultados;
        }else{
            resultadosx += ` <tr>
                                <td class="text-center">${(e.id_marca)}</td> 
                                <td class="text-center">${new Date(e.fecha).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${e.nombre} ${e.apellido1} ${e.apellido2}</td>
                                <td class="text-center">${e.horas_extras}</td>
                                <td class="text-center" >${e.decision_RRHH}</td> 
                            </tr>`
            
                contenedorDeligenciados.innerHTML = resultadosx;

        };
    })
};

//Función para consultar datos
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
on(document, 'click', '.btnDecision', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idForm = fila.children[0].innerHTML;
    const desicionRRHHForm = fila.children[3].innerHTML;
    
    desicionRRHH.value = desicionRRHHForm;
    modalhorasExtrasAdm.show();
});

//Guardar cambios editados o creados
formHExtrasAdm.addEventListener('submit', (e)=> {
    e.preventDefault();

    fetch(url+idForm, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            decision_RRHH:desicionRRHH.value
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
    
    modalhorasExtrasAdm.hide();

});
