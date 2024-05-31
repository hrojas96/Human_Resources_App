'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/prestamos/';
const contenedorPrestamos = document.querySelector('tbody');
const modalPrestamos = new bootstrap.Modal(document.getElementById('modalPrestamos'))
const formPrestamos = document.getElementById('formPrestamos');
const empleado = document.getElementById('empleado');
const fecha = document.getElementById('fecha');
const monto = document.getElementById('monto');
const rebajo = document.getElementById('rebajo');

let opcion = '';
let resultados = '';

verificarUsuario ();
cargarTabla();
cargarEmpleados();

//Verifica si el usuario tiene acceso a esta página
function verificarUsuario () {
    const urlAccesos = 'http://localhost:8000/api/accesos/';
    const usuario = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAccesos + usuario)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            
            if (data[0].acc_prestamos !== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};


// Muestra resultados en cuanto la página carga
function mostrar(prestamos) {
    prestamos[0].forEach(p =>{
        resultados += ` <tr data-fecha="${p.fecha_solicitud.slice(0, 10)}" data-idCliente="${p.id_empleado}" >
                            <td class="text-center">${p.id_prestamo}</td>
                            <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td> 
                            <td class="text-center">${new Date(p.fecha_solicitud).toLocaleDateString('es-ES')}</td>
                            <td class="text-center">${p.monto_solicitado}</td> 
                            <td class="text-center">${p.rebajo_salarial}</td>
                            <td class="text-center">${p.saldo}</td>
                            <td class="centrar"> 
                                <a class="btnAbonos btn btn-primary btn-sm" style="background-color:green; border-color: green;">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </a>
                                <a class="btnEditar btn btn-primary btn-sm" style="background-color:#255387; border-color: #255387;">
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </a>
                                <a class="btnBorrar btn btn-danger btn-sm"> 
                                    <i class="fa-regular fa-trash-can"></i>
                                </a>
                            </td> 
                        </tr>`
    });
    contenedorPrestamos.innerHTML = resultados;
};
//Función para Mostrar resultados
function cargarTabla () {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrar(data))
        
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
    empleado.value = ""; 
    fecha.value = ""; 
    monto.value = ""; 
    rebajo.value = ""; 
    modalPrestamos.show();
    opcion = 'crear';
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

on(document, 'click', '.btnAbonos', e => {
    const fila = e.target.closest('tr');
    let prestamo = fila.children[0].innerHTML;
    localStorage.setItem("prestamoid", JSON.stringify(prestamo));
    window.location.assign("abonoPrestamo.html");
});


//Editar 
let idForm = 0;
on(document, 'click', '.btnEditar', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idForm = fila.children[0].innerHTML;
    const empleadoForm = fila.getAttribute('data-idCliente');
    const fechaForm = fila.getAttribute('data-fecha');
    const montoForm = fila.children[3].innerHTML;
    const rebajoForm = fila.children[4].innerHTML;
   
    empleado.value = empleadoForm;
    fecha.value = fechaForm;
    monto.value = montoForm;
    rebajo.value = rebajoForm;

    opcion = 'editar';
    modalPrestamos.show();
});

//Borrar. 1 parent node toma solo los botones, el 2 toma toda la fila. Se toma el Id para pasarselo al API con target    
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_prestamo = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '&#191;¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_prestamo, {
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
formPrestamos.addEventListener('submit', (e)=> {
    
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
                fecha_solicitud:fecha.value,
                monto_solicitado:monto.value,
                rebajo_salarial:rebajo.value,
                saldo:monto.value,
                
            })
        })
        .then( response => response.json())
        .then( data =>{
            console.log(data);
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
    //Update
    if(opcion == 'editar'){
      
        fetch(url+idForm, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id_empleado:empleado.value,
                fecha_solicitud:fecha.value,
                monto_solicitado:monto.value,
                rebajo_salarial:rebajo.value,
                saldo:monto.value
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
    };
    
    modalPrestamos.hide();

});







