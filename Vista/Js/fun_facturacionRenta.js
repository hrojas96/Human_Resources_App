'use strict'

//Variables

const urlFactRenta = 'http://localhost:8000/api/factRenta/';
const contenedorFactRenta = document.querySelector('tbody');
const modalFactRenta = new bootstrap.Modal(document.getElementById('modalFactRenta'))
const formFactRenta = document.getElementById('formFactRenta');
const numFactRenta = document.getElementById('numFactRenta');
const empleadoA = document.getElementById('empleadoA');
const fechaA = document.getElementById('fechaA');
const montoOriginal = document.getElementById('montoOriginal');
const saldoA = document.getElementById('saldoA');
const abono = document.getElementById('abono');
let ultimoAbono = 0;
let ultimoSaldo = 0;
let datos = '';
let opcion = '';
let listaAbonos;
let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

verificarUsuario ();
cargarFactRenta();

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

function mostrarAbonos(abonos) {
    listaAbonos = abonos;
    abonos.forEach((a, index) => {
        numFactRenta.textContent = JSON.parse(localStorage.getItem("rentaid")) || false;
        empleadoA.textContent = a.nombre + ' ' + a.apellido1 + ' ' + a.apellido2;
        fechaA.textContent = new Date(a.fecha_desde).toLocaleDateString('es-ES');
        montoOriginal.textContent = colon.format(a.monto_por_cobrar);
        datos += `<tr data-abono="${a.monto_fact}">
                        <td class="text-center">${a.id_factRenta}</td>
                        <td class="text-center">${new Date(a.fecha_fact).toLocaleDateString('es-ES')}</td>
                        <td class="text-end">${colon.format(a.monto_fact)}</td>
                        <td class="text-end">${colon.format(a.saldo)}</td>
                        <td class="centrar">`
        if (index === abonos.length - 1) {
            datos += `
                            <a class="btnEditar btn btn-primary btn-sm" style="background-color:#255387; border-color: #255387;">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </a>
                            <a class="btnBorrar btn btn-danger btn-sm"> 
                                <i class="fa-regular fa-trash-can"></i>
                            </a>`;
        }

        datos += `   </td>
                    </tr>`;
        saldoA.textContent = colon.format(a.saldo);
        ultimoAbono = a.monto_fact;
        ultimoSaldo = a.saldo;
    });
    contenedorFactRenta.innerHTML = datos;
};

function cargarFactRenta() {
    const factRenta = JSON.parse(localStorage.getItem("rentaid")) || false;
    fetch(urlFactRenta + factRenta)
        .then(response => response.json())
        .then(data => mostrarAbonos(data))

        .catch(error =>console.log(error))
};

//Boton de crear abre modal y limpio
btnCrear.addEventListener('click', ()=>{
    abono.value = "";  
    modalFactRenta.show();
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
    const abonoForm = fila.getAttribute('data-abono');
   
    abono.value = abonoForm;

    opcion = 'editar';
    modalFactRenta.show();
});

//Borrar. 
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_factRenta = fila.firstElementChild.innerHTML;
    
    let saldo = ultimoSaldo + ultimoAbono;
    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(urlFactRenta+id_factRenta, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id_rentaxc:numFactRenta.textContent,
                saldo_renta:saldo
            })
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
formFactRenta.addEventListener('submit', (e)=> {
    //Previene que se recargue la página
    e.preventDefault(); 
    
    //Insert
    if(ultimoSaldo < abono.value){
        alertify
        .alert('Aviso', 'El abono es mayor al saldo', function(){
            alertify.message('OK');
        });
    }else{    
        if (opcion == 'crear'){
            let saldo = ultimoSaldo - abono.value;
            fetch(urlFactRenta, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    id_rentaxc:numFactRenta.textContent,
                    monto_fact:abono.value,
                    saldo_renta:saldo
                    
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
        };
        //Update
        if(opcion == 'editar'){

            let saldo = ultimoAbono + ultimoSaldo - abono.value;
       
            fetch(urlFactRenta+idForm, {
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    monto_fact:abono.value,
                    id_rentaxc:numFactRenta.textContent,
                    saldo_renta:saldo
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
    }
    modalFactRenta.hide();

});
