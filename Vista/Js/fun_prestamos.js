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

const modalReportes = new bootstrap.Modal(document.getElementById('modalReportes'));
const formReportes = document.getElementById('formReportes');
const flexRadioDefault1 = document.getElementById('flexRadioDefault1');
const flexRadioDefault2 = document.getElementById('flexRadioDefault2');
const empleadoReporte = document.getElementById('empleadoReporte');
const fechaInicioRpt = document.getElementById('fechaInicioRpt');
const fechaFinalRpt = document.getElementById('fechaFinalRpt');
const flexSwitchCheckChecked = document.getElementById('flexSwitchCheckChecked');
const reporteSaldo = document.getElementById('reporteSaldo');
const resultadoReporte = document.getElementById('resultadoReporte');
const tablaReportes = document.getElementById('tablaReportes');
conainerReportes.style.display = 'none';

let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

let opcion = '';
let resultados = '';
let tipoReporte;
let reporteDecision;
let tablaResultados = '';
let listaPrestamos;

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
    listaPrestamos = prestamos;
    prestamos.forEach(p =>{
        resultados += ` <tr data-fecha="${p.fecha_solicitud.slice(0, 10)}" 
                            data-idCliente="${p.id_empleado}" 
                            data-monto="${p.monto_solicitado}" 
                            data-rebajo="${p.rebajo_salarial}" >
                            <td class="text-center">${p.id_prestamo}</td>
                            <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td> 
                            <td class="text-center">${new Date(p.fecha_solicitud).toLocaleDateString('es-ES')}</td>
                            <td class="text-end">${colon.format(p.monto_solicitado)}</td> 
                            <td class="text-end">${colon.format(p.rebajo_salarial)}</td>
                            <td class="text-end">${colon.format(p.saldo)}</td>
                            <td class="centrar"> 
                                <a class="btnAbonos btn btn-primary btn-sm" style="background-color:green; border-color: green;">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </a>
                            
                        `;
        // Añadir botones solo si monto_solicitado es igual a saldo
        if (p.monto_solicitado === p.saldo) {
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
                const opcionCopia = opcion.cloneNode(true);
                empleadoReporte.add(opcionCopia);  
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
    const montoForm = fila.getAttribute('data-monto');
    const rebajoForm = fila.getAttribute('data-rebajo');
   
    empleado.value = empleadoForm;
    empleado.disabled = true;
    fecha.value = fechaForm;
    monto.value = montoForm;
    rebajo.value = rebajoForm;

    opcion = 'editar';
    modalPrestamos.show();
});

//Borrar. 
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_prestamo = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
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

    let prestamoPendiente = false;

    // Verifica si ya existe un préstamo pendiente para el empleado
    for (let i = 0; i < listaPrestamos.length; i++) {
        if (listaPrestamos[i].id_empleado == empleado.value && listaPrestamos[i].saldo > 0) {
            prestamoPendiente = true;
            break;
        }
    }

    if (prestamoPendiente){
        alertify
            .alert('Aviso', 'Ya existe una préstamo a nombre del mismo empleado con un saldo pendiente', function(){
                alertify.message('OK');
            });
    }else{
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
    }
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

//Abre modal reportes limpio
btnReportes.addEventListener('click', ()=>{
    flexRadioDefault2.checked = true;
    empleadoReporte.value = ""; 
    fechaInicioRpt.value = "";
    fechaFinalRpt.value = ""; 
    flexSwitchCheckChecked.checked = true;
    reporteSaldo.value = "";  
    modalReportes.show();
    tipoReporte = 2;
    reporteDecision = 2;
    console.log(tipoReporte);
    console.log(reporteDecision);

});

//Activa el input empleado si se selecciona un reporte individual
flexRadioDefault1.addEventListener('click', ()=>{
    empleadoReporte.value = "";
    empleadoReporte.disabled = false;
    fechaInicioRpt.value = "";
    fechaFinalRpt.value = "";
    fechaInicioRpt.disabled = true;
    fechaFinalRpt.disabled = true;
    tipoReporte = 1;
    console.log(tipoReporte);
});

//Desactiva el input empleado si se selecciona un reporte individual
flexRadioDefault2.addEventListener('click', ()=>{
    empleadoReporte.value = "";
    empleadoReporte.disabled = true;
    fechaInicioRpt.value = "";
    fechaFinalRpt.value = "";
    fechaInicioRpt.disabled = false;
    fechaFinalRpt.disabled = false;
     
    tipoReporte = 2;
    console.log(tipoReporte);
});

//Desactiva el input empleado si se selecciona un reporte individual
flexSwitchCheckChecked.addEventListener('click', ()=>{
    if (flexSwitchCheckChecked.checked == true){
        reporteSaldo.disabled = false;
        reporteDecision = 2
        console.log(reporteDecision);
    }
    if (flexSwitchCheckChecked.checked == false){
        reporteSaldo.disabled = true;
        reporteDecision = 1;
        console.log(reporteDecision);
    }
    
});

//Envía la consulta del reporte
formReportes.addEventListener('submit', (e)=> {
    e.preventDefault();

        fetch(url + tipoReporte, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id_empleado:empleadoReporte.value,
                fechaInicioRpt:fechaInicioRpt.value,
                fechaFinalRpt:fechaFinalRpt.value, 
                reporteSaldo:reporteSaldo.value,
                reporteDecision:reporteDecision
                
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
                conainerReportes.style.display = 'block';
                
                data.forEach(p => {
                    
                    tablaResultados += `
                        <tr>
                            <td class="text-center">${p.id_prestamo}</td>
                            <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td> 
                            <td class="text-center">${new Date(p.fecha_solicitud).toLocaleDateString('es-ES')}</td>
                            <td class="text-end">${colon.format(p.monto_solicitado)}</td> 
                            <td class="text-end">${colon.format(p.rebajo_salarial)}</td>
                            <td class="text-end">${colon.format(p.saldo)}</td>
                        </tr>
                    `;

                        
                    resultadoReporte.innerHTML = tablaResultados;
                });
                //tablaReportes.style.display = 'block';  
            }
        })
    modalReportes.hide();
});

btnImprimir.addEventListener('click', ()=>{
    
    

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    //Título del pdf
    doc.text(20,20, "Reporte de Préstamos");

    const filas = [];
    const encabezado = ["N. Préstamo", "Empleado", "Fecha de Solicitud",  "Monto Solicitado",  "Rebajo Salarial", "Saldo" ];
    
    const tabla = document.querySelector("#resultadoReporte");
    
    tabla.querySelectorAll("tbody tr").forEach(fila => {
        const datos = [];
        fila.querySelectorAll("td").forEach(celda => {
            datos.push(celda.innerText);
        });
        filas.push(datos);
    });
    doc.autoTable({
        startY: 30,
        head: [encabezado],
        body:filas,
    })
    doc.save('reporte.pdf')
});




