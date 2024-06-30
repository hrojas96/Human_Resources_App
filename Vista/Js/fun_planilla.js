'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/planilla/';
const urlrenta = 'http://localhost:8000/api/renta/';
const contenedorPlanilla = document.querySelector('tbody');
const modalPlanilla = new bootstrap.Modal(document.getElementById('modalPlanilla'))
const formPlanillas = document.getElementById('formPlanillas');
const fechaDesde = document.getElementById('fechaDesde');
const fechaHasta = document.getElementById('fechaHasta');

let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });
let opcion = '';
let resultados = '';


verificarUsuario();
cargarTabla();

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

// Muestra resultados en cuanto la página carga
function mostrar(planillas) {
    planillas.forEach(p =>{
        resultados += ` <tr data-idCliente="${p.id_empleado}">
                            <td class="text-center">${p.id_salario}</td>
                            <td class="text-center">${new Date(p.fecha_desde).toLocaleDateString('es-ES')}</td>  
                            <td class="text-center">${new Date(p.fecha_hasta).toLocaleDateString('es-ES')}</td>  
                            <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td>  
                            <td class="text-center">${colon.format(p.monto_cancelado)}</td>  
                            <td class="centrar"> 
                                <a class="btnDesglose btn btn-primary btn-sm" style="background-color:green; border-color: green;">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </a>
                            </td> 
                        </tr>`
    });
    contenedorPlanilla.innerHTML = resultados;
};

//Función para Mostrar resultados
function cargarTabla () {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrar(data))
        
        .catch(error => console.log(error))
};

//Boton de crear abre modal y limpio
nuevaPlanilla.addEventListener('click', ()=>{
    fechaDesde.value = ""; 
    fechaHasta.value = "";  
    modalPlanilla.show();
    opcion = 'crear';
});

//Boton de calcular renta abre modal y limpio
btnRenta.addEventListener('click', ()=>{
    fechaDesde.value = ""; 
    fechaHasta.value = "";  
    modalPlanilla.show();
    opcion = 'renta';
});

//Borra la planilla de una fecha específica
btnBorrar.addEventListener('click', e => {
    fechaDesde.value = ""; 
    fechaHasta.value = "";  
    modalPlanilla.show();
    opcion = 'borrar';
});

//Configuración de botones
const on = (element, event, selector, handler) => { 
    element.addEventListener(event, e => { 

        if(e.target.closest(selector)){
            handler(e)
        };
    });
};

on(document, 'click', '.btnDesglose', e => {
    const fila = e.target.closest('tr');
    let salario = fila.children[0].innerHTML;
    localStorage.setItem("salarioid", JSON.stringify(salario));
    window.location.assign("desgloseSalario.html");
});

//Guardar cambios editados o creados
formPlanillas.addEventListener('submit', (e)=> {
    e.preventDefault();  
    //Insert
    if (opcion == 'crear'){
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                fecha_desde:fechaDesde.value,
                fecha_hasta:fechaHasta.value
                
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

    if (opcion == 'renta'){
        fetch(urlrenta, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                fecha_desde:fechaDesde.value,
                fecha_hasta:fechaHasta.value
                
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



    //Borrar
    if(opcion == 'borrar'){
        
        alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
        function(){

            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    fecha_desde:fechaDesde.value,
                    fecha_hasta:fechaHasta.value
                })
            })
            .then( response => response.json())
            .then( data => {
                console.log(data);
                if (data.error) {
                    console.log('Error recibido:', data.error);
                    alertify
                        .alert('Aviso', data.error, function(){
                            alertify.message('OK');
                        });
                    //alert(data.error)
                } else {
                    console.log('Mensaje recibido:', data.message);
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
    };
    
    modalPlanilla.hide();

});


