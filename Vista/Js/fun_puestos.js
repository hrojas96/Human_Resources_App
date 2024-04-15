'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/puestos/';
const contenedorPuestos = document.querySelector('tbody');
const modalPuestos = new bootstrap.Modal(document.getElementById('modalPuestos'))
const formPuestos = document.getElementById('formPuestos');
const puesto = document.getElementById('puesto');
const salarioBase = document.getElementById('salarioBase');
let opcion = '';
let resultados = '';


//Boton de crear abre modal y limpio
btnCrear.addEventListener('click', ()=>{
    console.log('llegué a crear 2');
    puesto.value = ""; 
    salarioBase.value = ""; 
    modalPuestos.show();
    opcion = 'crear';
    console.log(opcion);
});


//Función para Mostrar resultados
const mostrar = (puestos) =>{
    puestos.forEach(p =>{
        resultados += ` <tr>
                            <td>${p.id_puesto}</td>
                            <td>${p.nombre_puesto}</td> 
                            <td>${p.monto_por_hora}</td>   
                            <td class="text-center"> <a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td> 
                        </tr>`
    });
    contenedorPuestos.innerHTML = resultados;
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
    const fila = e.target.parentNode.parentNode;
    idForm = fila.children[0].innerHTML;
    const puestoForm = fila.children[1].innerHTML;
    const salarioBaseForm = fila.children[2].innerHTML;
    puesto.value = puestoForm;
    salarioBase.value = salarioBaseForm;
    opcion = 'editar';
    modalPuestos.show();
});

//Guardar cambios editados o creados
formPuestos.addEventListener('submit', (e)=> {
 
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
                nombre_puesto:puesto.value,
                monto_por_hora:salarioBase.value
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
                nombre_puesto:puesto.value,
                monto_por_hora:salarioBase.value
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
    
    modalPuestos.hide();

});



