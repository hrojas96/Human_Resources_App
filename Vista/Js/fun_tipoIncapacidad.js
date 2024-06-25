'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/tipoIncapacidad/';
const contenedorIncapacidades = document.querySelector('tbody');
const modalIncapacidad = new bootstrap.Modal(document.getElementById('modalIncapacidad'))
const formIncapacidad = document.getElementById('formIncapacidad');
const incapacidad = document.getElementById('incapacidad');
const porcentajeSalarial = document.getElementById('porcentajeSalarial');
const diasSubcidio = document.getElementById('diasSubcidio');
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
    console.log('llegué a crear 2');
    incapacidad.value = ""; 
    porcentajeSalarial.value = ""; 
    diasSubcidio.value = ""; 
    modalIncapacidad.show();
    opcion = 'crear';
    console.log(opcion);
});


//Función para Mostrar resultados
function mostrar(incapacidades) {
    incapacidades.forEach(i =>{
        resultados += ` <tr>
                            <td class="text-center">${i.id_tipo_incapacidad}</td>
                            <td class="text-center">${i.concepto}</td>
                            <td class="text-center">${i.porcentaje_salarial}</td>
                            <td class="text-center">${i.dias_subcidio}</td>
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
    contenedorIncapacidades.innerHTML = resultados;
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
    const incapacidadForm = fila.children[1].innerHTML;
    const porcentajeSalarialForm = fila.children[2].innerHTML;
    const diasSubcidioForm = fila.children[3].innerHTML;
    incapacidad.value = incapacidadForm;
    porcentajeSalarial.value = porcentajeSalarialForm;
    diasSubcidio.value = diasSubcidioForm;
    opcion = 'editar';
    modalIncapacidad.show();
});

//Borrar. 1 parent node toma solo los botones, el 2 toma toda la fila. Se toma el Id para pasarselo al API con target    
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_tipo_incapacidad = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '&#191;¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_tipo_incapacidad, {
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
formIncapacidad.addEventListener('submit', (e)=> {
 
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
                concepto:incapacidad.value,
                porcentaje_salarial:porcentajeSalarial.value,
                dias_subcidio:diasSubcidio.value
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
                concepto:incapacidad.value,
                porcentaje_salarial:porcentajeSalarial.value,
                dias_subcidio:diasSubcidio.value
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
    
    modalIncapacidad.hide();

});
