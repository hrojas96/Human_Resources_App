const feriados = require('../Modelo/Feriados');

class DiasHabilesController {
    constructor () {
        this.dias_solicitados = [];
    }

    //Insertar puestos
    prosesarDiasHabiles(fechaInicial, fechaFinal, callback) {

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
        return callback; //this.dias_solicitados;
    }

}

module.exports = new DiasHabilesController();