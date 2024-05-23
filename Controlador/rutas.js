const express = require('express');
const cors = require('cors');
const loginApp = require('./log_login');
const accesosApp = require('./log_header');
const notificacionApp = require('./log_notificaciones');
const puestosApp = require('./log_puestos');
const rolesApp = require('./log_roles');
const tipoIncapacidadApp = require('./log_tipoIncapacidad');
const empleadosApp = require('./log_empleados');
const puestosEmpleadosApp = require('./log_cargarPuestos');
const rolesEmpleadosApp = require('./log_cargarRoles');
const prestamosApp = require('./log_prestamos');
const listaEmpleadosApp = require('./log_cargar_empleados');
const abonosApp = require('./log_abonosPrestamo');
const permEmpApp = require('./log_permEmp');
const permJefaturaApp = require('./log_permJefatura');


const app = express();
app.use(cors());

// Ruta para login
app.use('/api/login', loginApp);

// Ruta para login
app.use('/api/accesos', accesosApp)

// Ruta para notificaciones
app.use('/api/notificaciones', notificacionApp);

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
app.use('/api/prestamos', prestamosApp);
app.use('/api/empleadosRegistrados', listaEmpleadosApp);

// Ruta para abonos de prestamos
app.use('/api/abonoPrestamos', abonosApp);

// Ruta para abonos de permisos
app.use('/api/permisosEmpl', permEmpApp);
app.use('/api/permisosJefatura', permJefaturaApp);




//Errutamiento. Escucha del archhivo
const puerto = process.env.PUERTO || 8000;
app.listen(puerto, () => {
    console.log(`Servidor principal en ejecución en el puerto ${puerto}`);
});