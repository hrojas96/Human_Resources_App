const url = 'http://localhost:8000/api/marcas/';
const contenedorMarcas = document.querySelector('tbody');
const modalMarcas = new bootstrap.Modal(document.getElementById('modalMarcas'))
const formMarcas = document.getElementById('formMarcas');
const cedula = JSON.parse(localStorage.getItem("userID")) || false;
const codigoEntrada = document.getElementById('codigoEntrada');
const tiempoCodigo = document.getElementById('tiempoCodigo');


let opcion = '';
let resultados = '';
let marcasEmpleados = [];


cargarTabla();

function mostrarTabla(marcas) {
    marcasEmpleados = marcas;
    resultados = '';
    marcas.forEach(m =>{
        if (m.hora_salida == null ){
            m.hora_salida = "Pendiente";
            m.horas_ordinarias = "Pendiente";
        }
        if ( m.horas_extras == null ){
            m.horas_extras = "0";
        }
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

btnEntrada.addEventListener('click', ()=>{

    let date = new Date().toISOString().split('T')[0];
    if (marcasEmpleados[0].fecha.slice(0, 10) == date && marcasEmpleados[0].hora_entrada != ''){
    
        alertify
            .alert('Aviso', 'Ya existe una marca de entrada registrada el día de hoy', function(){
                alertify.message('OK');
                modalMarcas.hide();
            });
            
    }else{
        //Se crea el código de doble verificación
        let codigo = '';
        let str = '0123456789';
        for (let i = 1; i <= 5; i++) {
            let char = Math.floor(Math.random()
                * str.length + 1);
            codigo += str.charAt(char)
        };
        console.log(codigo);

        //Se encripta el código
        //const codigo = crypto.createHash('md5').update(pass).digest('hex');
        localStorage.setItem("codigoMarca", JSON.stringify(codigo));

        //Se envía el código al usuario por email
        fetch(url + cedula, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ codigo: codigo }),
        })
        .then((response) => response.json())
        .then( data =>{
            console.log(data);
            if (data.error) {
                
                alertify
                    .alert('Aviso', 'Ha ocurrido un error. Verifique que su correo sea correcto', function(){
                        alertify.message('OK');
                    });
                
            };
        })
        .catch((error) => console.error("Error en la solicitud:", error));

        //Configuración de cronómetro
        codigoEntrada.value = "";
        let temporizador = 45;
        let tiempo = setInterval(()=>{
            tiempoCodigo.textContent = temporizador + ' segundos';
            temporizador --;
            if (temporizador == 0){
                alertify
                        .alert('Alerta', `Su tiempo para el ingreso del código ha caducado. Por favor solicite uno
                                            nuevamente ingresando la marca de entrada`, function(){
                            alertify.message('OK');
                            clearInterval(tiempo);
                            location.reload();
                        });
                
            }
        }, 1000);

        modalMarcas.show();
        
    }   
    
});


formMarcas.addEventListener('submit', (e)=> {  
 
    e.preventDefault();  

    const codigoMarca = JSON.parse(localStorage.getItem("codigoMarca")) || false;
    if (codigoEntrada.value == codigoMarca){

        let DateTime = new Date();
        console.log(DateTime);
        let fechaFormato = DateTime.toLocaleDateString();
        console.log(fechaFormato);
        let fecha = fechaFormato.slice(0,10)
        console.log('Fecha: '+ fecha);
        let horaFormato = DateTime.toTimeString();
        let horaEntrada = horaFormato.slice(0,8);
        console.log('hora: '+ horaEntrada);
        
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
    }else{
        alertify
            .alert('Aviso', 'El código digitado es incorrecto, intentelo nuevamente', function(){
                alertify.message('OK');
            });

    }
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
    
    let date = new Date().toISOString().split('T')[0];
    if (marcasEmpleados[0].fecha.slice(0, 10) == date && marcasEmpleados[0].hora_salida != 'Pendiente'){
    
        alertify
            .alert('Aviso', 'Ya existe una marca de salida registrada el día de hoy', function(){
                alertify.message('OK');
                modalMarcas.hide();
            });
            
    }else{
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
    }
})

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