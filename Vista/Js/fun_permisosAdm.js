'use strict'

//VARIABLES 
const url = 'http://localhost:8000/api/permisosAdm/';
const contenedorPermisosAdm = document.getElementById('contenedorPermisosAdm');
const contenedorDeligenciasos = document.getElementById('contenedorDeligenciasos');
const modalPermisosAdm = new bootstrap.Modal(document.getElementById('modalPermisosAdm'))
const formPermisosAdm = document.getElementById('formPermisosAdm');
const desicionRRHH = document.getElementById('desicionRRHH');
const msjRRHH = document.getElementById('msjRRHH');
const derechoPago = document.getElementById('derechoPago');

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
            
            if (data[0].acc_permisos_RRHH!== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};


// Muestra resultados en cuanto la página carga
function cargarTabla(permisos) {
    permisos.forEach(p =>{
        if (p.msj_jefatura == null){
            p.msj_jefatura = " ";
        } if (p.msj_RRHH == null){
            p.msj_RRHH = " ";
        };
        if (p.decision_jefatura == 'Aprobado' && p.decision_RRHH == 'Pendiente'){
            resultados += ` <tr data-idCliente="${p.id_empleado}" data-decision_RRHH="${p.decision_RRHH}" data-msj_RRHH"${p.msj_RRHH}">
                                <td class="text-center">${(p.id_permiso)}</td> 
                                <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td>
                                <td class="text-center">${new Date(p.inicio_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(p.final_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${p.msj_empleado}</td>
                                <td class="text-center">${p.decision_jefatura}: ${p.msj_jefatura}</td>
                                <td class="text-center">${p.decision_RRHH}: ${p.msj_RRHH}</td>
                                <td class="text-center">${p.derecho_pago}</td>
                                <td class="centrar"> 
                                    <a class="btnDecision btn btn-primary btn-sm" style="background-color:green; border-color: #255387;">
                                    Decisión
                                    </a>
                                </td> 
                            </tr>`
            contenedorPermisosAdm.innerHTML = resultados;
        }else {
            resultadosx += ` <tr data-idCliente="${p.id_empleado}" data-decision_RRHH="${p.decision_RRHH}" data-msj_RRHH"${p.msj_RRHH}">
                                <td class="text-center">${(p.id_permiso)}</td> 
                                <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td>
                                <td class="text-center">${new Date(p.inicio_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${new Date(p.final_permiso).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${p.msj_empleado}</td>
                                <td class="text-center">${p.decision_jefatura}: ${p.msj_jefatura}</td>
                                <td class="text-center">${p.decision_RRHH}: ${p.msj_RRHH}</td>
                                <td class="text-center">${p.derecho_pago}</td>
                                 
                            </tr>`
            contenedorDeligenciasos.innerHTML = resultadosx;
        }
    });
    
};
//Función para Mostrar resultados
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
    const desicionRRHHForm = fila.getAttribute('data-decision_RRHH');
    const msjRRHHForm = fila.getAttribute('data-msj_RRHH');
    const derechoPagoForm = fila.children[7].innerHTML;

    desicionRRHH.value = desicionRRHHForm;
    msjRRHH.value = msjRRHHForm;
    derechoPago.value = derechoPagoForm;


    modalPermisosAdm.show();
});


//Guardar cambios editados o creados
formPermisosAdm.addEventListener('submit', (e)=> {
    e.preventDefault();

    fetch(url+idForm, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            decision_RRHH:desicionRRHH.value,
            msj_RRHH:msjRRHH.value,
            derecho_pago:derechoPago.value,
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
    
    modalPermisosAdm.hide();

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
        decision.disabled = false;
        reporteDecision = 2
        console.log(reporteDecision);
    }
    if (flexSwitchCheckChecked.checked == false){
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
                
                data.forEach(v => {

                    if (v.msj_jefatura == null || v.msj_RRHH == null ){
                        v.msj_jefatura = " ";
                        v.msj_RRHH = " "
                    }
                    
                    tablaResultados += `
                        <tr>
                            <td class="text-center">${v.id_permiso}</td> 
                            <td class="text-center">${v.nombre} ${v.apellido1} ${v.apellido2}</td>
                            <td class="text-center">${new Date(v.inicio_permiso).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${new Date(v.final_permiso).toLocaleDateString('es-ES')}</td>
                            <td class="text-center">${v.decision_jefatura}: ${v.msj_jefatura}</td> 
                            <td class="text-center">${v.decision_RRHH}: ${v.msj_RRHH}</td> 
                            <td class="text-center">${v.derecho_pago}</td> 
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
    const encabezado = ["N. Permiso", "Empleado", "Desde",  "Hasta",  "Jefatura", "RRHH", "Derecho Pago" ];
    
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