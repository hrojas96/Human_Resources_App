//Variables

const urlAbonos = 'http://localhost:8000/api/planilla/';
const desglose = document.getElementById('desglose');
const totales = document.getElementById('totales');
const fechaDesde = document.getElementById('fechaDesde');
const fechaHasta = document.getElementById('fechaHasta');
const empleado = document.getElementById('empleado');
const idSalario = document.getElementById('idSalario');
let datosx = '';
let datosy = '';

let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

cargarDesglose();

function mostrarDesglose(abonos) {
    abonos.forEach(p => {
        console.log(p);
        fechaDesde.textContent = new Date(p.fecha_desde).toLocaleDateString('es-ES');
        fechaHasta.textContent = new Date(p.fecha_hasta).toLocaleDateString('es-ES');
        empleado.textContent = p.nombre + p.apellido1 + p.apellido2;
        idSalario.textContent = p.id_salario;
        datosx += `<tr>
                            <td class="text-end">${colon.format(p.monto_horas_ordinarias)}</td>
                            <td class="text-end">${colon.format(p.monto_horas_extras)}</td>
                            <td class="text-end">${colon.format(p.monto_bono)}</td>
                            <td class="text-end">${colon.format(p.monto_dias_solicitados)}</td>
                            <td class="text-end">${colon.format(p.deduccion_ccss)}</td>
                            <td class="text-end">${colon.format(p.deduccion_bancopopular)}</td>
                            <td class="text-end">${colon.format(p.deduccion_renta)}</td>
                            <td class="text-end">${colon.format(p.deduccion_prestamo)}</td>
                        </tr>    
                     `
            desglose.innerHTML = datosx;

        datosy += `<tr>
                        <td class="text-end">${colon.format(p.salario_bruto)}</td>
                        <td class="text-end">${colon.format(p.total_deducciones)}</td>
                        <td class="text-end">${colon.format(p.monto_cancelado)}</td>
                        
                    </tr>    
                `
            totales.innerHTML = datosy;        
    });
    
};

/*function mostrarDesglose(abonos) {
    abonos.forEach(p => {
        datosy += `<tr>
                            <td>${colon.format(p.salario_bruto)}</td>
                            <td>${colon.format(p.total_deducciones)}</td>
                            <td>${colon.format(p.monto_cancelado)}</td>
                            
                        </tr>    
                     `
    });
    totales.innerHTML = datosy;
};*/

function cargarDesglose() {
    const id_salario = JSON.parse(localStorage.getItem("salarioid")) || false;
    console.log();
    fetch(urlAbonos + id_salario)
        .then(response => response.json())
        .then(data => mostrarDesglose(data))

        .catch(error =>console.log(error))
};
