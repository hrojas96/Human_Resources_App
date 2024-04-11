const express = require('express');
const cors = require('cors');
var mysql = require('mysql');

const ruta = express();
ruta.use(cors());



//Parámetros de conexión
const conexion = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'basedatos96',
   port: 3306,
   database: 'FausticaSA'
})

//Conexión a la base de datos
conexion.connect(function(error){
   if(error){
       throw error
   }else{
       console.log("¡Conexión exitosa a la base de datos!");
   }
});



// Exporta la conexión
module.exports = {
    conexion
 };






//npm init -y
//npm install express --save
//npm install mysql
//npm install cors