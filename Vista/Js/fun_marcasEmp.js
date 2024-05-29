const url = 'http://localhost:8000/api/marcas/';
const contenedorMarcas = document.querySelector('tbody');
const modalMarcas = new bootstrap.Modal(document.getElementById('modalMarcas'))
const formMarcas = document.getElementById('formEmpleados');
const cedula = JSON.parse(localStorage.getItem("userID")) || false;
const codigoEntrada = document.getElementById('codigoEntrada');
const tiempoCodigo = document.getElementById('tiempoCodigo');

let opcion = '';
let resultados = '';


cargarTabla();

function mostrarTabla(marcas) {
    marcas.forEach(m =>{
        resultados += ` <tr>
                            <td class="text-center">${m.id_marca}</td>                     
                            <td class="text-center">${new Date(m.fecha).toLocaleDateString('es-ES')}</td> 
                            <td class="text-center">${m.hora_entrada}</td> 
                            <td class="text-center">${m.hora_salida}</td> 
                            <td class="text-center">${m.horas_ordinarias}</td>   
                            <td class="text-center">${m.horas_extras}</td> 
                        </tr>`
    });
    contenedorMarcas.innerHTML = resultados;
};

function cargarTabla () {
    fetch(url+cedula)
        .then(response => response.json())
        .then(data => mostrarTabla(data))
        
        .catch(error => console.log(error))
};

/*btnEntrada.addEventListener('click', ()=>{
    //empieza a correr cronómetro
    codigoEntrada.value = "";
    modalMarcas.show();
    opcion = 'crear';
});*/

//formEmpleados.addEventListener('submit', (e)=> {
btnEntrada.addEventListener('click', (e)=>{   
    console.log('se marcó la entrada');
    //e.preventDefault();  
    let DateTime = new Date();
    console.log(DateTime);
    let fechaFormato = DateTime.toLocaleDateString();
    console.log(fechaFormato);
    let fecha = fechaFormato.slice(0,10)
    console.log('Fecha: '+ fecha);
    let horaFormato = DateTime.toTimeString();
    let horaEntrada = horaFormato.slice(0,8)
    console.log('hora: '+ horaEntrada);

    //Insert
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            id_empleado:cedula,
            fecha:fecha,
            hora_entrada:horaEntrada
            
        })
    })
    .then( response => response.json())
    .then( data =>{
        console.log(data);
        if (data.error) {
            
            alertify.alert(data.error, function(){
                    alertify.message('OK');
                });
            
        } else {
            location.reload();
        }
    })
    .catch((error) => console.error("Error en la solicitud:", error));

    modalMarcas.hide();
        
});

btnSalida.addEventListener('click', ()=>{
    console.log('se marcó la salida')
    let DateTime = new Date();
    console.log(DateTime);
    let fechaFormato = DateTime.toLocaleDateString();
    console.log(fechaFormato);
    let fecha = fechaFormato.slice(0,10)
    console.log('Fecha: '+ fecha);
    let horaFormato = DateTime.toTimeString();
    let horaSalida = horaFormato.slice(0,8)
    
    fetch(url+cedula, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            id_empleado:cedula,
            fecha:fecha,
            hora_salida:horaSalida
        })
    })
    .then( response => response.json())
    .then( data =>{
        if (data.error) {
            
            alertify.alert(data.error, function(){
                    alertify.message('OK');
                });
            
        } else {
            //console.log('algo pasó')
            location.reload();
        }
    })
    .catch((error) => console.error("Error en la solicitud:", error));
    });