'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/horasExtrasAdm/';
const contenedorhExtrasAdm = document.getElementById('contenedorhExtrasAdm');
const contenedorDeligenciados = document.getElementById('contenedorDeligenciados');
const modalhorasExtrasAdm = new bootstrap.Modal(document.getElementById('modalhorasExtrasAdm'))
const formHExtrasAdm = document.getElementById('formHExtrasAdm');
const desicionRRHH = document.getElementById('desicionRRHH');

const modalReportes = new bootstrap.Modal(document.getElementById('modalReportes'));
const formReportes = document.getElementById('formReportes');
const flexRadioDefault1 = document.getElementById('flexRadioDefault1');
const flexRadioDefault2 = document.getElementById('flexRadioDefault2');
const empleado = document.getElementById('empleado');
const fechaInicioRpt = document.getElementById('fechaInicioRpt');
const fechaFinalRpt = document.getElementById('fechaFinalRpt');
const flexSwitchCheckChecked = document.getElementById('flexSwitchCheckChecked');
const decision = document.getElementById('decision');
const resultadoReporte = document.getElementById('resultadoReporte');
const tablaReportes = document.getElementById('tablaReportes');
conainerReportes.style.display = 'none';

let resultados = '';
let resultadosx = '';
let tipoReporte;
let reporteDecision;
let tablaResultados = '';

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
            
            if (data[0].acc_horasExtras_RRHH!== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};

// Muestra resultados en cuanto la página carga
function cargarTabla(extras) {
    console.log('hola', extras);
    extras.forEach(e =>{
        
        if (e.decision_jefatura == 'Aprobado' && e.decision_RRHH == 'Pendiente'){
            resultados += ` <tr>
                                <td class="text-center">${(e.id_marca)}</td> 
                                <td class="text-center">${new Date(e.fecha).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${e.nombre} ${e.apellido1} ${e.apellido2}</td>
                                <td class="text-center">${e.horas_extras}</td>
                                <td class="text-center">${e.decision_RRHH}</td>
                                <td class="centrar"> 
                                    <a class="btnDecision btn btn-primary btn-sm" style="background-color:green; border-color: #255387;">
                                        Decisión
                                    </a>
                                </td> 
                            </tr>`
            
                contenedorhExtrasAdm.innerHTML = resultados;
        }else{
            resultadosx += ` <tr>
                                <td class="text-center">${(e.id_marca)}</td> 
                                <td class="text-center">${new Date(e.fecha).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${e.nombre} ${e.apellido1} ${e.apellido2}</td>
                                <td class="text-center">${e.horas_extras}</td>
                                <td class="text-center" >${e.decision_RRHH}</td> 
                            </tr>`
            
                contenedorDeligenciados.innerHTML = resultadosx;

        };
    })
};

//Función para consultar datos
function consultarDatos () {
    fetch(url)
        .then(response => response.json())
        .then(data => cargarTabla(data))
        
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
on(document, 'click', '.btnDecision', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idForm = fila.children[0].innerHTML;
    const desicionRRHHForm = fila.children[3].innerHTML;
    
    desicionRRHH.value = desicionRRHHForm;
    modalhorasExtrasAdm.show();
});

//Guardar cambios editados o creados
formHExtrasAdm.addEventListener('submit', (e)=> {
    e.preventDefault();

    fetch(url+idForm, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            decision_RRHH:desicionRRHH.value
        })
    })
    .then( response => response.json())
    .then( data =>{
        //console.log(data);
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
    
    modalhorasExtrasAdm.hide();

});

//Abre modal reportes limpio
btnReportes.addEventListener('click', ()=>{
    flexRadioDefault2.checked = true;
    empleado.value = ""; 
    fechaInicioRpt.value = "";
    fechaFinalRpt.value = ""; 
    flexSwitchCheckChecked.checked = true;
    decision.value = "";  
    modalReportes.show();
    tipoReporte = 2;
    reporteDecision = 2;
    console.log(tipoReporte);
    console.log(reporteDecision);

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
        decision.value = "";  
        decision.disabled = false;
        reporteDecision = 2
        console.log(reporteDecision);
    }
    if (flexSwitchCheckChecked.checked == false){
        decision.value = "";  
        decision.disabled = true;
        reporteDecision = 1;
        console.log(reporteDecision);
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
                decision:decision.value,
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
                
                data.forEach(e => {

                    tablaResultados += `
                        <tr>
                            <td class="text-center">${(e.id_marca)}</td> 
                                <td class="text-center">${new Date(e.fecha).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${e.nombre} ${e.apellido1} ${e.apellido2}</td>
                                <td class="text-center">${e.horas_extras}</td>
                                <td class="text-center">${e.decision_jefatura}</td>
                                <td class="text-center">${e.decision_RRHH}</td>
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
    doc.text(20,20, "Reporte de Permisos");

    const filas = [];
    const encabezado = ["Marca", "Fecha", "Empleado", "Horas Extras",  "Jefatura", "RRHH" ];
    
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