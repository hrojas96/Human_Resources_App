const header = document.getElementById('header');
const footer = document.getElementById('footer');

header.innerHTML = 
            `
            <!--Menu Vertical-->
            <div>
                <div class="container">
                <div class="btn-menu">
                    <label for="btn-menu"><i class="fa-solid fa-bars"></i></label>
                </div>
                    <div class="logo">
                        <h1>Faustica S.A.</h1>
                    </div>
                    <nav class="menu">
                        <a href="#"><i class="fa-solid fa-circle-user"></i></a>
                    </nav>
                </div>
            </div>
        

            <!--Menu Horizontal-->
            <input type="checkbox" id="btn-menu">
            <div class="container-menu">
                <div class="cont-menu">
                    <nav>
                        <img src="Img/logo.png" href="principal.html" alt="logo">
                        <a href="empleados.html">Empleados</a>
                        <a href="">Vacaciones</a>
                        <a href="">Incapacidades</a> 
                        <a href="prestamos.html">Préstamos</a> 
                        <li class="dropdown">
                            <a class="dropdown-toggle" id="droplist" href="#"  data-bs-toggle="dropdown" aria-expanded="false">
                                Mantenimientos
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end content" id="drop">
                                <li><a class="" href="puestos.html">Puestos</a></li>
                                <li><a class="" href="tipoIncapacidad.html">Tipo de Incapacidad</a></li>
                                <li><a class="" href="#">Something else here</a></li>
                            </ul>
                        </li>
                    </nav>
                    <label for="btn-menu"><i class="fa-solid fa-xmark"></i></label>
                </div>
            </div>
            `;

//footer.innerHTML = 
                    `<p>este es el footer</p>
                    `