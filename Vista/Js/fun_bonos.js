'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/bonos/';
const contenedorBonos = document.querySelector('tbody');
const modalBonos = new bootstrap.Modal(document.getElementById('modalBonos'))
const formBonos = document.getElementById('formBonos');
const empleado = document.getElementById('empleado');
const fecha = document.getElementById('fecha');
const montoBono = document.getElementById('montoBono');
const razon = document.getElementById('razon');

let opcion = '';
let resultados = '';
let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

verificarUsuario ();
//Verifica si el usuario tiene acceso a esta página
function verificarUsuario () {
    const urlAccesos = 'http://localhost:8000/api/accesos/';
    const usuario = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAccesos + usuario)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            
            if (data[0].acc_planilla !== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};

//Boton de crear abre modal y limpio
btnCrear.addEventListener('click', ()=>{
    empleado.value = ""; 
    fecha.value = ""; 
    montoBono.value = ""; 
    razon.value = ""; 
    modalBonos.show();
    opcion = 'crear';
});

//Función para Mostrar resultados
function mostrar(bonos) {
    bonos.forEach(p =>{
        resultados += ` <tr data-empleado="${p.id_empleado}" 
                            data-fecha="${p.fecha.slice(0, 10)}" 
                            data-montoBono="${p.monto_bono}" >
                            <td class="text-center">${p.id_bono}</td>
                            <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td> 
                            <td class="text-center">${new Date(p.fecha).toLocaleDateString('es-ES')}</td>
                            <td class="text-end">${colon.format(p.monto_bono)}</td> 
                            <td class="text-center">${p.razon}</td>  
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
    contenedorBonos.innerHTML = resultados;
};

cargar();
cargarEmpleados();
// Muestra resultados en cuanto la página carga
function cargar () {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrar(data) )
        .catch(error => console.log(error))
};

//Carga lista de empleados registrados
function cargarEmpleados() {
    fetch("http://localhost:8000/api/empleadosRegistrados/")
        .then(response => response.json())
        .then(data => {
            // Recorre los datos y crea las opciones
            data.forEach((optionData) => {
                // Crea un elemento option
                const opcion = document.createElement("option");

                // Establece el valor y texto de la opción
                opcion.text = `${optionData.nombre} ${optionData.apellido1} ${optionData.apellido2}`;
                opcion.value = optionData.id_empleado;
                // Agrega la opción al elemento select
                empleado.add(opcion);    
            });
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
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
    const empleadoForm = fila.getAttribute('data-empleado');
    const fechaForm = fila.getAttribute('data-fecha');
    const montoBonoForm = fila.getAttribute('data-montoBono');
    const razonForm = fila.children[4].innerHTML;
    
    empleado.value = empleadoForm;
    fecha.value = fechaForm;
    montoBono.value = montoBonoForm;
    razon.value = razonForm;
    
    opcion = 'editar';
    modalBonos.show();
});

//Borrar.
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_bono = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_bono, {
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
formBonos.addEventListener('submit', (e)=> {
 
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
                id_empleado:empleado.value,
                fecha:fecha.value,
                monto_bono:montoBono.value,
                razon:razon.value
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
                id_empleado:empleado.value,
                fecha:fecha.value,
                monto_bono:montoBono.value,
                razon:razon.value
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
    
    modalBonos.hide();

});
