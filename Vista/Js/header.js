const urlTipoUsuario = 'http://localhost:8000/api/accesos/';
const usuarioID = JSON.parse(localStorage.getItem("userID")) || false;
const menuGeneral = document.getElementById('menuGeneral');
const notificaciones = document.getElementById('notificaciones');

verificarIngreso();
tipoUsuario ();

//No permite el ingreso a la app si no ha iniciado sesión
function verificarIngreso() {

  if (!usuarioID){
      
    alertify.alert('Acceso Denegado', ' Por favor, inicie sesión');
      window.location = "index.html";  
  } ;
};


menuGeneral.innerHTML =`

                <!--Menu Vertical-->
                <div>
                    <div class="container">
                    <div class="btn-menu">
                        <label for="btn-menu" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions"><i class="fa-solid fa-bars"></i></label>
                    </div>
                        <div class="logo">
                            <h1>Faustica S.A.</h1>
                        </div>
                        <nav class="menu">
                            <a id="iconos" href="#"><i id="campana" class="fa-solid fa-bell"></i></a>
                        </nav>
                        <nav class="menu btn-group dropstart">
                                <a id="iconos" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-circle-user"></i>
                                </a>
                                <ul class="dropdown-menu">
                                    <a id="cerrarSesion" href="index.html">Cerrar Sesión</i></a>
                                </ul>
                        </nav>
                    </div>
                </div>

                <!--Menu Horizontal-->
                <div class="offcanvas  offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                <div class="offcanvas-header">
                    <img src="Img/logo.png" href="principal.html" alt="logo">
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div>
                        <a href="permisosEmp.html">Permisos Emp</a>
                    </div>
                    <br>
                    <spam>___________________ </spam>
                    <br><br>
                    <div id = "menuVacaciones"> </div>
                    <div id = "menuPrestamos"> </div>
                    <div id = "menuMantenimientos"> </div>
                    <div id = "menuPermisosJF"> </div>           
                </div>
                `;

function tipoUsuario () {
    fetch(urlTipoUsuario + usuarioID)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            if (data[0].acc_vacaciones_RRHH == 1) {
                menuVacaciones.innerHTML = 
                    `<div>
                        <a href="">Vacaciones</a>
                    </div>`
            };
            if (data[0].acc_prestamos == 1) {
                menuPrestamos.innerHTML = 
                    `<div>
                        <a href="prestamos.html">Préstamos</a> 
                    </div>`
            };
            if (data[0].acc_mantenimeintos == 1) {
                menuMantenimientos.innerHTML = 
                    `<div class="dropdown mt-3">
                        <a class="dropdown-toggle" id="droplist" href="#"  data-bs-toggle="dropdown" aria-expanded="false">
                            Mantenimientos
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end content" id="drop">
                            <li><a href="empleados.html">Empleados</a></li>
                            <li><a class="" href="puestos.html">Puestos</a></li>
                            <li><a class="" href="roles.html">Roles</a></li>
                            <li><a class="" href="tipoIncapacidad.html">Tipo de Incapacidad</a></li>
                        </ul>
                    </div>`
            };
            if (data[0].acc_permisos_jefatura == 1) {
                menuPermisosJF.innerHTML = 
                    `<div>
                        <a href="permisosJefatura.html">
                            Permisos Jefatura 
                            <span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>
                        </a> 
                    </div>`
            };
            
        })
        .catch(error => alert(error))
    };

cerrarSesion.addEventListener("click", function (event) {
    // event.preventDefault(); 
        localStorage.removeItem('userID');
        localStorage.removeItem('prestamoid');
        window.location = "index.html";
    });


/*notificaciones.innerHTML = 
                `
            <div aria-live="polite" aria-atomic="true" class="position-relative">
                <div class="toast-container top-0 end-0 p-3">
                  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <i class="fa-solid fa-circle-exclamation"></i>
                      <strong class="me-auto">.. Tomar Acción</strong>
                      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div id="nuevaNotificacion" class="toast-body">
                    </div>
                  </div>
                </div>
            </div>
                `;

document.addEventListener('DOMContentLoaded', () => {
    const nuevaNotificacion = document.getElementById('nuevaNotificacion');
    nuevaNotificacion.textContent = "Tiene solicitudes pendientes";
    const toastElList = document.querySelectorAll('.toast');
    const toastList = Array.from(toastElList).map(toastEl => new bootstrap.Toast(toastEl, { autohide: false }));
    fetch('http://localhost:8000/api/notificaciones/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.error) {
                console.log('algo pasó', data.error);
            } else {
                //const campana = document.getElementById('campana');
                campana.textContent = `<span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>`;
                toastList.forEach(toast => toast.show());
            }
        })
        .catch(error => console.log(error));
    
});*/
