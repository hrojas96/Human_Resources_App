const express = require('express');

const accesos = require('../Modelo/PermisosModel');
const diasHabiles = require('./DiasHabilesController');

class Perm_EmpleadoController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
        //this.diasHab = new DiasHabilesController();
    }

    inicializarRutas() {
        this.router.get('/:empleado', this.consultarPermEmp);
        this.router.post('/', this.insertarPermEmp);
        this.router.put('/:id_permiso', this.editarPermEmp);
        this.router.delete('/:id_permiso', this.eliminarPermEmp);
    };

    //Consultar los permisos de un único empleado
    consultarPermEmp(req, res) {
        let id_empleado = req.params.empleado;
        accesos.consultarPermEmp(id_empleado,(error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
    };

    insertarPermEmp(req, res) {
        let fechaInicial = new Date (req.body.inicio_permiso);
        let fechaFinal = new Date (req.body.final_permiso);

        try{
            diasHabiles.prosesarDiasHabiles(fechaInicial, fechaFinal, (err, filas) => {
            
            });



        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
        }
            

        console.log ('Hola dias: ', dias);
    };
    

    //Editar registro de permisos de un único empleado
    editarPermEmp(req, res) {
        let id_permiso = req.params.id_permiso;
        let inicio_permiso = req.body.inicio_permiso;
        let final_permiso = req.body.final_permiso;
        let msj_empleado = req.body.msj_empleado;

        try {
            accesos.editarPermEmp(inicio_permiso, final_permiso, msj_empleado, id_permiso, (err, fila) => {
                
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).json({ error: "Datos duplicados" });
                    } else {
                        console.log('Hubo un error')
                        //throw err;
                    };
                } else {
                    //console.log('Datos insertados')
                    // Enviamos respuesta de BD
                    res.send(fila);
                };
            });
            } catch (error) {
                console.error("Error during database insertion:", error);
                res.status(500).json({ error: "Error de servidor" });
        };
    };


    eliminarPermEmp(req,res) {
        let id_permiso = req.params.id_permiso;
        accesos.eliminarPermEmp(id_permiso, (error, filas) => {
            if (error) {
                console.log('Hubo un error');
                //throw err;
            } else {
                res.send(filas);
            };
        });
        
    };

}

module.exports = new Perm_EmpleadoController().router;




//Insertar permisos
    /*insertarPermEmp(req, res) {
        let fechaInicial = new Date (req.body.inicio_permiso);
        let fechaFinal = new Date (req.body.final_permiso);

        const diaHabiles = [];
        const dias_solicitados = [];

        //Toma todos los dias de una fecha a la otra
        while (fechaInicial <= fechaFinal){

            //Toma el numero de día (Lunes=0)
            const diaSemana = fechaInicial.getDay();

            //Revisa si la fecha incluye sabado o domingo
            if (diaSemana !== 5 && diaSemana !== 6) {

                //Alcena las fechas entre semana
                diaHabiles.push(new Date(fechaInicial));
            };
          
            fechaInicial.setDate(fechaInicial.getDate() + 1);
        };
        console.log('esto es diaHabiles: ', diaHabiles)


        try {
            //Consulta a la BD los feriados registrados
            feriados.consultarFeriados( (err, filas) => {

                if (err) {
                    console.log('Hubo un error');
                    return res.status(500).json({ error: 'Hubo un error al consultar si las fechas registradas son feriados' });
                
                } else {
                    //Recorre el array de los dias entre semana
                    diaHabiles.forEach((i) => {

                        let dia = i.toISOString().slice(0, 10)
                        const diasFeriados = filas.map(row => new Date(row.fecha_feriado).toISOString().slice(0, 10));
                        
                        //Verifica que los dias entre semana no sean un feriado
                        if (!diasFeriados.includes(dia))  {
                            
                            dias_solicitados.push(new Date(dia));
                        };
                    });
                    console.log('esto es dias_solicitados', dias_solicitados)
                }
            })
        
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
        } 
    }*/

        /*
        let data = [{
        id_empleado:req.body.id_empleado,
        inicio_permiso:req.body.inicio_permiso,
        final_permiso:req.body.final_permiso,
        msj_empleado:req.body.msj_empleado,
        decision_jefatura:req.body.decision_jefatura,
        decision_RRHH:req.body.decision_RRHH,
        derecho_pago:req.body.derecho_pago,
        cant_perm_solicitadas:req.body.cant_perm_solicitadas 
            
        }];
        
        
        
        







    try {
        accesos.insertarPermEmp(data, (err, fila) => {
            
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ error: "Datos duplicados" });
                } else {
                    console.log('Hubo un error');
                    //throw err;
                };
            } else {
                //console.log('Datos insertados')
                // Enviamos respuesta de BD
                res.send(fila);
            }
        });
        } catch (error) {
            console.error("Error during database insertion:", error);
            res.status(500).json({ error: "Error de servidor" });
        };*/
   