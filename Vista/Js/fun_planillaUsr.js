'use strict'

//Variables

const urlAbonos = 'http://localhost:8000/api/planillaUsr/';
const contenedorPlanillaUsr = document.querySelector('tbody');
let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

const modalReportes = new bootstrap.Modal(document.getElementById('modalReportes'));
const formReportes = document.getElementById('formReportes');
const fechaInicioRpt = document.getElementById('fechaInicioRpt');
const fechaFinalRpt = document.getElementById('fechaFinalRpt');
const flexSwitchCheckChecked = document.getElementById('flexSwitchCheckChecked');
const minimo = document.getElementById('minimo');
const maximo = document.getElementById('maximo');
const labelFechaInicio = document.getElementById('labelFechaInicio');
const labelFechaFinal = document.getElementById('labelFechaFinal');
const reporteDesglose = document.getElementById('reporteDesglose');
const reporteTotales = document.getElementById('reporteTotales');
const tablaReportes = document.getElementById('tablaReportes');
conainerReportes.style.display = 'none';

let resultados = '';
let repoteMonetario;

cargarSalarios();


function mostrarSalarios(salarios) {
    salarios.forEach(a => {
        resultados += `<tr>
                            <td class="text-center">${a.id_salario}</td>
                            <td class="text-center">${new Date(a.fecha_desde).toLocaleDateString('es-ES')}</td>
                            <td class="text-center">${new Date(a.fecha_hasta).toLocaleDateString('es-ES')}</td>
                            <td class="text-end">${colon.format(a.monto_cancelado)}</td>
                            <td class="centrar"> 
                                <a class="btnDesglose btn btn-primary btn-sm" style="background-color:green; border-color: green;">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </a>
                            </td>
                        </tr>    
                     `
    });
    contenedorPlanillaUsr.innerHTML = resultados;
};

function cargarSalarios() {
    const empleado = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAbonos + empleado)
        .then(response => response.json())
        .then(data => mostrarSalarios(data))

        .catch(error =>console.log(error))
};

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

//Abre modal reportes limpio
btnReportes.addEventListener('click', ()=>{
    fechaInicioRpt.value = "";
    fechaFinalRpt.value = ""; 
    flexSwitchCheckChecked.checked = true;
    minimo.value = ""; 
    maximo.value = ""; 
    modalReportes.show();
    repoteMonetario = 2;
    console.log(repoteMonetario);

});

//Desactiva el input empleado si se selecciona un reporte individual
flexSwitchCheckChecked.addEventListener('click', ()=>{
    if (flexSwitchCheckChecked.checked == true){
        minimo.disabled = false;
        maximo.disabled = false;
        minimo.value = "";
        maximo.value = "";
        repoteMonetario = 2
        console.log(repoteMonetario);
    }
    if (flexSwitchCheckChecked.checked == false){
        minimo.disabled = true;
        maximo.disabled = true;
        minimo.value = "";
        maximo.value = "";
        repoteMonetario = 1;
        console.log(repoteMonetario);
    }
    
});

//Envía la consulta del reporte
formReportes.addEventListener('submit', (e)=> {
    e.preventDefault();
    const id_empleado = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAbonos + id_empleado, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-center">${p.fecha_desde.slice(0, 10)}</td>
                                <td class="text-center">${p.fecha_hasta.slice(0, 10)}</td>
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
                                <td class="text-end"> CRC ${(p.monto_cancelado)}</td>
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
                let textoCelda = celda.innerText.replace(/¡/g, '₡');
                rowData[columnas[index].dataKey] = textoCelda;
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