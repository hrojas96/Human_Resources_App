'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/empleados/';
const contenedorEmpleados = document.querySelector('tbody');
const modalEmpleados = new bootstrap.Modal(document.getElementById('modalEmpleados'))
const formEmpleados = document.getElementById('formEmpleados');
const cedula = document.getElementById('cedula');
const nombre = document.getElementById('nombre');
const apellido1 = document.getElementById('apellido1');
const apellido2 = document.getElementById('apellido2');
const genero = document.getElementById('genero');
const puesto = document.getElementById('puesto');
const fechaI = document.getElementById('fechaI');
const estado = document.getElementById('estado');
const correo = document.getElementById('correo');
const telefono = document.getElementById('telefono');
const provincia = document.getElementById('provincia');
const canton = document.getElementById('canton');
const distrito = document.getElementById('distrito');
const direccion = document.getElementById('direccion');
let opcion = '';
let resultados = '';

let puestoSelec;
let provinciaSelec;
let cantonSelec;
let distritoSelec;


cargarTabla();
cargarPuestos()


// Muestra resultados en cuanto la página carga
function mostrar(empleados) {
    empleados[0].forEach(e =>{
        resultados += ` <tr data-fecha="${e.fecha_ingreso.slice(0, 10)}" data-puesto="${e.id_puesto}" >
                            <td class="text-center">${e.id_empleado}</td>
                            <td class="text-center">${e.nombre}</td> 
                            <td class="text-center">${e.apellido1}</td> 
                            <td class="text-center">${e.apellido2}</td> 
                            <td class="text-center">${e.genero}</td> 
                            <td class="text-center">${e.puesto}</td> 
                            <td class="text-center">${new Date(e.fecha_ingreso).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${e.estado}</td> 
                            <td class="text-center">${e.correo}</td> 
                            <td class="text-center">${e.telefono}</td> 
                            <td class="text-center">${e.provincia}</td> 
                            <td class="text-center">${e.canton}</td> 
                            <td class="text-center">${e.distrito}</td> 
                            <td class="text-center">${e.direccion}</td> 
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
    contenedorEmpleados.innerHTML = resultados;
};
//Función para Mostrar resultados
function cargarTabla () {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrar(data))
        
        .catch(error => console.log(error))
};

//Boton de crear abre modal y limpio
btnCrear.addEventListener('click', ()=>{
    cedula.value = ""; 
    nombre.value = ""; 
    apellido1.value = ""; 
    apellido2.value = ""; 
    genero.value = ""; 
    puesto.value = ""; 
    fechaI.value = "";
    estado.value = ""; 
    correo.value = ""; 
    telefono.value = ""; 
    provincia.value = ""; 
    canton.value = ""; 
    distrito.value = ""; 
    direccion.value = ""; 
    modalEmpleados.show();
    opcion = 'crear';
});

cargarProvincia();
function cargarProvincia() {
    fetch('https://ubicaciones.paginasweb.cr/provincias.json')
    .then(response => response.json())
    .then(data => {
        let prov = "<option>Seleccione</option>";
        Object.entries(data).forEach(([i, province])  => {
            prov += `<option value=${i}>${province}</option>`;
        });
            provincia.innerHTML = prov;
        })
           
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
};
provincia.addEventListener('change', (e) => {
    provinciaSelec = e.target.options[e.target.selectedIndex].text; // Valor seleccionado del cliente
    cargarCanton();
});

function cargarCanton() { 
    console.log(provinciaSelec);
    fetch(`https://ubicaciones.paginasweb.cr/provincia/${provincia.value}/cantones.json`)
        .then(response => response.json())
        .then(data => {
            let cant = "<option>Seleccione</option>";
            Object.entries(data).forEach(([i, county])  => {
                cant += `<option value=${i}>${county}</option>`;
            });
            canton.innerHTML = cant;
        })
           
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
};
canton.addEventListener('change', (e) => {
    cantonSelec = e.target.options[e.target.selectedIndex].text; // Valor seleccionado del cliente
    cargarDistrito();
});

function cargarDistrito(){
    fetch(`https://ubicaciones.paginasweb.cr/provincia/${provincia.value}/canton/${canton.value}/distritos.json`)
    .then(response => response.json())
    .then(data => {
            let dist = "<option selected>Seleccione</option>";
            Object.entries(data).forEach(([i, city]) => {
                dist += `<option value=${i}>${city}</option>`;
            });
            distrito.innerHTML = dist;
        })
           
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
};
distrito.addEventListener('change', (e) => {
    distritoSelec = e.target.options[e.target.selectedIndex].text; // Valor seleccionado del cliente
   
});

//Carga lista de puestos registrados
function cargarPuestos() {
    fetch("http://localhost:8000/api/puestosRegistrados/")
        .then(response => response.json())
        .then(data => {
            // Recorre los datos y crea las opciones
            data.forEach((optionData) => {
                // Crea un elemento option
                const opcion = document.createElement("option");

                // Establece el valor y texto de la opción
                opcion.text = optionData.nombre_puesto;
                opcion.value = optionData.id_puesto;
                // Agrega la opción al elemento select
                puesto.add(opcion);    
            });
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
};
/*/Toma el id del puesto seleccionado (CREO QUE NO VOY A NECESITAR)
puesto.addEventListener('change', (e) => {
    puestoSelec = e.target.value;
    console.log('valor de puesto: '+puestoSelec);
});*/

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
on(document, 'click', '.btnEditar', e => {
    //Se asigna una posición a cada valor en la tabla para identificar el id
    const fila = e.target.closest('tr');
    const cedulaForm = fila.children[0].innerHTML;
    const nombreForm = fila.children[1].innerHTML;
    const apellido1Form = fila.children[2].innerHTML;
    const apellido2Form = fila.children[3].innerHTML;
    const generoForm = fila.children[4].innerHTML;
    //const puestoForm = fila.children[5].innerHTML;
    const puestoForm = fila.getAttribute('data-puesto');
    const fechaIForm = fila.getAttribute('data-fecha');
    const estadoForm = fila.children[7].innerHTML;
    const correoForm = fila.children[8].innerHTML;
    const telefonoForm = fila.children[9].innerHTML;
    const provinciaForm = fila.children[10].innerHTML;
    const cantonForm = fila.children[11].innerHTML;
    const distritoForm = fila.children[12].innerHTML;
    console.log(distritoForm);
    const direccionForm = fila.children[13].innerHTML;
    cedula.value = cedulaForm;
    nombre.value = nombreForm;
    apellido1.value = apellido1Form;
    apellido2.value = apellido2Form;
    genero.value = generoForm;
    puesto.value = puestoForm;
    fechaI.value = fechaIForm;
    estado.value = estadoForm;
    correo.value = correoForm;
    telefono.value = telefonoForm;
    provincia.value = provinciaForm;
    canton.value = cantonForm;
    distrito.value = distritoForm;
    console.log(distrito.value);
    direccion.value = direccionForm;
    opcion = 'editar';
    modalEmpleados.show();
});

//Borrar. 1 parent node toma solo los botones, el 2 toma toda la fila. Se toma el Id para pasarselo al API con target    
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_empleado = fila.firstElementChild.innerHTML;
    //alertify.confirm("¿Seguro que desea borrar este registro?").set('labels', {ok:'Eliminar', cancel:'Cancelar!'}), 

    alertify.confirm('Alerta', '&#191;¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_empleado, {
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
formEmpleados.addEventListener('submit', (e)=> {
    //let fechaFormateada = new Date(fechaI.value).toLocaleDateString('en-US');
    //console.log(fechaFormateada);
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
                id_empleado:cedula.value,
                nombre:nombre.value,
                apellido1:apellido1.value,
                apellido2:apellido2.value,
                genero:genero.value,
                id_puesto:puesto.value,
                fecha_ingreso:fechaI.value,
                estado:estado.value,
                correo:correo.value,
                telefono:telefono.value,
                provincia:provincia.value,
                canton:canton.value,
                distrito:distrito.value,
                direccion:direccion.value
                
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
        fetch(url+cedula.value, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                nombre:nombre.value,
                apellido1:apellido1.value,
                apellido2:apellido2.value,
                genero:genero.value,
                id_puesto:puesto.value,
                fecha_ingreso:fechaI.value,
                estado:estado.value,
                correo:correo.value,
                telefono:telefono.value,
                provincia:provincia.value,
                canton:canton.value,
                distrito:distrito.value,
                direccion:direccion.value
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
                //console.log('algo pasó')
                location.reload();
            }
        })
        .catch((error) => console.error("Error en la solicitud:", error));
    };
    
    modalEmpleados.hide();

});


