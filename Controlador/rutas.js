const express = require('express');
const cors = require('cors');
const puestosApp = require('./log_puestos');
const tipoIncapacidadApp = require('./log_tipoIncapacidad');
const empleadosApp = require('./log_empleados');
const puestosEmpleadosApp = require('./log_cargarPuestos');

const app = express();
app.use(cors());

// Ruta para puestos
app.use('/api/puestos', puestosApp);

// Ruta para tipo de incapacidad
app.use('/api/tipoIncapacidad', tipoIncapacidadApp);

// Ruta para tipo de incapacidad
app.use('/api/empleados', empleadosApp);
app.use('/api/puestosRegistrados', puestosEmpleadosApp);

//Errutamiento. Escucha del archhivo
const puerto = process.env.PUERTO || 8000;
app.listen(puerto, () => {
    console.log(`Servidor principal en ejecución en el puerto ${puerto}`);
});