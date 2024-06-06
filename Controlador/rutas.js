const express = require('express');
const cors = require('cors');
const loginApp = require('./LoginController');
const accesosApp = require('./AccesosController');
const notificacionApp = require('./NotificacionesController');
const marcasUsrApp = require('./Marcas_UsrController');
const puestosApp = require('./PuestosController');
const rolesApp = require('./RolesController');
const tipoIncapacidadApp = require('./TipoIncapacidadController');
const empleadosApp = require('./EmpleadoController');
const puestosEmpleadosApp = require('./Emp_PuestosController');
const rolesEmpleadosApp = require('./Emp_RolesController');
const prestamosAdmApp = require('./Prestamos_AdmController');
const listaEmpleadosApp = require('./Prest_EmpleadosController');
const abonosApp = require('./Prest_AbonoController');
const permisosUsrApp = require('./Permisos_UsrController');
const permisosJefApp = require('./Permisos_JefController');
const permisosAdmApp = require('./Permisos_AdmController');
const planillaAdmApp = require('./Planilla_AdmController');


const app = express();
app.use(cors());
app.use(express.json());

// Ruta para login
app.use('/api/login', loginApp);

// Ruta para login
app.use('/api/accesos', accesosApp)

// Ruta para notificaciones
app.use('/api/notificaciones', notificacionApp);

// Ruta para marcas
app.use('/api/marcas', marcasUsrApp);

// Ruta para puestos
app.use('/api/puestos', puestosApp);

// Ruta para roles
app.use('/api/roles', rolesApp);

// Ruta para tipo de incapacidad
app.use('/api/tipoIncapacidad', tipoIncapacidadApp);

// Ruta para empleados
app.use('/api/empleados', empleadosApp);
app.use('/api/puestosRegistrados', puestosEmpleadosApp);
app.use('/api/rolesRegistrados', rolesEmpleadosApp);

// Ruta para prestamos
app.use('/api/prestamos', prestamosAdmApp);
app.use('/api/empleadosRegistrados', listaEmpleadosApp);

// Ruta para abonos de prestamos
app.use('/api/abonoPrestamos', abonosApp);

// Ruta para permisos
app.use('/api/permisosEmpl', permisosUsrApp);
app.use('/api/permisosJefatura', permisosJefApp);
app.use('/api/permisosAdm', permisosAdmApp);

// Ruta para cacular planilla
app.use('/api/planilla', planillaAdmApp);


//Errutamiento. Escucha del archhivo
const puerto = process.env.PUERTO || 8000;
app.listen(puerto, () => {
    console.log(`Servidor principal en ejecución en el puerto ${puerto}`);
});