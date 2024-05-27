'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/permisosJefatura/';
const contenedorPermJefatura = document.querySelector('tbody');
const modalPermJefatura = new bootstrap.Modal(document.getElementById('modalPermJefatura'))
const formPermEmp = document.getElementById('formPermEmp');
const msjJefatura = document.getElementById('msjJefatura');

let resultados = '';


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
        resultados += ` <tr data-idCliente="${p.id_empleado}">
                            <td class="text-center">${(p.id_permiso)}</td> 
                            <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td>
                            <td class="text-center">${new Date(p.inicio_permiso).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${new Date(p.final_permiso).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${p.msj_empleado}</td>
                            <td class="text-center">${p.decision_jefatura}</td>
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
    contenedorPermJefatura.innerHTML = resultados;
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
    // on en un metodo de jquery que sirve para asignar eventos a los elementos del DOM
    //element pasa todo el doc //event el click //selector el bnt borrar //handler lo que se libera
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
    const msjJefaturaForm = fila.children[5].innerHTML;

    msjJefatura.value = msjJefaturaForm;

    modalPermJefatura.show();
});

//Borrar. 1 parent node toma solo los botones, el 2 toma toda la fila. Se toma el Id para pasarselo al API con target    
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_permiso = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '&#191;¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_permiso, {
            method: 'DELETE'
        })
        .then( res => res.json() )
        .then( ()=> location.reload())
        
    },
    function(){
        alertify.error('Cancelado');
    });
});

//Guardar cambios editados o creados
formPermEmp.addEventListener('submit', (e)=> {
 
    fetch(url+idForm, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            decision_jefatura:msjJefatura.value
        })
    })
    .then( response => response.json())
    .then( data =>{
        if (data.error) {
            
            alertify
                .alert(data.error, function(){
                    alertify.message('OK');
                });
            //alert(data.error)
        } else {
            //console.log('algo pasó')
            location.reload();
        }
    })
    .catch((error) => console.error("Error en la solicitud:", error));

    
    modalPermJefatura.hide();

});