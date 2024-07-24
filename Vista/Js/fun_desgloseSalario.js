//Variables

const url = 'http://localhost:8000/api/planilla/';
const urlPlanillaUsr = 'http://localhost:8000/api/planillaUsr/';
const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'))
const formDesgloses = document.getElementById('formDesgloses');
const desglose = document.getElementById('desglose');
const totales = document.getElementById('totales');
const fechaDesde = document.getElementById('fechaDesde');
const fechaHasta = document.getElementById('fechaHasta');
const empleado = document.getElementById('empleado');
const idSalario = document.getElementById('idSalario');
const horasOrdinarias = document.getElementById('horasOrdinarias');
const horasExtras = document.getElementById('horasExtras');
const montoBono = document.getElementById('montoBono');
const diasPagos = document.getElementById('diasPagos');
const prestamo = document.getElementById('prestamo');
const btnEditarPlanilla = document.querySelector('.btnEditarPlanilla');
let datosx = '';
let datosy = '';
let listaDesglose;

let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

cargarDesglose();
verificarUsuario ();

//Verifica si el usuario tiene acceso al botón
function verificarUsuario () {
    const urlAccesos = 'http://localhost:8000/api/accesos/';
    const usuario = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAccesos + usuario)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            
            if (data[0].acc_planilla == 1) {
                btnEditarPlanilla.style.display = 'inline-block';  
                btnEditarPlanilla.disabled = true; 
            }
        })
        .catch(error => alert(error))
};

function mostrarDesglose(desgloseSalarios) {
   listaDesglose = desgloseSalarios;
   desgloseSalarios.forEach(p => {
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

function cargarDesglose() {
    const id_salario = JSON.parse(localStorage.getItem("salarioid")) || false;
    console.log();
    fetch(url + id_salario)
        .then(response => response.json())
        .then(data => mostrarDesglose(data))

        .catch(error =>console.log(error))
};

//Boton de crear abre modal y limpio
let idForm = 0;
btnEditarPlanilla.addEventListener('click', ()=>{
    idForm = listaDesglose[0].id_salario;
    horasOrdinarias.value = listaDesglose[0].monto_horas_ordinarias;
    horasExtras.value = listaDesglose[0].monto_horas_extras;
    montoBono.value = listaDesglose[0].monto_bono;
    diasPagos.value = listaDesglose[0].monto_dias_solicitados;
    prestamo.value = listaDesglose[0].deduccion_prestamo; 

    modalEditar.show();
});

formDesgloses.addEventListener('submit', (e)=> {
    //Previene que se recargue la página
    e.preventDefault();  
    let salarioBruto = parseFloat(horasOrdinarias.value) + parseFloat(horasExtras.value) + parseFloat(montoBono.value) + parseFloat(diasPagos.value);
    let dedCCSS = salarioBruto * 0.0967;
    let dedBP = salarioBruto * 0.01;
    let montoCancelado = salarioBruto - prestamo.value - dedCCSS - dedBP - listaDesglose[0].deduccion_renta;
    //Update
   
    fetch(urlPlanillaUsr+idForm, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            monto_horas_ordinarias:horasOrdinarias.value,
            monto_horas_extras:horasExtras.value,
            monto_bono:montoBono.value,
            monto_dias_solicitados:diasPagos.value,
            salario_bruto:salarioBruto,
            deduccion_ccss:dedCCSS,
            deduccion_bancopopular:dedBP,
            deduccion_prestamo:prestamo.value,
            monto_cancelado:montoCancelado
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
    
    
    modalEditar.hide();

});
