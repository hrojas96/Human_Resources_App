'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/listaRenta/';
const contenedorRenta = document.querySelector('tbody');
const modalRenta = new bootstrap.Modal(document.getElementById('modalRenta'))
const formRenta = document.getElementById('formRenta');
const empleado = document.getElementById('empleado');
const fechaDesde = document.getElementById('fechaDesde');
const fechaHasta = document.getElementById('fechaHasta');
const monto = document.getElementById('monto');
const rebajo = document.getElementById('rebajo');
const saldo = document.getElementById('saldo');

let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

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
            
            if (data[0].acc_planilla !== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};

// Muestra resultados en cuanto la página carga
function mostrar(restas) {
    restas.forEach(p =>{
        resultados += ` <tr data-fechaDesde="${p.fecha_desde.slice(0, 10)}"
                            data-fechaHasta="${p.fecha_hasta.slice(0, 10)}"  
                            data-idCliente="${p.id_empleado}" 
                            data-monto="${p.monto_por_cobrar}" 
                            data-rebajo="${p.rebajo_semanal}" >
                            <td class="text-center">${p.id_rentaxc}</td>
                            <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td> 
                            <td class="text-center">${new Date(p.fecha_desde).toLocaleDateString('es-ES')}</td>
                            <td class="text-center">${new Date(p.fecha_hasta).toLocaleDateString('es-ES')}</td>
                            <td class="text-end">${colon.format(p.monto_por_cobrar)}</td> 
                            <td class="text-end">${colon.format(p.rebajo_semanal)}</td>
                            <td class="text-end">${colon.format(p.saldo_renta)}</td>
                            <td class="centrar"> 
                                <a class="btnAbonos btn btn-primary btn-sm" style="background-color:green; border-color: green;">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </a>
                            
                        `;
        // Añadir botones solo si monto_solicitado es igual a saldo
        if (p.monto_por_cobrar === p.saldo_renta) {
            resultados += `
                                <a class="btnEditar btn btn-primary btn-sm" style="background-color:#255387; border-color: #255387;">
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </a>
                                <a class="btnBorrar btn btn-danger btn-sm"> 
                                    <i class="fa-regular fa-trash-can"></i>
                                </a>`;
        }
        resultados += `</td> 
                        </tr>`;
    });
    contenedorRenta.innerHTML = resultados;
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

//Configuración de botones
const on = (element, event, selector, handler) => { 
    element.addEventListener(event, e => { 

        if(e.target.closest(selector)){
            handler(e)
        };
    });
};

on(document, 'click', '.btnAbonos', e => {
    const fila = e.target.closest('tr');
    let renta = fila.children[0].innerHTML;
    localStorage.setItem("rentaid", JSON.stringify(renta));
    window.location.assign("facturacionRenta.html");
});


//Editar 
let idForm = 0;
on(document, 'click', '.btnEditar', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idForm = fila.children[0].innerHTML;
    const empleadoForm = fila.getAttribute('data-idCliente');
    const fechaDesdeForm = fila.getAttribute('data-fechaDesde');
    const fechaHastaForm = fila.getAttribute('data-fechaHasta');
    const montoForm = fila.getAttribute('data-monto');
    const rebajoForm = fila.getAttribute('data-rebajo');
    //const saldoForm = fila.getAttribute('data-saldo');
   
    empleado.value = empleadoForm;
    fechaDesde.value = fechaDesdeForm;
    fechaHasta.value = fechaHastaForm;
    monto.value = montoForm;
    rebajo.value = rebajoForm;
    //saldo.value = saldoForm;

    modalRenta.show();
});

//Borrar. 
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_rentaxc = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_rentaxc, {
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
formRenta.addEventListener('submit', (e)=> {
    
    //Previene que se recargue la página
    e.preventDefault();  

        //Update
        fetch(url+idForm, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id_empleado:empleado.value,
                fecha_desde:fechaDesde.value,
                fecha_hasta:fechaHasta.value,
                monto_por_cobrar:monto.value,
                rebajo_semanal:rebajo.value,
                saldo_renta:monto.value
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
    
    modalRenta.hide();

});





