'use strict'

//Variables
const urlI = 'http://localhost:8000/api/login/'
const loginForm = document.getElementById("loginForm");
const numEmpleado = document.getElementById('numEmpleado');
const contrasena = document.getElementById('contrasena');


// Agrega un evento submit al formulario de inicio de sesión
loginForm.addEventListener("submit", function (e) {
    console.log('llego 1');
    e.preventDefault(); 
    // Realiza una petición POST a la API
    fetch(urlI + numEmpleado.value, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ contrasena: contrasena.value }),
    })
    .then((response) => response.json())
    .then((data) => {

        //Respuesta de la API
        console.log(data);
        if (data.success == true){
            localStorage.setItem("userID", JSON.stringify(numEmpleado.value));
            window.location = "principal.html"; 
        }else {
            alertify
            .alert('Error', 'Credenciales inválidas. Intentelo nuevamente');
        }

    })
    .catch((error) => {
        console.error("Error:", error);
    });
});


