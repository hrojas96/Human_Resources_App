'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/roles/';
const contenedorRoles = document.querySelector('tbody');
const modalRoles = new bootstrap.Modal(document.getElementById('modalRoles'))
const formRoles = document.getElementById('formRoles');
const rol = document.getElementById('rol');
const mantenimientos = document.getElementById('mantenimientos');
const planilla = document.getElementById('planilla');
const horasExtrasRRHH = document.getElementById('horasExtrasRRHH');
const prestamos = document.getElementById('prestamos');
const permisosRRHH = document.getElementById('permisosRRHH');
const vacacionesRRHH = document.getElementById('vacacionesRRHH');
const incapacidades = document.getElementById('incapacidades');
const aguinaldo = document.getElementById('aguinaldo');
const liquidaciones = document.getElementById('liquidaciones');
const horasExtrasJf = document.getElementById('horasExtrasJf');
const vacacionesJf = document.getElementById('vacacionesJf');
const permisosJf = document.getElementById('permisosJf');
const marcas = document.getElementById('marcas');

let opcion = '';
let resultados = '';


verificarUsuario ();
//Verifica si el usuario tiene acceso a esta página
function verificarUsuario () {
    const urlAccesos = 'http://localhost:8000/api/accesos/';
    const usuario = JSON.parse(localStorage.getItem("userID")) || false;
    fetch(urlAccesos + usuario)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            
            if (data[0].acc_mantenimeintos !== 1) {
                window.location = "404.html";
            }
        })
        .catch(error => alert(error))
};


//Boton de crear abre modal y limpio
btnCrear.addEventListener('click', ()=>{
    rol.value = ""; 
    mantenimientos.value = ""; 
    planilla.value = "";
    horasExtrasRRHH.value = "";
    prestamos.value = "";
    permisosRRHH.value = "";
    vacacionesRRHH.value = "";
    incapacidades.value = "";
    aguinaldo.value = "";
    liquidaciones.value = "";
    horasExtrasJf.value = "";
    vacacionesJf.value = "";
    permisosJf.value = "";
    marcas.value = "";
    modalRoles.show();
    opcion = 'crear';
});


//Función para Mostrar resultados
function mostrar(roles) {
    roles.forEach(r =>{
        resultados += ` <tr>
                            <td class="text-center">${r.id_rol}</td>
                            <td class="text-center">${r.nombre_rol}</td>
                            <td class="text-center">${r.acc_mantenimeintos}</td>
                            <td class="text-center">${r.acc_planilla}</td>
                            <td class="text-center">${r.acc_horasExtras_RRHH}</td>
                            <td class="text-center">${r.acc_prestamos}</td>
                            <td class="text-center">${r.acc_permisos_RRHH}</td>
                            <td class="text-center">${r.acc_vacaciones_RRHH}</td>
                            <td class="text-center">${r.acc_incapacidades}</td>
                            <td class="text-center">${r.acc_aguinaldo}</td>
                            <td class="text-center">${r.acc_liquidacion}</td>
                            <td class="text-center">${r.acc_horasExtras_jefatura}</td>
                            <td class="text-center">${r.acc_vacaciones_jefatura}</td>
                            <td class="text-center">${r.acc_permisos_jefatura}</td> 
                            <td class="text-center">${r.acc_marcas}</td>   
                            <td class="centrar"> 
                                <a class="btnEditar btn btn-primary btn-sm" style="background-color:#255387; border-color: #255387;">
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </a>
                                <a class="btnBorrar btn btn-danger btn-sm"> 
                                    <i class="fa-regular fa-trash-can"></i>
                                </a>
                            </td> 
                        </tr>`
    });
    contenedorRoles.innerHTML = resultados;
};

cargar();
// Muestra resultados en cuanto la página carga
function cargar () {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrar(data) )
        .catch(error => alert(error))
};

//Configuración de botones
// on en un metodo de jquery que sirve para asignar eventos a los elementos del DOM
const on = (element, event, selector, handler) => { 
    //element pasa todo el doc //event el click //selector el bnt borrar //handler lo que se libera
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
    const rolForm = fila.children[1].innerHTML;
    const mantenimientosForm = fila.children[2].innerHTML;
    const planillaForm = fila.children[3].innerHTML;
    const horasExtrasRRHHForm = fila.children[4].innerHTML;
    const prestamosForm = fila.children[5].innerHTML;
    const permisosRRHHForm = fila.children[6].innerHTML;
    const vacacionesRRHHForm = fila.children[7].innerHTML;
    const incapacidadesForm = fila.children[8].innerHTML;
    const aguinaldoForm = fila.children[9].innerHTML;
    const liquidacionesForm = fila.children[10].innerHTML;
    const horasExtrasJfForm = fila.children[11].innerHTML;
    const vacacionesJfForm = fila.children[12].innerHTML;
    const permisosJfForm = fila.children[13].innerHTML;
    const marcasForm = fila.children[14].innerHTML;

    rol.value = rolForm;
    mantenimientos.value = mantenimientosForm;
    planilla.value = planillaForm;
    horasExtrasRRHH.value = horasExtrasRRHHForm;
    prestamos.value = prestamosForm;
    permisosRRHH.value = permisosRRHHForm;
    vacacionesRRHH.value = vacacionesRRHHForm;
    incapacidades.value = incapacidadesForm;
    aguinaldo.value = aguinaldoForm;
    liquidaciones.value = liquidacionesForm;
    horasExtrasJf.value = horasExtrasJfForm;
    vacacionesJf.value = vacacionesJfForm;
    permisosJf.value = permisosJfForm;
    marcas.value = marcasForm;
    
    opcion = 'editar';
    modalRoles.show();
});

//Borrar. 1 parent node toma solo los botones, el 2 toma toda la fila. Se toma el Id para pasarselo al API con target    
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_rol = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '&#191;¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_rol, {
            method: 'DELETE'
        })
        .then( res => res.json() )
        .then( ()=> location.reload())
        
    },
    function(){
        alertify.error('Cancelado');
    });
});

//Guardar cambios editados o creados
formRoles.addEventListener('submit', (e)=> {
 
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
                nombre_rol:rol.value,
                acc_mantenimeintos:mantenimientos.value,
                acc_planilla:planilla.value,
                acc_horasExtras_RRHH:horasExtrasRRHH.value,
                acc_prestamos:prestamos.value,
                acc_permisos_RRHH:permisosRRHH.value,
                acc_vacaciones_RRHH:vacacionesRRHH.value,
                acc_incapacidades:incapacidades.value,
                acc_aguinaldo:aguinaldo.value,
                acc_liquidacion:liquidaciones.value,
                acc_horasExtras_jefatura:horasExtrasJf.value,
                acc_vacaciones_jefatura:vacacionesJf.value,
                acc_permisos_jefatura:permisosJf.value,
                acc_marcas:marcas.value
            })
        })
        .then( response => response.json())
        .then( data =>{
            console.log(data);
            if (data.error) {
                
                alertify
                    .alert(data.error, function(){
                        alertify.message('OK');
                    });
                //alert(data.error)
            } else {
                location.reload();
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
                nombre_rol:rol.value,
                acc_mantenimeintos:mantenimientos.value,
                acc_planilla:planilla.value,
                acc_horasExtras_RRHH:horasExtrasRRHH.value,
                acc_prestamos:prestamos.value,
                acc_permisos_RRHH:permisosRRHH.value,
                acc_vacaciones_RRHH:vacacionesRRHH.value,
                acc_incapacidades:incapacidades.value,
                acc_aguinaldo:aguinaldo.value,
                acc_liquidacion:liquidaciones.value,
                acc_horasExtras_jefatura:horasExtrasJf.value,
                acc_vacaciones_jefatura:vacacionesJf.value,
                acc_permisos_jefatura:permisosJf.value,
                acc_marcas:marcas.value
            })
        })
        .then( response => response.json())
        .then( data =>{
            if (data.error) {
                
                alertify
                    .alert(data.error, function(){
                        alertify.message('OK');
                    });
                //alert(data.error)
            } else {
                
                location.reload();
            }
        })
        .catch((error) => console.error("Error en la solicitud:", error));
    };
    
    modalRoles.hide();

});