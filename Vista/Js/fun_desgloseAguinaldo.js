//Variables

const urlAguinaldo = 'http://localhost:8000/api/aguinaldos/';
const desglose = document.getElementById('desglose');
const fechaDesde = document.getElementById('fechaDesde');
const fechaHasta = document.getElementById('fechaHasta');
const empleado = document.getElementById('empleado');
const idAguinaldo = document.getElementById('idAguinaldo');
let datosx = '';


let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

cargarDesglose();

function mostrarDesglose(abonos) {
    abonos.forEach(p => {
        console.log(p);
        fechaDesde.textContent = p.fecha_desde.slice(0, 10);
        fechaHasta.textContent = p.fecha_hasta.slice(0, 10);;
        empleado.textContent = p.nombre + p.apellido1 + p.apellido2;
        idAguinaldo.textContent = p.id_salario;
        datosx += `<tr>
                            <td class="text-center">${(p.id_salario)}</td>
                            <td class="text-center">${(new Date(p.fecha_hasta).toLocaleDateString('es-ES'))}</td>
                            <td class="text-end">${colon.format(p.salario_bruto)}</td>
                        </tr>    
                     `
        desglose.innerHTML = datosx;        
    });
    
};


function cargarDesglose() {
    const id_aguinaldo = JSON.parse(localStorage.getItem("aguinaldoid")) || false;
    console.log();
    fetch(urlAguinaldo + id_aguinaldo)
        .then(response => response.json())
        .then(data => mostrarDesglose(data))

        .catch(error =>console.log(error))
};
