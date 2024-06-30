'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/puestos/';
const contenedorPuestos = document.querySelector('tbody');
const modalPuestos = new bootstrap.Modal(document.getElementById('modalPuestos'))
const formPuestos = document.getElementById('formPuestos');
const puesto = document.getElementById('puesto');
const pagoHora = document.getElementById('pagoHora');
const salarioBase = document.getElementById('salarioBase');
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
            
            if (data[0].acc_mantenimeintos !== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};


//Abre modal con cada uno de los inputs en blanco
btnCrear.addEventListener('click', ()=>{
    
    puesto.value = ""; 
    pagoHora.value = ""; 
    salarioBase.value = ""; 
    modalPuestos.show();
    opcion = 'crear';  
});


//Función para mostrar resultados
function mostrar(puestos) {
    //Se recorre la respuesta enviada por la base de datos y se asigna por filas según corresponda.
    puestos.forEach(p =>{
        resultados += ` <tr data-montoHora="${p.monto_por_hora}" data-salarioBase="${p.salario_base}">
                            <td class="text-center">${p.id_puesto}</td>
                            <td class="text-center">${p.nombre_puesto}</td> 
                            <td class="text-end">${colon.format(p.monto_por_hora)}</td> 
                            <td class="text-end">${colon.format(p.salario_base)}</td>  
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
    contenedorPuestos.innerHTML = resultados;
};

cargar();
// Muestra resultados en cuanto la página carga
function cargar () {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrar(data) )
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
    const puestoForm = fila.children[1].innerHTML;
    const pagoHoraForm = fila.getAttribute('data-montoHora');
    const salarioBaseForm = fila.getAttribute('data-salarioBase');
    
    puesto.value = puestoForm;
    pagoHora.value = pagoHoraForm;
    salarioBase.value = salarioBaseForm;
    
    opcion = 'editar';
    modalPuestos.show();
});

//Borrar.
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_puesto = fila.firstElementChild.innerHTML;
    
    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_puesto, {
            method: 'DELETE'
        })
        .then( res => res.json() )
        .then( ()=> location.reload())
        
    },
    function(){
        alertify.error('Cancelado');
    });
});

//Guarda cambios editados o creados
formPuestos.addEventListener('submit', (e)=> {
    e.preventDefault();  

    //Identifica que la opción que desea hacer el usuario es la inserción de datos
    if (opcion == 'crear'){
        //Realiza una petición post para enviar los datos a la lógica
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                nombre_puesto:puesto.value,
                monto_por_hora:pagoHora.value,
                salario_base:salarioBase.value
            })
        })
        //Recibe una respuesta
        .then( response => response.json())
        .then( data =>{
            //Si la respuesta es un error
            if (data.error) {
                //Muestra el error que ha sido identificado y transformada por la lógica.
                alertify
                    .alert(data.error, function(){
                        alertify.message('OK');
                    });
            } else {
                //Si la inserción fue desarrollada, muestra un mensaje de éxito enviado por la lógica.
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
                nombre_puesto:puesto.value,
                monto_por_hora:pagoHora.value,
                salario_base:salarioBase.value
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
                
                location.reload();
            }
        })
        .catch((error) => console.error("Error en la solicitud:", error));
    };
    
    modalPuestos.hide();

});
