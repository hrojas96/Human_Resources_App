'use strict'

//Variables
const urlI = 'http://localhost:8000/api/login/'
const loginForm = document.getElementById("loginForm");
const numEmpleado = document.getElementById('numEmpleado');
const contrasena = document.getElementById('contrasena');
const modalRecupPass = new bootstrap.Modal(document.getElementById('modalRecupPass'));
const formRecupPass = document.getElementById("formRecupPass");
const usuario = document.getElementById('usuarioRec');



// Agrega un evento submit al formulario de inicio de sesión
loginForm.addEventListener("submit", function (e) {
    
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
            window.location = "marcasEmpl.html"; 
        }else {
            alertify
            .alert('Error', 'Credenciales inválidas. Intentelo nuevamente');
        }

    })
    .catch((error) => {
        console.error("Error:", error);
    });
});

//Boton de crear abre modal y limpio
linkRecuperacion.addEventListener('click', ()=>{
    usuario.value = ""; 
    modalRecupPass.show();
});

formRecupPass.addEventListener("submit", function (e) {
    e.preventDefault(); 
    
    //alert(usuario.value);
    const usuarioID = usuario.value;

        if (!usuarioID) {
            alertify.alert('Error', 'Por favor, ingrese su número de empleado.');
            return;
        }

        alert(usuarioID); // Para depuración
    // Realiza una petición POST a la API
    fetch(urlI + usuario.value)
    .then((response) => response.json())
    .then((data) => {

        console.log(data);
        if (data.error) {
            
            alertify
                .alert('Aviso', data.error, function(){
                    alertify.message('OK');
                });
            //alert(data.error)
        } else {
            alertify
                .alert('Aviso', data.message, function(){
                    alertify.message('OK');
                    //window.location = "actualizarContrasena.html";
                });
        }
    })
    .catch((error) => console.error("Error en la solicitud:", error));
    modalRecupPass.hide();
    
});
