const header = document.getElementById('header');
const notificaciones = document.getElementById('notificaciones');
const footer = document.getElementById('footer');

header.innerHTML =`

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
                            <a href="#"><i id="campana" class="fa-solid fa-bell"></i></a>
                        </nav>
                        <nav class="menu">
                            <a href="#"><i class="fa-solid fa-circle-user"></i></a>
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
                        <a href="">Vacaciones</a>
                    </div>
                    <div>
                        <a href="permisosJefatura.html">
                            Permisos Jefatura 
                            <span class="position-absolute  p-1 bg-danger border border-light rounded-circle"></span>
                        </a> 
                    </div>
                    <div>
                        <a href="prestamos.html">Préstamos</a> 
                    </div>
                    <div class="dropdown mt-3">
                        <a class="dropdown-toggle" id="droplist" href="#"  data-bs-toggle="dropdown" aria-expanded="false">
                            Mantenimientos
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end content" id="drop">
                            <li><a href="empleados.html">Empleados</a></li>
                            <li><a class="" href="puestos.html">Puestos</a></li>
                            <li><a class="" href="roles.html">Roles</a></li>
                            <li><a class="" href="tipoIncapacidad.html">Tipo de Incapacidad</a></li>
                        </ul>
                    </div>
                            
                                
                                
                                <a href="permisosEmp.html">Permisos Emp</a>
                            
                        
                </div>
           

                `;


notificaciones.innerHTML = 
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
    
});

//footer.innerHTML = 
                    `<p>este es el footer</p>
                    `