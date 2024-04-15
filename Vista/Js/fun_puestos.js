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

const on = (element, event, selector, handler) => { // on en un metodo de jquery que sirve para asignar eventos a los elementos del DOM
    element.addEventListener(event, e => { //element pasa todo el doc //event el click //selector el bnt borrar //handler lo que se libera

        if(e.target.closest(selector)){
            handler(e)
        };
    });
};

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
                console.error("Error:", data.error);
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
    /*/Update
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
                console.error("Error:", data.error);
                console.log(data.error)
                alert(data.error)
            } else {
                //console.log("resultado", data.filas);
                location.reload();
            }
        })
        .catch((error) => console.error("Error en la solicitud:", error));
    }*/
    
    
    
    modalPuestos.hide();

});



