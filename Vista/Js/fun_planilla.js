'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/planilla/';
const urlrenta = 'http://localhost:8000/api/renta/';
const contenedorPlanilla = document.querySelector('tbody');
const modalPlanilla = new bootstrap.Modal(document.getElementById('modalPlanilla'));

const formPlanillas = document.getElementById('formPlanillas');
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
const labelFechaInicio = document.getElementById('labelFechaInicio');
const labelFechaFinal = document.getElementById('labelFechaFinal');
const labelEmpleado = document.getElementById('labelEmpleado');
const reporteDesglose = document.getElementById('reporteDesglose');
const reporteTotales = document.getElementById('reporteTotales');
const tablaReportes = document.getElementById('tablaReportes');
conainerReportes.style.display = 'none';

let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });
let opcion = '';
let resultados = '';

let tipoReporte;
let repoteMonetario;


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
                            <td class="text-center">${colon.format(p.monto_cancelado)}</td>  
                            <td class="centrar"> 
                                <a class="btnDesglose btn btn-primary btn-sm" style="background-color:green; border-color: green;">
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
    fechaDesde.value = ""; 
    fechaHasta.value = "";  
    modalPlanilla.show();
    opcion = 'crear';
});

//Boton de calcular renta abre modal y limpio
btnRenta.addEventListener('click', ()=>{
    fechaDesde.value = ""; 
    fechaHasta.value = "";  
    modalPlanilla.show();
    opcion = 'renta';
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
    element.addEventListener(event, e => { 

        if(e.target.closest(selector)){
            handler(e)
        };
    });
};

on(document, 'click', '.btnDesglose', e => {
    const fila = e.target.closest('tr');
    let salario = fila.children[0].innerHTML;
    localStorage.setItem("salarioid", JSON.stringify(salario));
    window.location.assign("desgloseSalario.html");
});

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

    if (opcion == 'renta'){
        fetch(urlrenta, {
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
    
    modalPlanilla.hide();

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
        minimo.disabled = false;
        maximo.disabled = false;
        repoteMonetario = 2
        console.log(repoteMonetario);
    }
    if (flexSwitchCheckChecked.checked == false){
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
                tablaReportes.innerHTML = '';
                data.forEach(p => {
                    
                    const tablaResultados = document.createElement('div');
                    tablaResultados.innerHTML = `
                        
                        <table class="table table-sm table-bordered table-striped">
                            <thead>
                                <tr class="text-center">
                                    
                                    <th>Desde</th>
                                    <th >Hasta</th>
                                    <th >Empleado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-center">${p.fecha_desde.slice(0, 10)}</td>
                                    <td class="text-center">${p.fecha_hasta.slice(0, 10)}</td>
                                    <td class="text-center">${p.nombre} ${p.apellido1} ${p.apellido2}</td>
                                </tr>
                            </tbody>
                        </table><br>

                        <table class="table table-sm table-bordered table-striped">
                            <thead>
                                <tr class="text-center">
                                    <th >Horas Ordinarias</th>
                                    <th >Horas Extras</th>
                                    <th >Bonos</th>
                                    <th >Ded. CCSS</th>
                                    <th >Ded. Banco Popular</th>
                                    <th >Ded. Imp. Renta</th>
                                    <th >Ded. Préstamos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-end">${colon.format(p.monto_horas_ordinarias)}</td>
                                    <td class="text-end">${colon.format(p.monto_horas_extras)}</td>
                                    <td class="text-end">${colon.format(p.monto_bono)}</td>
                                    <td class="text-end">${colon.format(p.deduccion_ccss)}</td>
                                    <td class="text-end">${colon.format(p.deduccion_bancopopular)}</td>
                                    <td class="text-end">${colon.format(p.deduccion_renta)}</td>
                                    <td class="text-end">${colon.format(p.deduccion_prestamo)}</td>
                                </tr>
                            </tbody>
                        </table><br>
                        <table class="table table-sm table-bordered table-striped">
                            <thead>
                                <tr class="text-center">
                                    <th >Salario Bruto</th>
                                    <th >Total Deducciones</th>
                                    <th >Salario Neto</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-end">${colon.format(p.salario_bruto)}</td>
                                    <td class="text-end">${colon.format(p.total_deducciones)}</td>
                                    <td class="text-end">${colon.format(p.monto_cancelado)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p class="text-center">_________________________________________________________________________________________________________</p>
                        
                    `;

                        
                    tablaReportes.appendChild(tablaResultados);
                });
                //tablaReportes.style.display = 'block';  
            }
        })
    modalReportes.hide();
});

btnImprimir.addEventListener('click', ()=>{
    const { jsPDF } = window.jspdf;
    
    const pdf = new jsPDF('p', 'pt', 'a4', true);
    pdf.text(50, 50, "Reporte de Planillas");
    const tablas = tablaReportes.getElementsByTagName('table');
    let startY = 80;
 

    for (let i = 0; i < tablas.length; i++) {
        const tabla = tablas[i];
        const columnas = [];
        const filas = [];

        // Obtén los encabezados de la tabla
        const encabezado = tabla.querySelectorAll('thead th');
        encabezado.forEach(concepto => {
            columnas.push({ header: concepto.innerText, dataKey: concepto.innerText });
        });

        // Toma los datos de la tabla
        const datos = tabla.querySelectorAll('tbody tr');
        datos.forEach(fila => {
            const rowData = {};
            const celdas = fila.querySelectorAll('td');
            celdas.forEach((celda, index) => {
                rowData[columnas[index].dataKey] = celda.innerText.replace(/¡/g, '₡');
            });
            filas.push(rowData);
        });

        
        // Agrega la tabla al PDF usando autoTable
        pdf.autoTable(columnas, filas, {
            startY: startY,
            margin: { top: 50 },
            styles: { 
                cellPadding: 4,
                fontSize: 8,
                
            },
        });

        if (i < tablas.length - 1) {
            startY = pdf.lastAutoTable.finalY + 30;  // Aumenta el espacio entre tablas
            pdf.line(40, startY - 10, pdf.internal.pageSize.width - 40, startY - 10);  // Dibuja una línea horizontal
        }
    }

    pdf.save('reportes.pdf');
});


/*console.log(p);
                        labelFechaInicio.textContent = p.fecha_desde.slice(0, 10);
                        labelFechaFinal.textContent = p.fecha_hasta.slice(0, 10);;
                        labelEmpleado.textContent = p.nombre + p.apellido1 + p.apellido2;
                        
                        datosx += `<tr>
                                            <td class="text-end">${colon.format(p.monto_horas_ordinarias)}</td>
                                            <td class="text-end">${colon.format(p.monto_horas_extras)}</td>
                                            <td class="text-end">${colon.format(p.monto_bono)}</td>
                                            <td class="text-end">${colon.format(p.deduccion_ccss)}</td>
                                            <td class="text-end">${colon.format(p.deduccion_bancopopular)}</td>
                                            <td class="text-end">${colon.format(p.deduccion_renta)}</td>
                                            <td class="text-end">${colon.format(p.deduccion_prestamo)}</td>
                                        </tr>    
                                     `
                        reporteDesglose.innerHTML = datosx;
                
                        datosy += `<tr>
                                        <td class="text-end">${colon.format(p.salario_bruto)}</td>
                                        <td class="text-end">${colon.format(p.total_deducciones)}</td>
                                        <td class="text-end">${colon.format(p.monto_cancelado)}</td>
                                        
                                    </tr>    
                                `
                        reporteTotales.innerHTML = datosy; */ 