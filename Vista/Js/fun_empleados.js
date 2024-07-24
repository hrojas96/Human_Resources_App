'use strict'

//VARIABLES
const url = 'http://localhost:8000/api/empleados/';
const urlDirecciones = 'http://localhost:8000/api/direcciones/';
const contenedorEmpleados = document.querySelector('tbody');
const modalEmpleados = new bootstrap.Modal(document.getElementById('modalEmpleados'));
const formEmpleados = document.getElementById('formEmpleados');
const cedula = document.getElementById('cedula');
const nombre = document.getElementById('nombre');
const apellido1 = document.getElementById('apellido1');
const apellido2 = document.getElementById('apellido2');
const genero = document.getElementById('genero');
const puesto = document.getElementById('puesto');
const rolUsuario = document.getElementById('rolUsuario');
const jefatura = document.getElementById('jefatura');
const fechaI = document.getElementById('fechaI');
const estado = document.getElementById('estado');
const correo = document.getElementById('correo');
const telefono = document.getElementById('telefono');
const estadoCivil = document.getElementById('estadoCivil');
const cantHijjos = document.getElementById('cantHijjos');
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

verificarUsuario();
cargarTabla();
cargarPuestos();
cargarRoles();
cargarJefaturas();

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


// Muestra resultados en cuanto la página carga
function mostrar(empleados) {
    empleados[0].forEach(e =>{
        resultados += ` <tr data-fecha="${e.fecha_ingreso.slice(0, 10)}" 
                            data-puesto="${e.id_puesto}" data-rol="${e.id_rol}" 
                            data-jefatura="${e.id_jefatura}"
                            data-provincia="${e.id_provincia}"
                            data-canton="${e.id_canton}"
                            data-distrito="${e.id_distrito}" >
                            <td class="text-center">${e.id_empleado}</td>
                            <td class="text-center">${e.nombre}</td> 
                            <td class="text-center">${e.apellido1}</td> 
                            <td class="text-center">${e.apellido2}</td> 
                            <td class="text-center">${e.genero}</td> 
                            <td class="text-center">${e.puesto}</td>
                            <td class="text-center">${e.rol}</td>  
                            <td class="text-center">${e.jefaturaN}</td> 
                            <td class="text-center">${new Date(e.fecha_ingreso).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${e.estado}</td> 
                            <td class="text-center">${e.correo}</td> 
                            <td class="text-center">${e.telefono}</td> 
                            <td class="text-center">${e.estado_civil}</td>
                            <td class="text-center">${e.hijos_dependientes}</td> 
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
    rolUsuario.value = ""; 
    jefatura.value = "";
    fechaI.value = "";
    estado.value = ""; 
    correo.value = ""; 
    telefono.value = ""; 
    estadoCivil.value = ""; 
    cantHijjos.value = ""; 
    provincia.value = ""; 
    canton.value = ""; 
    distrito.value = ""; 
    direccion.value = ""; 
    modalEmpleados.show();
    opcion = 'crear';
});

cargarProvincia();
function cargarProvincia() {
    fetch(urlDirecciones)
    .then(response => response.json())
    .then(data => {
        // Recorre los datos y crea las opciones
        data.forEach((optionData) => {
            // Crea un elemento option
            const opcion = document.createElement("option");

            // Establece el valor y texto de la opción
            opcion.text = optionData.descripcion;
            opcion.value = optionData.id_provincia;
            // Agrega la opción al elemento select
            provincia.add(opcion);
        });
    })
           
    .catch(error => {
        console.error("Error al obtener los datos");
    });
};

provincia.addEventListener('change', (e) => {
    fetch(urlDirecciones + provincia.value)
    .then(response => response.json())
    .then(data => {
        // Recorre los datos y crea las opciones
        data.forEach((optionData) => {
            // Crea un elemento option
            const opcion = document.createElement("option");

            // Establece el valor y texto de la opción
            opcion.text = optionData.descripcion;
            opcion.value = optionData.id_canton;
            // Agrega la opción al elemento select
            canton.add(opcion);
        });
    })
           
    .catch(error => {
        console.error("Error al obtener los datos");
    });
});

canton.addEventListener('change', (e) => {

    fetch(urlDirecciones, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            id_canton:canton.value,
            
        })
    })
    .then(response => response.json())
    .then(data => {
        // Recorre los datos y crea las opciones
        data.forEach((optionData) => {
            // Crea un elemento option
            const opcion = document.createElement("option");

            // Establece el valor y texto de la opción
            opcion.text = optionData.descripcion;
            opcion.value = optionData.id_distrito;
            // Agrega la opción al elemento select
            distrito.add(opcion);
        });
    })
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

//Carga lista de roles registrados
function cargarRoles() {
    fetch("http://localhost:8000/api/rolesRegistrados/")
        .then(response => response.json())
        .then(data => {
            // Recorre los datos y crea las opciones
            data.forEach((optionData) => {
                // Crea un elemento option
                const opcion = document.createElement("option");

                // Establece el valor y texto de la opción
                opcion.text = optionData.nombre_rol;
                opcion.value = optionData.id_rol;
                // Agrega la opción al elemento select
                rolUsuario.add(opcion);    
            });
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
};

//Carga lista de jefaturas registradas
function cargarJefaturas() {
    fetch("http://localhost:8000/api/empleadosRegistrados/")
        .then(response => response.json())
        .then(data => {
            // Recorre los datos y crea las opciones
            data.forEach((optionData) => {
                // Crea un elemento option
                const opcion = document.createElement("option");

                // Establece el valor y texto de la opción
                opcion.text = `${optionData.nombre} ${optionData.apellido1} ${optionData.apellido2}`;
                opcion.value = optionData.id_empleado;
                // Agrega la opción al elemento select
                jefatura.add(opcion);    
            });
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
};

//Configuración de botones
const on = (element, event, selector, handler) => { 
    // on en un metodo de jquery que sirve para asignar eventos a los elementos del DOM
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
    const puestoForm = fila.getAttribute('data-puesto');
    const rolUsuarioForm = fila.getAttribute('data-rol');
    const jefaturaForm = fila.getAttribute('data-jefatura');
    const fechaIForm = fila.getAttribute('data-fecha');
    const estadoForm = fila.children[9].innerHTML;
    const correoForm = fila.children[10].innerHTML;
    const telefonoForm = fila.children[11].innerHTML;
    const estadoCivilForm = fila.children[12].innerHTML;
    const cantHijjosForm = fila.children[13].innerHTML;
    const provinciaForm = fila.getAttribute('data-provincia');
    const cantonForm = fila.getAttribute('data-canton');
    const distritoForm = fila.getAttribute('data-distrito');
    const direccionForm = fila.children[17].innerHTML;

    cedula.value = cedulaForm;
    nombre.value = nombreForm;
    apellido1.value = apellido1Form;
    apellido2.value = apellido2Form;
    genero.value = generoForm;
    puesto.value = puestoForm;
    rolUsuario.value = rolUsuarioForm;
    jefatura.value = jefaturaForm;
    fechaI.value = fechaIForm;
    estado.value = estadoForm;
    correo.value = correoForm;
    telefono.value = telefonoForm;
    estadoCivil.value = estadoCivilForm; 
    cantHijjos.value = cantHijjosForm;
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
    
    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_empleado, {
            method: 'DELETE'
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
formEmpleados.addEventListener('submit', (e)=> {
    
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
                id_rol:rolUsuario.value,
                id_jefatura:jefatura.value,
                fecha_ingreso:fechaI.value,
                estado:estado.value,
                correo:correo.value,
                telefono:telefono.value,
                estado_civil:estadoCivil.value, 
                hijos_dependientes:cantHijjos.value,
                id_provincia:provincia.value,
                id_canton:canton.value,
                id_distrito:distrito.value,
                direccion:direccion.value
                
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
                id_rol:rolUsuario.value,
                id_jefatura:jefatura.value,
                fecha_ingreso:fechaI.value,
                estado:estado.value,
                correo:correo.value,
                telefono:telefono.value,
                estado_civil:estadoCivil.value, 
                hijos_dependientes:cantHijjos.value,
                id_provincia:provincia.value,
                id_canton:canton.value,
                id_distrito:distrito.value,
                direccion:direccion.value
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
    
    modalEmpleados.hide();

});


