const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());





//Errutamiento. Escucha del archhivo
const puerto = process.env.PUERTO || 4000;
app.listen(puerto, () => {
    console.log(`Servidor principal en ejecución en el puerto ${puerto}`);
});