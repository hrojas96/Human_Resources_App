const url = 'http://localhost:8000/api/marcasAdm/';
const contenedorMarcas = document.querySelector('tbody');
let resultados = '';


cargarTabla();

function mostrarTabla(marcas) {
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
                            <td class="text-center">${m.nombre} ${m.apellido1} ${m.apellido2}</td>
                            <td class="text-center">${m.hora_entrada}</td> 
                            <td class="text-center">${m.hora_salida}</td> 
                            <td class="text-center">${m.horas_ordinarias}</td>   
                            <td class="text-center">${m.horas_extras}</td> 
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