'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/horasExtrasUsr/';
const contenedorHorasExtrasUsr = document.getElementById('contenedorHorasExtrasUsr');
const contenedorDeligenciados = document.getElementById('contenedorDeligenciados');
const formPermisosUsr = document.getElementById('formPermisosUsr');
const empleado = JSON.parse(localStorage.getItem("userID")) || false;
const estado = 'Solicitado';


let opcion = '';
let resultados = '';
let resultadosx = '';

consultarDatos();


// Muestra resultados en cuanto la página carga
function cargarTabla(extras) {
    extras.forEach(e =>{

        if (e.estado == 'Pendiente') {
        resultados += ` <tr>
                            <td class="text-center">${(e.id_marca)}</td> 
                            <td class="text-center">${new Date(e.fecha).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${e.horas_extras}</td>
                            <td class="text-center">${e.estado}</td>
                            <td class="centrar"> 
                                <a class="btnSolicitar btn btn-primary btn-sm" style="background-color:green; border-color: #255387;">
                                    Solicitar Pago
                                </a>
                            </td> 
                        </tr>`
        contenedorHorasExtrasUsr.innerHTML = resultados;
        } else {
            resultadosx += ` <tr>
                            <td class="text-center">${(e.id_marca)}</td> 
                            <td class="text-center">${new Date(e.fecha).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${e.horas_extras}</td>
                            <td class="text-center">${e.estado}</td>
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
on(document, 'click', '.btnSolicitar', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idForm = fila.children[0].innerHTML;
    const hExtras = fila.children[2].innerHTML;

    alertify.confirm('Alerta', '¿Desea solicitar el pago de ' + hExtras + ' horas extras?',
    function(){

        fetch(url + idForm, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                estado:estado
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
    },
    function(){
        alertify.error('Cancelado');
    });
});

