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
    window.location = "marcasEmp.html";
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
                <div class="offcanvas-body" id= "menuLateral">
                    <div>
                        <a id="opcionesMenu" href="marcasEmpl.html">Marcas</a>
                    </div>
                    <div>
                        <a id="opcionesMenu" href="planillaUsr.html">Desglose de Salarios</a>
                    </div>
                    <div>
                        <a id="opcionesMenu" href="horasExtrasUsuario.html"> Pago de Horas Extras</a>
                    </div>
                    <div>
                        <a id="opcionesMenu" href="vacacionesUsuario.html">Vacaciones</a>
                    </div>
                    <div>
                        <a id="opcionesMenu" href="permisosUsuario.html">Permisos</a>
                    </div>
                    <div>
                        <a id="opcionesMenu" href="aguinaldoUsr.html">Aguinaldos</a>
                    </div>
                    <br>
                    <spam id="opcionesMenu">___________________ </spam>
                    <div id = "menuMarcasAdm"> </div>
                    <div id = "menuplanilla"> </div>
                    <div id = "menuHorasExtrasAdm"> </div>
                    <div id = "menuBonos"> </div>
                    <div id = "menuPrestamos"> </div>
                    <div id = "menuVacacionesAdm"> </div>
                    <div id = "menuPermisosAdm"> </div>
                    <div id = "menuIncapacidadesAdm"> </div>
                    <div id = "menuAguinaldoAdm"> </div>
                    <div id = "menuLiquidacionesAdm"> </div>
                    <div id = "menuMantenimientos"> </div>
                    <br>
                    <spam id="opcionesMenu">___________________ </spam>
                    <div id = "menuVacacionesJF"> </div> 
                    <div id = "menuPermisosJF"> </div>  
                    <div id = "menuHorasExtrasJef"> </div>          
                </div>
                `;

function tipoUsuario () {
    fetch(urlTipoUsuario + usuarioID)
        .then(response => response.json())
        .then(data => {
            console.log(data[0])
            if (data[0].acc_horasExtras_RRHH == 1) {
                menuMarcasAdm.innerHTML = 
                    `<div>
                        <a id="opcionesMenu" href="marcasAdm.html">Marcas</a>
                    </div>`
            };
            if (data[0].acc_planilla == 1) {
                menuplanilla.innerHTML = 
                    `<div>
                        <a id="opcionesMenu" href="planillaAdm.html">Planilla</a>
                    </div>
                    <div>
                        <a id="opcionesMenu" href="bonos.html">Bonos</a>
                    </div>`
            };
            if (data[0].acc_horasExtras_RRHH == 1) {
                menuHorasExtrasAdm.innerHTML = 
                    `<div>
                        <a id="ntfAdmExtras" href="horasExtrasAdm.html">Horas Extras Adm</a>
                    </div>`
            };
            if (data[0].acc_prestamos == 1) {
                menuPrestamos.innerHTML = 
                    `<div>
                        <a id="opcionesMenu" href="prestamos.html">Préstamos</a> 
                    </div>`
            };
            if (data[0].acc_vacaciones_RRHH == 1) {
                menuVacacionesAdm.innerHTML = 
                    `<div>
                        <a id="ntfAdmVacaciones" href="vacacionesAdm.html">Vacaciones RRHH</a> 
                    </div>`
            };
            if (data[0].acc_permisos_RRHH == 1) {
                menuPermisosAdm.innerHTML = 
                    `<div>
                        <a id="ntfAdmPermiso" href="permisosAdm.html">Permisos RRHH</a> 
                    </div>`
            };
            if (data[0].acc_incapacidades == 1) {
                menuIncapacidadesAdm.innerHTML = 
                    `<div>
                        <a id="opcionesMenu" href="incapacidadesAdm.html">Incapacidades RRHH</a> 
                    </div>`
            };
            if (data[0].acc_aguinaldo == 1) {
                menuAguinaldoAdm.innerHTML = 
                    `<div>
                        <a id="opcionesMenu" href="aguinaldoAdm.html">Aguinaldos</a> 
                    </div>`
            };
            if (data[0].acc_liquidacion == 1) {
                menuLiquidacionesAdm.innerHTML = 
                    `<div>
                        <a  id="opcionesMenu" href="liquidacionAdm.html">Liquidaciones</a> 
                    </div>`
            };
            if (data[0].acc_mantenimeintos == 1) {
                menuMantenimientos.innerHTML = 
                    `<div class="dropdown mt-3">
                        <a class="dropdown-toggle" id="opcionesMenu" href="#"  data-bs-toggle="dropdown" aria-expanded="false">
                            Mantenimientos
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end content" id="drop">
                            <li><a href="empleados.html">Empleados</a></li>
                            <li><a class="" href="puestos.html">Puestos</a></li>
                            <li><a class="" href="roles.html">Roles</a></li>
                            <li><a href="deduccionesLegales.html">Deducciones Legales</a></li>
                            <li><a href="feriados.html">Feriados</a></li>
                        </ul>
                    </div>`
            };
            if (data[0].acc_vacaciones_jefatura == 1) {
                menuVacacionesJF.innerHTML = 
                    `<div>
                        <a id="ntfVacaciones" href="vacacionesJefatura.html">Vacaciones Jefatura</a> 
                    </div>`
            };
            if (data[0].acc_permisos_jefatura == 1) {
                menuPermisosJF.innerHTML = 
                    `<div>
                        <a id="ntfPermiso" href="permisosJefatura.html">Permisos Jefatura</a> 
                    </div>`
            };
            if (data[0].acc_horasExtras_jefatura == 1) {
                menuHorasExtrasJef.innerHTML = 
                    `<div>
                        <a id="ntfExtras" href="horasExtrasJefatura.html">Horas Extras Jefatura</a> 
                    </div>`
            };
            
        })
        .catch(error => alert(error))
};

cerrarSesion.addEventListener("click", function (event) {
    // event.preventDefault(); 
    //localStorage.removeItem('userID');
    localStorage.clear();
 });
    
    
 notificacion.innerHTML = `
                            <li><a id="nuevaNotificacion" class="dropdown-item" href="#"></a></li>
                            `


document.addEventListener('DOMContentLoaded', () => {
    const nuevaNotificacion = document.getElementById('nuevaNotificacion');
    const urlNotificaciones = 'http://localhost:8000/api/notificaciones/';

    fetch(urlNotificaciones + usuarioID)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.error) {
                console.log('algo pasó', data.error);
            } else {
                if (data.length > 0){
                    campana.innerHTML = `<span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>`;
                    nuevaNotificacion.textContent = ("Tiene solicitudes pendiente(s)");
                }else{
                    nuevaNotificacion.textContent = "No tiene notificaciones recientes";
                }

                let hasPermiso = false;
                let hasExtras = false;
                let hasVacaciones = false;

                data.forEach(item => {
                    if (item.id_permiso) {
                        hasPermiso = true;
                    }
                    if (item.id_marca) {
                        hasExtras = true;
                    }
                    if (item.id_vacaciones) {
                        hasVacaciones = true;
                    }
                });
                if (hasPermiso) {
                    ntfPermiso.innerHTML = `Permisos Jefatura<span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>`;
                }
                if (hasExtras) {
                    ntfExtras.innerHTML = `Horas Extras Jefatura<span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>`;
                }
                if (hasVacaciones) {
                    ntfVacaciones.innerHTML = `Vacaciones Jefatura<span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>`;
                }
            }
        })
        .catch(error => console.log(error));
        



    fetch(urlNotificaciones, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            id_jefatura:usuarioID
        })
    })
    .then( response => response.json())
    .then(data => {
        console.log(data);
        if (data.error) {
            console.log('algo pasó', data.error);
        } else {
            if (data.length > 0){
                campana.innerHTML = `<span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>`;
                nuevaNotificacion.textContent = ("Tiene solicitudes pendiente(s)");
            }else{
                nuevaNotificacion.textContent = "No tiene notificaciones recientes";
            }

            let hasPermiso = false;
            let hasExtras = false;
            let hasVacaciones = false;

            data.forEach(item => {
                if (item.id_permiso) {
                    hasPermiso = true;
                }
                if (item.id_marca) {
                    hasExtras = true;
                }
                if (item.id_vacaciones) {
                    hasVacaciones = true;
                }
            });
            if (hasPermiso) {
                ntfAdmPermiso.innerHTML = `Permisos Adm<span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>`;
            }
            if (hasExtras) {
                ntfAdmExtras.innerHTML = `Horas Extras Adm<span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>`;
            }
            if (hasVacaciones) {
                ntfAdmVacaciones.innerHTML = `Vacaciones Adm<span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>`;
            }
        }
    })
    .catch(error => console.log(error));
});                          

