'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/liquidaciones/';
const contenedorLiquidaciones = document.querySelector('tbody');
const modalLiquidaciones = new bootstrap.Modal(document.getElementById('modalLiquidaciones'))
const formLiquidaciones = document.getElementById('formLiquidaciones');
const empleado = document.getElementById('empleado');
const fecha = document.getElementById('fecha');
const preaviso = document.getElementById('preaviso');
const motivo = document.getElementById('motivo');

//let opcion = '';
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
            
            if (data[0].acc_liquidacion!== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};


// Muestra resultados en cuanto la página carga
function cargarTabla(liquidaciones) {
    liquidaciones.forEach(p =>{
        resultados += ` <tr data-idCliente="${p.id_empleado}" >
                            <td class="text-center">${p.id_liquidacion}</td>
                            <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td> 
                            <td class="text-center">${new Date(p.fecha).toLocaleDateString('es-ES')}</td>
                            <td class="text-center">${p.pago_vacaciones}</td> 
                            <td class="text-center">${p.pago_preaviso}</td>
                            <td class="text-center">${p.cesantia}</td>
                            <td class="text-center">${p.monto_liquidado}</td>
                            <td class="centrar"> 
                                <a class="btnBorrar btn btn-danger btn-sm"> 
                                    <i class="fa-regular fa-trash-can"></i>
                                </a>
                            </td> 
                        </tr>`
    });
    contenedorLiquidaciones.innerHTML = resultados;
};


//Función para Mostrar resultados
function consultarDatos () {
    fetch(url)
        .then(response => response.json())
        .then(data => cargarTabla(data))
        
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

//Boton de crear abre modal y limpio
btnCrear.addEventListener('click', ()=>{
    cargarEmpleados();
    empleado.value = ""; 
    fecha.value = ""; 
    preaviso.value = ""; 
    motivo.value = ""; 
    modalLiquidaciones.show();
    //opcion = 'crear';
});


//Configuración de botones
const on = (element, event, selector, handler) => { 
    element.addEventListener(event, e => { 

        if(e.target.closest(selector)){
            handler(e)
        };
    });
};


//Borrar. 
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_liquidacion = fila.firstElementChild.innerHTML;
    
    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_liquidacion, {
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
formLiquidaciones.addEventListener('submit', (e)=> {
    //Previene que se recargue la página
    e.preventDefault();  

    //Insert
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id_empleado:empleado.value,
                fecha:fecha.value, 
                preaviso:preaviso.value,
                motivo:motivo.value
                
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
    
    
    modalLiquidaciones.hide();

});