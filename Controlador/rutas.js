const express = require('express');
const cors = require('cors');
const puestosApp = require('./log_puestos');
const tipoIncapacidadApp = require('./log_tipoIncapacidad');

const app = express();
app.use(cors());

// Ruta para puestos
app.use('/api/puestos', puestosApp);

// Ruta para tipo de incapacidad
app.use('/api/tipoIncapacidad', tipoIncapacidadApp);


//Errutamiento. Escucha del archhivo
const puerto = process.env.PUERTO || 8000;
app.listen(puerto, () => {
    console.log(`Servidor principal en ejecución en el puerto ${puerto}`);
});