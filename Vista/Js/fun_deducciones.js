'use strict'

//Vareiables cargas sociales
const urlCargasSociales = 'http://localhost:8000/api/cargasSociales/';
const tablaCargasSociales = document.getElementById('tablaCargasSociales');
const modalcargasSalariales = new bootstrap.Modal(document.getElementById('modalcargasSalariales'));
const formCargasSociales = document.getElementById('formCargasSociales');
const cargaSocial = document.getElementById('cargaSocial');
const cobroCargaSocial = document.getElementById('cobroCargaSocial');
let resultados = '';

//Variables renta
const urlRenta = 'http://localhost:8000/api/renta/';
const tablaRenta = document.getElementById('tablaRenta');
const modalRenta = new bootstrap.Modal(document.getElementById('modalRenta'));
const formRenta = document.getElementById('formRenta');
const tramo1 = document.getElementById('tramo1');
const tramo2 = document.getElementById('tramo2');
const cobroRenta = document.getElementById('cobroRenta');
let resultadosx = '';

let opcion = '';

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


//Función para Mostrar resultados de Cargas Sociales
function mostrarCargasSociales(cargasSociales) {
    cargasSociales.forEach(p =>{
        console.log(p);
        resultados += ` <tr>
                            <td class="text-center">${p.id_deduccion}</td>
                            <td class="text-center">${p.concepto}</td> 
                            <td class="text-center">${p.porcentaje_salarial}</td>  
                            <td class="centrar"> 
                                <a class="btnEditar  btn btn-primary btn-sm" id="editarCargaSocial" style="background-color:#255387; border-color: #255387;">
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </a>
                            </td> 
                        </tr>`
    });
    tablaCargasSociales.innerHTML = resultados;
};

//Función para Mostrar resultados de Impuesto de la Renta
function mostrarRenta(impuestos) {
    impuestos.forEach(p =>{
        console.log(p);
        resultadosx += ` <tr data-tramo1="${p.tramo1}" data-tramo2="${p.tramo2}">
                            <td class="text-center">${p.id_impuesto}</td>
                            <td class="text-end">${colon.format(p.tramo1)}</td> 
                            <td class="text-end">${colon.format(p.tramo2)}</td>  
                            <td class="text-center">${p.porcentaje_salarial}</td>  
                            <td class="centrar"> 
                                <a class="btnEditar  btn btn-primary btn-sm" id="editarRenta" style="background-color:#255387; border-color: #255387;">
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </a>
                            </td> 
                        </tr>`
    });
    tablaRenta.innerHTML = resultadosx;
};

cargarCargasSociales();
cargarRenta();

// Muestra resultados cargas sociales
function cargarCargasSociales () {
    fetch(urlCargasSociales)
        .then(response => response.json())
        .then(data => mostrarCargasSociales(data) )
        .catch(error => console.log(error))
};

// Muestra resultados renta
function cargarRenta () {
    fetch(urlRenta)
        .then(response => response.json())
        .then(data => mostrarRenta(data) )
        .catch(error => console.log(error))
};

//Configuración de botones
const on = (element, event, selector, handler) => { 
    //element pasa todo el doc //event el click //selector el bnt borrar //handler lo que se libera
    element.addEventListener(event, e => { 

        if(e.target.closest(selector)){
            handler(e)
        };
    });
};

//Editar Cargas Sociales
let idFormCS = 0;
on(document, 'click', '#editarCargaSocial', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idFormCS = fila.children[0].innerHTML;
    const cargaSocialForm = fila.children[1].innerHTML;
    const cobroCargaSocialForm = fila.children[2].innerHTML;
    
    cargaSocial.value = cargaSocialForm;
    cobroCargaSocial.value = cobroCargaSocialForm;
   
    modalcargasSalariales.show();
});

//Editar Renta 
let idFormRenta = 0;
on(document, 'click', '#editarRenta', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idFormRenta = fila.children[0].innerHTML;
    const tramo1Form = fila.getAttribute('data-tramo1');
    const tramo2Form = fila.getAttribute('data-tramo2');
    const cobroRentaForm = fila.children[3].innerHTML;
    
    tramo1.value = tramo1Form;
    tramo2.value = tramo2Form;
    cobroRenta.value = cobroRentaForm;

    modalRenta.show();
});


//Guardar ediciones cargas sociales
formCargasSociales.addEventListener('submit', (e)=> {
 
    //Previene que se recargue la página
    e.preventDefault();  
    
    fetch(urlCargasSociales+idFormCS, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            porcentaje_salarial:cobroCargaSocial.value
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

    modalcargasSalariales.hide();

});


//Guardar ediciones renta
formRenta.addEventListener('submit', (e)=> {
 
    //Previene que se recargue la página
    e.preventDefault();  
    
    fetch(urlRenta+idFormRenta, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            tramo1:tramo1.value,
            tramo2:tramo2.value,
            porcentaje_salarial:cobroRenta.value,
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
        };
    })
    .catch((error) => console.error("Error en la solicitud:", error));

    modalRenta.hide();

});