const express = require('express');
const cors = require('cors');
const loginApp = require('./log_login');
const puestosApp = require('./log_puestos');
const tipoIncapacidadApp = require('./log_tipoIncapacidad');
const empleadosApp = require('./log_empleados');
const puestosEmpleadosApp = require('./log_cargarPuestos');
const prestamosApp = require('./log_prestamos');
const listaEmpleadosApp = require('./log_cargar_empleados');
const abonosApp = require('./log_abonosPrestamo');


const app = express();
app.use(cors());

// Ruta para login
app.use('/api/login', loginApp);


// Ruta para puestos
app.use('/api/puestos', puestosApp);

// Ruta para tipo de incapacidad
app.use('/api/tipoIncapacidad', tipoIncapacidadApp);

// Ruta para empleados
app.use('/api/empleados', empleadosApp);
app.use('/api/puestosRegistrados', puestosEmpleadosApp);

// Ruta para prestamos
app.use('/api/prestamos', prestamosApp);
app.use('/api/clientesRegistrados', listaEmpleadosApp);

// Ruta para abonos de prestamos
app.use('/api/abonoPrestamos', abonosApp);

//Errutamiento. Escucha del archhivo
const puerto = process.env.PUERTO || 8000;
app.listen(puerto, () => {
    console.log(`Servidor principal en ejecución en el puerto ${puerto}`);
});