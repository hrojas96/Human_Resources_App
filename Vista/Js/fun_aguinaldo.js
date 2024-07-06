'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/aguinaldos/';
const contenedorAguinaldo = document.querySelector('tbody');
const modalAguinaldo = new bootstrap.Modal(document.getElementById('modalAguinaldo'))
const formAguinaldo = document.getElementById('formAguinaldo');
const fechaDesde = document.getElementById('fechaDesde');
const fechaHasta = document.getElementById('fechaHasta');

const modalReportes = new bootstrap.Modal(document.getElementById('modalReportes'));
const formReportes = document.getElementById('formReportes');
const flexRadioDefault1 = document.getElementById('flexRadioDefault1');
const flexRadioDefault2 = document.getElementById('flexRadioDefault2');
const empleado = document.getElementById('empleado');
const fechaInicioRpt = document.getElementById('fechaInicioRpt');
const fechaFinalRpt = document.getElementById('fechaFinalRpt');
const flexSwitchCheckChecked = document.getElementById('flexSwitchCheckChecked');
const minimo = document.getElementById('minimo');
const maximo = document.getElementById('maximo');
const resultadoReporte = document.getElementById('resultadoReporte');
const tablaReportes = document.getElementById('tablaReportes');
conainerReportes.style.display = 'none';

let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });
let opcion = '';
let resultados = '';
let tipoReporte;
let repoteMonetario;
let tablaResultados = '';


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
            
            if (data[0].acc_aguinaldo !== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};

// Muestra resultados en cuanto la página carga
function mostrar(aguinaldos) {
    aguinaldos.forEach(a =>{
        resultados += ` <tr data-idCliente="${a.id_empleado}">
                            <td class="text-center">${a.id_aguinaldo}</td>
                            <td class="text-center">${new Date(a.fecha_desde).toLocaleDateString('es-ES')}</td>  
                            <td class="text-center">${new Date(a.fecha_hasta).toLocaleDateString('es-ES')}</td>  
                            <td class="text-center">${a.nombre} ${a.apellido1} ${a.apellido2}</td>  
                            <td class="text-end">${colon.format(a.monto_pagado)}</td>  
                            <td class="centrar"> 
                                <a class="btnAbonos btn btn-primary btn-sm" style="background-color:green; border-color: green;">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </a>
                            </td> 
                        </tr>`
    });
    contenedorAguinaldo.innerHTML = resultados;
};

//Función para Mostrar resultados
function cargarTabla () {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrar(data))
        
        .catch(error => console.log(error))
};

//Boton de crear abre modal y limpio
nuevoAguinaldo.addEventListener('click', ()=>{
    fechaDesde.value = "23/12/2003"; 
    fechaHasta.value = "";  
    modalAguinaldo.show();
    opcion = 'crear';
});

//Borra los aguinaldos de una fecha específica
btnBorrar.addEventListener('click', e => {
    fechaDesde.value = ""; 
    fechaHasta.value = "";  
    modalAguinaldo.show();
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

//Guardar cambios editados o creados
formAguinaldo.addEventListener('submit', (e)=> {
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
    
    modalAguinaldo.hide();

});

//Abre modal reportes limpio
btnReportes.addEventListener('click', ()=>{
    flexRadioDefault2.checked = true;
    empleado.value = ""; 
    fechaInicioRpt.value = "";
    fechaFinalRpt.value = ""; 
    flexSwitchCheckChecked.checked = true;
    minimo.value = ""; 
    maximo.value = ""; 
    modalReportes.show();
    tipoReporte = 2;
    repoteMonetario = 2;
    console.log(tipoReporte);
    console.log(repoteMonetario);

});

//Activa el input empleado si se selecciona un reporte individual
flexRadioDefault1.addEventListener('click', ()=>{
    empleado.value = "";
    empleado.disabled = false;
    tipoReporte = 1;
    console.log(tipoReporte);
});

//Desactiva el input empleado si se selecciona un reporte individual
flexRadioDefault2.addEventListener('click', ()=>{
    empleado.value = "";
    empleado.disabled = true;
    tipoReporte = 2;
    console.log(tipoReporte);
});

//Desactiva el input empleado si se selecciona un reporte individual
flexSwitchCheckChecked.addEventListener('click', ()=>{
    if (flexSwitchCheckChecked.checked == true){
        minimo.value = ""; 
        maximo.value = ""; 
        minimo.disabled = false;
        maximo.disabled = false;
        repoteMonetario = 2
        console.log(repoteMonetario);
    }
    if (flexSwitchCheckChecked.checked == false){
        minimo.value = ""; 
        maximo.value = ""; 
        minimo.disabled = true;
        maximo.disabled = true;
        repoteMonetario = 1;
        console.log(repoteMonetario);
    }
    
});

cargarEmpleados();
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

//Envía la consulta del reporte
formReportes.addEventListener('submit', (e)=> {
    e.preventDefault();

        fetch(url + tipoReporte, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id_empleado:empleado.value,
                fechaInicioRpt:fechaInicioRpt.value,
                fechaFinalRpt:fechaFinalRpt.value, 
                minimo:minimo.value,
                maximo:maximo.value,
                repoteMonetario:repoteMonetario
                
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
              
                data.forEach(a => {
                    
                    tablaResultados += `
                        <tr>
                            <td class="text-center">${a.id_aguinaldo}</td>
                            <td class="text-center">${new Date(a.fecha_desde).toLocaleDateString('es-ES')}</td>  
                            <td class="text-center">${new Date(a.fecha_hasta).toLocaleDateString('es-ES')}</td>  
                            <td class="text-center">${a.nombre} ${a.apellido1} ${a.apellido2}</td>  
                            <td class="text-end">${colon.format(a.monto_pagado)}</td>
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
    doc.text(20,20, "Reporte de Aguinaldos");

    const filas = [];
    const encabezado = ["ID", "Desde",  "Hasta", "Empleado", "Aguinaldo" ];
    
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