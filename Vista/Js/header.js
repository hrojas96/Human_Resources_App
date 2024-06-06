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

//<a id="iconos" href="#"><i id="campana" class="fa-solid fa-bell"></i> <span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span></a>
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
                        <nav class="menu btn-group dropdown">
                            <a id="iconos" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i id="campana" class="fa-solid fa-bell"></i>
                            </a>
                            <ul class="dropdown-menu">
                                <div id = "notificacion"> </div>
                            </ul>
                        </nav>
                        <nav class="menu btn-group dropdown">
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
                        <a href="marcasEmpl.html">Marcas</a>
                    </div>
                    <div>
                        <a href="permisosUsuario.html">Permisos</a>
                    </div>
                    <br>
                    <spam>___________________ </spam>
                    <br><br>
                    <div id = "planilla"> </div>
                    <div id = "menuHorasExtras"> </div>
                    <div id = "menuPrestamos"> </div>
                    <div id = "menuMantenimientos"> </div>
                    <div id = "menuPermisosAdm"> </div>
                    <div id = "menuPermisosJF"> </div>           
                </div>
                `;

function tipoUsuario () {
    fetch(urlTipoUsuario + usuarioID)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            if (data[0].acc_planilla == 1) {
                planilla.innerHTML = 
                    `<div>
                        <a href="planilla.html">Planilla</a>
                    </div>`
            };
            if (data[0].acc_horasExtras_RRHH == 1) {
                menuHorasExtras.innerHTML = 
                    `<div>
                        <a href="horasExtras_RRHH.html">Horas Extras</a>
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
            if (data[0].acc_permisos_RRHH == 1) {
                menuPermisosAdm.innerHTML = 
                    `<div>
                        <a id= "ntfPermiso" href="permisosAdm.html">Permisos RRHH</a> 
                    </div>`
            };
            if (data[0].acc_permisos_jefatura == 1) {
                menuPermisosJF.innerHTML = 
                    `<div>
                        <a id= "ntfPermiso" href="permisosJefatura.html">Permisos Jefatura</a> 
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
    
    
 notificacion.innerHTML = `
                            <li><a id="nuevaNotificacion" class="dropdown-item" href="#"></a></li>
                            `


document.addEventListener('DOMContentLoaded', () => {
    const nuevaNotificacion = document.getElementById('nuevaNotificacion');

    fetch('http://localhost:8000/api/notificaciones/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.error) {
                console.log('algo pasó', data.error);
            } else {
                if (data.length > 0){
                    campana.innerHTML = `<span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>`;
                    nuevaNotificacion.textContent = ("Tiene " + data.length +  " solicitud(es) pendiente(s)");
                }else{
                    nuevaNotificacion.textContent = "No tiene notificaciones recientes";
                }
                if (data[0].id_permiso) {
                    ntfPermiso.innerHTML = `Permisos Jefatura<span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>`;
                }
            }
        })
        .catch(error => console.log(error));
    
});                          

