express = require('express');

const accesos = require('../Modelo/VacacionesModel');
const diasHabiles = require('./DiasHabilesController');

class Vacaciones_UsrController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.get('/:empleado', this.consultarVacacionesUsr);
        this.router.post('/', this.insertarVacacionesUsr);
        this.router.put('/:id_vacaciones', this.editarVacacionesUsr);
        this.router.delete('/:id_vacaciones', this.eliminarVacacionesUsr);
    };

    //Consultar las vacaciones de un único empleado
    consultarVacacionesUsr(req, res) {
        let id_empleado = req.params.empleado;
        accesos.consultarVacacionesUsr(id_empleado,(err, resultado) => {
            if (err) {
                console.log('Hubo un error');
                //throw err;
            } else {
                //Tomo la fecha de hoy y la de ingreso del empleado
                let hoy = new Date();
                let fechaIngreso = new Date (resultado[0].fecha_ingreso);
                //Obtengo un resultado en milisegndos
                let diferencia = (hoy.getTime() - fechaIngreso.getTime()) /1000;
                //Se pasa a días
                diferencia /= (60 * 60 * 24);
                //Se pasa a meses
                diferencia /= 30.5;
                //Saca los días de vacaciones disponibles
                let dias_acumulados = diferencia * 1.25;
                resultado.forEach(a => {
                    dias_acumulados -= a.cant_dias_solicitados;
                    a.dias_acumulados = dias_acumulados;
                });
                //console.log(resultado)
                res.send(resultado);
            };
        });
    };

    async insertarVacacionesUsr(req, res) {
        let fechaInicial = new Date (req.body.inicio_vacacion);
        let fechaFinal = new Date (req.body.final_vacacion);
        let diasDisponibles = req.body.diasDisponibles;

        try{
            const filas = await diasHabiles.prosesarDiasHabiles(fechaInicial, fechaFinal)
                
            if (filas.length <= 0){
                return res.status(400).json({ error: 'Seleccione días viables para la solicitud de sus vacaciones.' });
            } else{
                console.log ('Hola dias: ', filas.length);
                
                const cant_dias_solicitados = filas.length;

                if (cant_dias_solicitados <= diasDisponibles){

                    let data = [{
                        id_empleado:req.body.id_empleado,
                        inicio_vacacion:req.body.inicio_vacacion,
                        final_vacacion:req.body.final_vacacion,
                        cant_dias_solicitados,
                        decision_jefatura:req.body.decision_jefatura,
                        decision_RRHH:req.body.decision_RRHH
                    }];
                    
                    accesos.insertarVacacionesUsr(data, (err, resultado) => {
                        
                        if (err) {
                                console.log('Hubo un error', err);
                                //throw err;
                                return res.status(500).json({ error: 'Error al insertar las vacaciones en la base de datos' });
                        } else {
                            console.log(resultado);
                            return res.json({message:'La solicitud de sus vacaciones se ha realizado correctamente'});
                        }
                    });
                } else {
                    return res.status(500).json({ error: 'La cantidad de días solicitados es mayor a la cantidad de días disponibles. Por favor haga una nueva solicitud con una cantidad menos de días' });
                }
                
            }
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Hubo un error al consultar si las fechas registradas son hábiles' });
        }

    };
    

    //Editar registro de vacaciones de un único empleado
    async editarVacacionesUsr(req, res) {
        let fechaInicial = new Date (req.body.inicio_vacacion);
        let fechaFinal = new Date (req.body.final_vacacion);
        let diasDisponibles = req.body.diasDisponibles;
        
        try{
            const filas = await diasHabiles.prosesarDiasHabiles(fechaInicial, fechaFinal)
                
            if (filas.length <= 0){
                return res.status(400).json({ error: 'Seleccione días viables para la solicitud de sus vacaciones.' });
            } else{
                console.log ('Hola dias: ', filas.length);
                
                const cant_dias_solicitados = filas.length;

                if (cant_dias_solicitados <= diasDisponibles){

                    let id_vacaciones = req.params.id_vacaciones;
                    let inicio_vacacion = req.body.inicio_vacacion;
                    let final_vacacion = req.body.final_vacacion;
                    let decision_jefatura = req.body.decision_jefatura;
                    let decision_RRHH = req.body.decision_RRHH;
                    
                    accesos.editarVacacionesUsr(inicio_vacacion, final_vacacion, cant_dias_solicitados, decision_jefatura, decision_RRHH, id_vacaciones, (err, resultado) => {
                        
                        if (err) {
                                console.log('Hubo un error', err);
                                //throw err;
                                return res.status(500).json({ error: 'Error al editar las vacaciones en la base de datos' });
                        } else {
                            console.log(resultado);
                            return res.json({message: 'La edición de las vacaciones #' + id_vacaciones + ', se ha realizado correctamente'});
                        }
                    });
                } else {
                    return res.status(500).json({ error: 'La cantidad de días solicitados es mayor a la cantidad de días disponibles. Por favor haga una nueva solicitud con una cantidad menos de días' });
                }
            }
        } catch (error) {
            console.error('Error durante el proceso:', error);
            return res.status(500).json({ error: 'Hubo un error al consultar si las fechas registradas son hábiles' });
        }
    };


    eliminarVacacionesUsr(req,res) {
        let id_vacaciones = req.params.id_vacaciones;
        accesos.eliminarPermEmp(id_vacaciones, (err, resultado) => {
            if (err) {
                console.log('Hubo un error', err);
                //throw err;
                return res.status(500).json({ error: 'Error al eliminar el registro' });
            } else {
                console.log(resultado);
                return res.json({message: 'La eliminación del registro de vacaciones #' + id_vacaciones + ', se ha realizado correctamente'});
            }
        });
        
    };

}

module.exports = new Vacaciones_UsrController().router;