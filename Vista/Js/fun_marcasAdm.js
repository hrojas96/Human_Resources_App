const url = 'http://localhost:8000/api/marcasAdm/';
const contenedorMarcas = document.querySelector('tbody');
const modalMarcasAdm = new bootstrap.Modal(document.getElementById('modalMarcasAdm'))
const formMarcasAdm = document.getElementById('formMarcasAdm');
const empleado = document.getElementById('empleado');
const fecha = document.getElementById('fecha');
const horaEntrada = document.getElementById('horaEntrada');
const horaSalida = document.getElementById('horaSalida');
const horaOrdinarias = document.getElementById('horaOrdinarias');
const horasExtras = document.getElementById('horasExtras');

let resultados = '';
let opcion = '';
let marcasEmpleados = [];


cargarTabla();
cargarEmpleados();

function mostrarTabla(marcas) {
    marcasEmpleados = marcas;
    resultados = '';
    marcas.forEach(m =>{
        if (m.hora_salida == null ){
            m.hora_salida = "Pendiente";
            m.horas_ordinarias = "Pendiente";
        }
        
        resultados += ` <tr data-fecha="${m.fecha.slice(0, 10)}" data-idCliente="${m.id_empleado}">
                            <td class="text-center">${m.id_marca}</td>                     
                            <td class="text-center">${new Date(m.fecha).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${m.nombre} ${m.apellido1} ${m.apellido2}</td>
                            <td class="text-center">${m.hora_entrada}</td> 
                            <td class="text-center">${m.hora_salida}</td> 
                            <td class="text-center">${m.horas_ordinarias}</td>   
                            <td class="text-center">${m.horas_extras}</td> 
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
    contenedorMarcas.innerHTML = resultados;
};

function cargarTabla () {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrarTabla(data))
        
        .catch(error => console.log(error))
};

//Boton de crear abre modal y limpio
btnCrear.addEventListener('click', ()=>{
    empleado.value = ""; 
    fecha.value = ""; 
    horaEntrada.value = ""; 
    horaSalida.value = ""; 
    horaOrdinarias.value = ""; 
    horasExtras.value = ""; 
    modalMarcasAdm.show();
    opcion = 'crear';
});

//Carga lista de empleados registrados
function cargarEmpleados() {
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
                empleado.add(opcion);  
            });
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
};

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
    const fechaForm = fila.getAttribute('data-fecha');
    const empleadoForm = fila.getAttribute('data-idCliente');
    const horaEntradaForm = fila.children[3].innerHTML;
    const horaSalidaForm = fila.children[4].innerHTML;
    const horaOrdinariasForm = fila.children[5].innerHTML;
    const horasExtrasForm = fila.children[6].innerHTML;

    empleado.value = empleadoForm; 
    empleado.disabled = true ;
    fecha.value = fechaForm; 
    fecha.disabled = true ;
    horaEntrada.value = horaEntradaForm; 
    horaSalida.value = horaSalidaForm; 
    horaOrdinarias.value = horaOrdinariasForm; 
    horasExtras.value = horasExtrasForm; 
    opcion = 'editar';
    modalMarcasAdm.show();
});

//Borrar. 1 
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.closest('tr');
    const id_marca = fila.firstElementChild.innerHTML;
    
    alertify.confirm('Alerta', '¿Seguro que desea borrar este registro?',
    function(){

        fetch(url+id_marca, {
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

formMarcasAdm.addEventListener('submit', (e)=> {
    
    //Previene que se recargue la página
    e.preventDefault();  

    //Insert
    if (opcion == 'crear'){
        if (marcasEmpleados[0].fecha.slice(0, 10) == fecha.value && marcasEmpleados[0].id_empleado == empleado.value){
    
            alertify
                .alert('Aviso', 'Ya existe una marca de entrada registrada en el día y para el empleado indicado', function(){
                    alertify.message('OK');
                    
                });
                
        }else{
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    id_empleado:empleado.value,
                    fecha:fecha.value,
                    hora_entrada:horaEntrada.value,
                    hora_salida:horaSalida.value,
                    horas_ordinarias:horaOrdinarias.value,
                    horas_extras:horasExtras.value
                    
                })
            })
            .then( response => response.json())
            .then( data =>{
                console.log(data);
                if (data.error) {
                    
                    alertify
                        .alert('Aviso', data.error, function(){
                            alertify.message('OK');
                            location.reload();
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
        }
    };
    //Update
    if(opcion == 'editar'){
        fetch(url+idForm, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id_empleado:empleado.value,
                fecha:fecha.value,
                hora_entrada:horaEntrada.value,
                hora_salida:horaSalida.value,
                horas_ordinarias:horaOrdinarias.value,
                horas_extras:horasExtras.value
            })
        })
        .then( response => response.json())
        .then( data =>{
            console.log(data);
            if (data.error) {
                
                alertify
                    .alert('Aviso', data.error, function(){
                        alertify.message('OK');
                        location.reload();
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
    
    modalMarcasAdm.hide();

});

btnImprimir.addEventListener('click', ()=>{
    console.log('Contenedor', contenedorMarcas)
    console.log('resultados', resultados)

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    //Título del pdf
    doc.text(20,20, "Reporte de Marcas");

    const filas = [];
    const encabezado = ["Marca", "Fecha", "Entrada",  "Salida",  "Horas Ordinarias", "Horas Extras" ];
    document.querySelectorAll("tbody tr").forEach(fila => {
        const datos = [];
        fila.querySelectorAll("td").forEach(celda => {
            datos.push(celda.innerText);
        });
        filas.push(datos);
    });
    doc.autoTable({
        startY: 30,
        head: [encabezado],
        body:filas,
    })
    doc.save('reporte.pdf')
});