const express = require('express');
const cors = require('cors');
const loginApp = require('./LoginController');
const accesosApp = require('./AccesosController');
const notificacionApp = require('./NotificacionesController');
const marcasUsrApp = require('./Marcas_UsrController');
const horasExtrasUsrApp = require('./horasExtras_UsrController');
const horasExtrasJefApp = require('./HorasExtras_JefController');
const horasExtrasAdmApp = require('./HorasExtras_AdmController');
const puestosApp = require('./PuestosController');
const rolesApp = require('./RolesController');
const tipoIncapacidadApp = require('./TipoIncapacidadController');
const consultarTiposIncapacidadesApp = require('./Incapacidades_TiposController');
const incapacidadesApp = require('./Incapacidades_AdmController');
const empleadosApp = require('./EmpleadoController');
const puestosEmpleadosApp = require('./Emp_PuestosController');
const rolesEmpleadosApp = require('./Emp_RolesController');
const prestamosAdmApp = require('./Prestamos_AdmController');
const listaEmpleadosApp = require('./Cargar_EmpleadosController');
const abonosApp = require('./Prestamo_AbonoController');
const permisosUsrApp = require('./Permisos_UsrController');
const permisosJefApp = require('./Permisos_JefController');
const permisosAdmApp = require('./Permisos_AdmController');
const planillaAdmApp = require('./Planilla_AdmController');
const cargasSocialesApp = require('./CargasSocialesController');
const rentaAdmApp = require('./Renta_AdmController');
const vacacionesUsrApp = require('./Vacaciones_UsrController');
const vacacionesJefApp = require('./Vacaciones_JefController');
const vacacionesAdmApp = require('./Vacaciones_AdmController');
const aguinaldosAdmApp = require('./Aguinaldos_AdmControler');
const liquidacionesAdmApp = require('./Liquidaciones_AdmController');


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

// Ruta para horas extras
app.use('/api/horasExtrasUsr', horasExtrasUsrApp);
app.use('/api/horasExtrasJef', horasExtrasJefApp);
app.use('/api/horasExtrasAdm', horasExtrasAdmApp);

// Ruta para puestos
app.use('/api/puestos', puestosApp);

// Ruta para roles
app.use('/api/roles', rolesApp);

// Ruta para tipo de incapacidad
app.use('/api/tipoIncapacidad', tipoIncapacidadApp);
app.use('/api/tiposIncapacidadesRegistradas', consultarTiposIncapacidadesApp);
app.use('/api/incapacidades', incapacidadesApp);

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
app.use('/api/cargasSociales', cargasSocialesApp);
app.use('/api/renta', rentaAdmApp);

// Ruta para vacaciones
app.use('/api/vacacionesUsr', vacacionesUsrApp);
app.use('/api/vacacionesJef', vacacionesJefApp);
app.use('/api/vacacionesAdm', vacacionesAdmApp);

// Ruta para cacular aguinaldos
app.use('/api/aguinaldos', aguinaldosAdmApp);

// Ruta para cacular liquidaciones
app.use('/api/liquidaciones', liquidacionesAdmApp);


//Errutamiento. Escucha del archhivo
const puerto = process.env.PUERTO || 8000;
app.listen(puerto, () => {
    console.log(`Servidor principal en ejecución en el puerto ${puerto}`);
});