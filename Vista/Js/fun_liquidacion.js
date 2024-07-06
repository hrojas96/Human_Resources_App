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

const modalReportes = new bootstrap.Modal(document.getElementById('modalReportes'));
const formReportes = document.getElementById('formReportes');
const flexRadioDefault1 = document.getElementById('flexRadioDefault1');
const flexRadioDefault2 = document.getElementById('flexRadioDefault2');
const empleadoReporte = document.getElementById('empleadoReporte');
const fechaInicioRpt = document.getElementById('fechaInicioRpt');
const fechaFinalRpt = document.getElementById('fechaFinalRpt');
const flexSwitchCheckChecked = document.getElementById('flexSwitchCheckChecked');
//const minimo = document.getElementById('minimo');
//const maximo = document.getElementById('maximo');
const resultadoReporte = document.getElementById('resultadoReporte');
const tablaReportes = document.getElementById('tablaReportes');
conainerReportes.style.display = 'none';

let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

let resultados = '';
let tipoReporte;
let tablaResultados = '';

verificarUsuario ();
consultarDatos();
cargarEmpleados();

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
                            <td class="text-center">${colon.format(p.pago_vacaciones)}</td> 
                            <td class="text-center">${colon.format(p.pago_aguinaldo)}</td> 
                            <td class="text-center">${colon.format(p.pago_preaviso)}</td>
                            <td class="text-center">${colon.format(p.cesantia)}</td>
                            <td class="text-center">${colon.format(p.monto_liquidado)}</td>
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

//Abre modal reportes limpio
btnReportes.addEventListener('click', ()=>{
    flexRadioDefault2.checked = true;
    empleadoReporte.value = ""; 
    fechaInicioRpt.value = "";
    fechaFinalRpt.value = ""; 
    flexSwitchCheckChecked.checked = true;
    //minimo.value = ""; 
    //maximo.value = ""; 
    modalReportes.show();
    tipoReporte = 2;
    console.log(tipoReporte);
});

//Activa el input empleado si se selecciona un reporte individual
flexRadioDefault1.addEventListener('click', ()=>{
    empleadoReporte.value = "";
    empleadoReporte.disabled = false;
    fechaInicioRpt.disabled = true;
    fechaFinalRpt.disabled = true;
    tipoReporte = 1;
    console.log(tipoReporte);
});

//Desactiva el input empleado si se selecciona un reporte individual
flexRadioDefault2.addEventListener('click', ()=>{
    empleadoReporte.value = "";
    empleadoReporte.disabled = true;
    fechaInicioRpt.disabled = false;
    fechaFinalRpt.disabled = false;
    tipoReporte = 2;
    console.log(tipoReporte);
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
                fechaFinalRpt:fechaFinalRpt.value
                
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
                            <td class="text-center">${p.id_liquidacion}</td>
                            <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td> 
                            <td class="text-center">${new Date(p.fecha).toLocaleDateString('es-ES')}</td>
                            <td class="text-center">${colon.format(p.pago_vacaciones)}</td> 
                            <td class="text-center">${colon.format(p.pago_aguinaldo)}</td> 
                            <td class="text-center">${colon.format(p.pago_preaviso)}</td>
                            <td class="text-center">${colon.format(p.cesantia)}</td>
                            <td class="text-center">${colon.format(p.monto_liquidado)}</td>
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
    const encabezado = ["ID", "Empleado", "Fecha de Liquidación",  "Vacaciones", "Aguinaldo", "Preaviso", "Cesantía", "Monto Liquidado", ];
    
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