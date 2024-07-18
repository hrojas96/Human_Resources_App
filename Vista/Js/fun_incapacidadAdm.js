const url = 'http://localhost:8000/api/incapacidades/';
const contenedorIncAdm = document.getElementById('contenedorIncAdm');
const contenedorProcesados = document.getElementById('contenedorProcesados');
const modalIncapacidad = new bootstrap.Modal(document.getElementById('modalIncapacidad'));
const formIncapacidad = document.getElementById('formIncapacidad');
const empleado = document.getElementById('empleado');
const tipoIncapacidad = document.getElementById('tipoIncapacidad');
const fechaDesde = document.getElementById('fechaDesde');
const fechaHasta = document.getElementById('fechaHasta');

const modalEstado = new bootstrap.Modal(document.getElementById('modalEstado'));
const formEstado = document.getElementById('formEstado');
const estado = document.getElementById('estado');

const modalReportes = new bootstrap.Modal(document.getElementById('modalReportes'));
const formReportes = document.getElementById('formReportes');
const flexRadioDefault1 = document.getElementById('flexRadioDefault1');
const flexRadioDefault2 = document.getElementById('flexRadioDefault2');
const empleadReporte = document.getElementById('empleadReporte');
const fechaInicioRpt = document.getElementById('fechaInicioRpt');
const fechaFinalRpt = document.getElementById('fechaFinalRpt');
const flexSwitchCheckChecked = document.getElementById('flexSwitchCheckChecked');
const reporteTipoInc = document.getElementById('reporteTipoInc');
const resultadoReporte = document.getElementById('resultadoReporte');
const tablaReportes = document.getElementById('tablaReportes');
conainerReportes.style.display = 'none';

let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });
let opcion = '';
let resultados = '';
let resultadosx = '';
let tipoReporte;
let reporteDecision;
let tablaResultados = '';


verificarUsuario ();
consultarDatos();
cargarEmpleados();
cargarTiposIncapacidades();

//Verifica si el usuario tiene acceso a esta página
function verificarUsuario () {
    const urlAccesos = 'http://localhost:8000/api/accesos/';
    const usuario = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAccesos + usuario)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            
            if (data[0].acc_incapacidades!== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};

// Muestra resultados en cuanto la página carga
function cargarTabla(incapacidades) {
    incapacidades.forEach(p =>{
        if (p.estado != 'Aprobado'){
            console.log(p)
            resultados += ` <tr data-idCliente="${p.id_empleado}" data-tipoI="${p.id_tipo_incapacidad}" data-fechaDesde="${p.fecha_desde.slice(0, 10)}" data-fechaHasta="${p.fecha_hasta.slice(0, 10)}" >
                                <td class="text-center">${p.id_incapacidad}</td>
                                <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td> 
                                <td class="text-center">${p.concepto}</td> 
                                <td class="text-center">${new Date(p.fecha_desde).toLocaleDateString('es-ES')}</td>  
                                <td class="text-center">${new Date(p.fecha_hasta).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${colon.format(p.monto_subcidio)}</td> 
                                <td class="text-center">${p.estado}</td> 
                                <td class="centrar"> 
                                    <a class="btnEditar btn btn-primary btn-sm" style="background-color:#255387; border-color: #255387;">
                                        <i class="fa-regular fa-pen-to-square"></i>
                                    </a>
                                    <a class="btnBorrar btn btn-danger btn-sm"> 
                                        <i class="fa-regular fa-trash-can"></i>
                                    </a>
                                    <a class="btnEstado btn btn-primary btn-sm" style="background-color:green; border-color: green;">
                                        <i class="fa-regular fa-circle-check"></i>
                                    </a>
                                </td> 
                            </tr>`
            contenedorIncAdm.innerHTML = resultados;
        }else{
            resultadosx += ` <tr data-idCliente="${p.id_empleado}" data-tipoI="${p.id_tipo_incapacidad}" data-fechaDesde="${p.fecha_desde.slice(0, 10)}" data-fechaHasta="${p.fecha_hasta.slice(0, 10)}" >
                                <td class="text-center">${p.id_incapacidad}</td>
                                <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td> 
                                <td class="text-center">${p.concepto}</td> 
                                <td class="text-center">${new Date(p.fecha_desde).toLocaleDateString('es-ES')}</td>  
                                <td class="text-center">${new Date(p.fecha_hasta).toLocaleDateString('es-ES')}</td> 
                                <td class="text-center">${colon.format(p.monto_subcidio)}</td>  
                            </tr>`
            contenedorProcesados.innerHTML = resultadosx;

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
                empleadReporte.add(opcionCopia);     
            });
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
};

//Carga lista de empleados registrados
function cargarTiposIncapacidades() {
    fetch("http://localhost:8000/api/tiposIncapacidadesRegistradas/")
        .then(response => response.json())
        .then(data => {
            // Recorre los datos y crea las opciones
            data.forEach((optionData) => {
                // Crea un elemento option
                const opcion = document.createElement("option");

                // Establece el valor y texto de la opción
                opcion.text = optionData.concepto;
                opcion.value = optionData.id_tipo_incapacidad;
                // Agrega la opción al elemento select
                tipoIncapacidad.add(opcion);
                const opcionCopia = opcion.cloneNode(true);
                reporteTipoInc.add(opcionCopia);    
            });
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
};

//Boton de crear abre modal y limpio
btnCrear.addEventListener('click', ()=>{
    empleado.value = ""; 
    tipoIncapacidad.value = "";
    fechaDesde.value = ""; 
    fechaHasta.value = ""; 
    modalIncapacidad.show();
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

//Editar 
let idForm = 0;
on(document, 'click', '.btnEditar', e => {
    
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idForm = fila.children[0].innerHTML;
    const empleadoForm = fila.getAttribute('data-idCliente');
    const tipoIncapacidadForm = fila.getAttribute('data-tipoI');
    const fechaDesdeForm = fila.getAttribute('data-fechaDesde');
    const fechaHastaForm = fila.getAttribute('data-fechaHasta');

    empleado.value = empleadoForm;
    tipoIncapacidad.value = tipoIncapacidadForm;
    fechaDesde.value = fechaDesdeForm;
    fechaHasta.value = fechaHastaForm;
    opcion = 'editar';
    modalIncapacidad.show();
});

//Borrar. 1 parent node toma solo los botones, el 2 toma toda la fila. Se toma el Id para pasarselo al API con target    
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_incapacidad = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_incapacidad, {
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
        
    },
    function(){
        alertify.error('Cancelado');
    });
});

//Guardar cambios editados o creados
formIncapacidad.addEventListener('submit', (e)=> {
    let estado = "Pendiente";
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
                id_tipo_incapacidad:tipoIncapacidad.value,
                fecha_desde:fechaDesde.value,
                fecha_hasta:fechaHasta.value,
                estado:estado
            })
        })
        .then( response => response.json())
        .then( data =>{
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
                id_tipo_incapacidad:tipoIncapacidad.value,
                fecha_desde:fechaDesde.value,
                fecha_hasta:fechaHasta.value
            })
        })
        .then( response => response.json())
        .then( data =>{
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
    };
    
    modalIncapacidad.hide();

});

//Aceptar Incapacidad
let idIncapacidad = 0;
on(document, 'click', '.btnEstado', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    idIncapacidad = fila.children[0].innerHTML;
    const estadoForm = fila.children[6].innerHTML;

    estado.value = estadoForm;
    modalEstado.show();
});

//Guardar cambios editados o creados
formEstado.addEventListener('submit', (e)=> {
    //Previene que se recargue la página
    e.preventDefault();  

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            id_incapacidad:idIncapacidad,
            estado:estado.value
        })
    })
    .then( response => response.json())
    .then( data =>{
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
    
    
    modalEstado.hide();

});

//Abre modal reportes limpio
btnReportes.addEventListener('click', ()=>{
    flexRadioDefault2.checked = true;
    empleadReporte.value = ""; 
    fechaInicioRpt.value = "";
    fechaFinalRpt.value = ""; 
    flexSwitchCheckChecked.checked = true;
    reporteTipoInc.value = "";  
    modalReportes.show();
    tipoReporte = 2;
    reporteDecision = 2;
    console.log(tipoReporte);
    console.log(reporteDecision);

});

//Activa el input empleado si se selecciona un reporte individual
flexRadioDefault1.addEventListener('click', ()=>{
    empleadReporte.value = "";
    empleadReporte.disabled = false;
    tipoReporte = 1;
    console.log(tipoReporte);
});

//Desactiva el input empleado si se selecciona un reporte individual
flexRadioDefault2.addEventListener('click', ()=>{
    empleadReporte.value = "";
    empleadReporte.disabled = true;
     
    tipoReporte = 2;
    console.log(tipoReporte);
});

//Desactiva el input empleado si se selecciona un reporte individual
flexSwitchCheckChecked.addEventListener('click', ()=>{
    if (flexSwitchCheckChecked.checked == true){
        reporteTipoInc.value = "";
        reporteTipoInc.disabled = false;
        reporteDecision = 2
        console.log(reporteDecision);
    }
    if (flexSwitchCheckChecked.checked == false){
        reporteTipoInc.value = "";
        reporteTipoInc.disabled = true;
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
                id_empleado:empleadReporte.value,
                fechaInicioRpt:fechaInicioRpt.value,
                fechaFinalRpt:fechaFinalRpt.value, 
                reporteTipoInc:reporteTipoInc.value,
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
                            <td class="text-center">${p.id_incapacidad}</td>
                            <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td> 
                            <td class="text-center">${p.concepto}</td> 
                            <td class="text-center">${new Date(p.fecha_desde).toLocaleDateString('es-ES')}</td>  
                            <td class="text-center">${new Date(p.fecha_hasta).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${colon.format(p.monto_subcidio)}</td>  
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
    const encabezado = ["N.", "Empleado", "Incapacidad", "Fecha Inicio", "Fecha Fin", "Monto Subcidio Diario" ];
    
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
