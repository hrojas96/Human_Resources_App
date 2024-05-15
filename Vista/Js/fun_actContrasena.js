'use strict'

//Variables
const url = 'http://localhost:8000/api/login/';
const numEmpleado = document.getElementById('numEmpleado');
const passTemporal = document.getElementById('passTemporal');
const passNueva = document.getElementById('passNueva');
const passConfirmada = document.getElementById('passConfirmada');



btnActualizar.addEventListener('click', function (e) {
    
    if (passNueva.value == passConfirmada.value){
        const codigo = 1;
        fetch(url + numEmpleado.value, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                                contrasena:passTemporal.value,
                                nuevaContrasena:passNueva.value,
                                codigo:codigo
             }),
            })
            .then((response) => response.json())
            .then((data) => {
        
                //Respuesta de la API
                console.log(data);
                if (data.affectedRows == 1){
                    alertify.alert('¡Contraseña actualizada!. Será dirigido a la página principal para que inicie sesión', 
                        function(){ alertify.success('Ok'); 
                        window.location = "index.html"; });
                    
                }else {
                    alertify
                    .alert("Credenciales inválidas.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }else{
        alertify.error('Las constraseñas no coinciden');
    };

});


