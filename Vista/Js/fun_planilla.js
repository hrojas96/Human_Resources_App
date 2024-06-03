'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/planilla/';
const contenedorPlanilla = document.querySelector('tbody');
const modalPlanilla = new bootstrap.Modal(document.getElementById('modalPlanilla'))
const formPlanillas = document.getElementById('formPlanillas');
const fechaDesde = document.getElementById('fechaDesde');
const fechaHasta = document.getElementById('fechaHasta');
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
                            <td class="text-center">${p.monto_cancelado}</td>  
                            <td class="centrar"> 
                                <a class="btnAbonos btn btn-primary btn-sm" style="background-color:green; border-color: green;">
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
    fechaDesde.value = "23/12/2003"; 
    fechaHasta.value = "";  
    modalPlanilla.show();
    opcion = 'crear';
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
    // on en un metodo de jquery que sirve para asignar eventos a los elementos del DOM
    //element pasa todo el doc //event el click //selector el bnt borrar //handler lo que se libera
    element.addEventListener(event, e => { 

        if(e.target.closest(selector)){
            handler(e)
        };
    });
};

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
                
                alertify.alert(data.error, function(){
                        alertify.message('OK');
                    });
                
            } else {
                location.reload();
            }
        })
        .catch((error) => console.error("Error en la solicitud:", error));
    };

    //Borrar
    if(opcion == 'borrar'){
        
        alertify.confirm('Alerta', '&#191;¿Seguro que desea borrar este registro?',
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
            .then( res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok ' + res.statusText);
                }
                return res.json();
            })
            .then( ()=> location.reload())
            
        },
        function(){
            alertify.error('Cancelado');
        });
    };
    
    modalPlanilla.hide();

});


