//const express = require('express');
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');


// Inicializa nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'u.proyectos23@gmail.com',
      pass: 'rjll rrce sdxe zpel'
    }
  });
  

  // Ruta del template
const handlebarOptions = {
  viewEngine: {
      partialsDir: path.resolve('./Servicios'),
      defaultLayout: false,
  },
  viewPath: path.resolve('./Controlador/Servicios'),
};
 

transporter.use('compile', hbs(handlebarOptions))


const opcionesEmpleados = (user, correo, pass ) => {
  return{
    from: '"Faustica S.A." <u.proyectos23@gmail.com>', 
    template: "emailEmpleados", 
    to: correo,
    subject: `Por favor cambie su contraseña`,
    context: {
      usuario: user,
      contrasena: pass
    },
  };
};


function correoEmpleados(user, correo, pass){
  //console.log('Funcionó' + user, correo);
  try {
    transporter.sendMail(opcionesEmpleados(user, correo, pass));
  } catch (error) {
    console.log(`Error al enviar el correo`, error);
  };
};

module.exports = { 
  correoEmpleados

 };