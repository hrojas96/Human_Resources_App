'use strict'

//Variables

const urlAbonos = 'http://localhost:8000/api/abonoPrestamos/';
const contenedorAbonos = document.querySelector('tbody');
const modalAbonoPrestamos = new bootstrap.Modal(document.getElementById('modalAbonoPrestamos'))
const formAbonos = document.getElementById('formAbonos');
const numPrestamo = document.getElementById('numPrestamo');
const empleadoA = document.getElementById('empleadoA');
const fechaA = document.getElementById('fechaA');
const montoOriginal = document.getElementById('montoOriginal');
const rebajoA = document.getElementById('rebajoA');
const saldoA = document.getElementById('saldoA');
const abono = document.getElementById('abono');
let ultimoAbono = 0;
let ultimoSaldo = 0;
let datos = '';
let opcion = '';
let listaAbonos;
let colon = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

verificarUsuario ();
cargarAbonos();

//Verifica si el usuario tiene acceso a esta página
function verificarUsuario () {
    const urlAccesos = 'http://localhost:8000/api/accesos/';
    const usuario = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAccesos + usuario)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            
            if (data[0].acc_prestamos !== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};

function mostrarAbonos(abonos) {
    listaAbonos = abonos;
    abonos.forEach((a, index) => {
        numPrestamo.textContent = JSON.parse(localStorage.getItem("prestamoid")) || false;
        empleadoA.textContent = a.nombre + ' ' + a.apellido1 + ' ' + a.apellido2;
        fechaA.textContent = new Date(a.fecha_solicitud).toLocaleDateString('es-ES');
        montoOriginal.textContent = colon.format(a.monto_solicitado);
        rebajoA.textContent = colon.format(a.rebajo_salarial);
        if(a.monto != null){
            datos += `<tr data-abono="${a.monto}">
                            <td class="text-center">${a.id_abono}</td>
                            <td class="text-center">${new Date(a.fecha_abono).toLocaleDateString('es-ES')}</td>
                            <td class="text-end">${colon.format(a.monto)}</td>
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
            ultimoAbono = a.monto;
            ultimoSaldo = a.saldo;
        } else{
            saldoA.textContent = colon.format(a.saldo);
            ultimoAbono = a.monto;
            ultimoSaldo = a.saldo;

        }
    });
    contenedorAbonos.innerHTML = datos;
};

function cargarAbonos() {
    const prestamo = JSON.parse(localStorage.getItem("prestamoid")) || false;
    console.log(prestamo);
    fetch(urlAbonos + prestamo)
        .then(response => response.json())
        .then(data => mostrarAbonos(data))

        .catch(error =>console.log(error))
};

//Boton de crear abre modal y limpio
btnCrear.addEventListener('click', ()=>{
    abono.value = "";  
    modalAbonoPrestamos.show();
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
    modalAbonoPrestamos.show();
});

//Borrar. 
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_abono = fila.firstElementChild.innerHTML;
    let saldo1 = ultimoSaldo;
    let saldo = saldo1 + ultimoAbono;
    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(urlAbonos+id_abono, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id_prestamo:numPrestamo.textContent,
                saldo:saldo
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
formAbonos.addEventListener('submit', (e)=> {
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
            fetch(urlAbonos, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    id_prestamo:numPrestamo.textContent,
                    monto:abono.value,
                    saldo:saldo
                    
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

            fetch(urlAbonos+idForm, {
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    monto:abono.value,
                    id_prestamo:numPrestamo.textContent,
                    saldo:saldo
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
    
    
    modalAbonoPrestamos.hide();

});
