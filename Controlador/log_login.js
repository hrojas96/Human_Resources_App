const express = require('express');
const cors = require('cors');
const app = express();
const crypto = require('crypto');

const accesos = require('../Modelo/acc_login');

app.use(cors());
app.use(express.json());

app.post('/:id_empleado', (req,res)=>{
    //console.log('llegó 2');
    let id_empleado = req.params.id_empleado;
    let contrasena = req.body.contrasena;
    let nuevaContrasena = req.body.nuevaContrasena;
    let codigo = req.body.codigo;
    //console.log(codigo);
    //console.log('Esta es la contraseña vieja1', contrasena);
   //Encripta la contraseña
    const contrasenaCryp = crypto.createHash('md5').update(contrasena).digest('hex');
    //console.log('Esta es la contraseña vieja2', contrasenaCryp);
    accesos.consultarUsuario(id_empleado, (error, filas) => {
        if (error) {
            console.log('hubo un error');
            //throw error;
        } else {
            if (filas.length > 0) {
              const contrasenaAlmacenada = filas[0].contrasena;  
              //console.log(contrasenaAlmacenada);
              //console.log(contrasenaCryp);
                // Verifica las credenciales
                if (contrasenaCryp === contrasenaAlmacenada) {
                    if (codigo === 1){
                        //console.log('Esta es la contraseña nueva1', nuevaContrasena);
                        const contrasena = crypto.createHash('md5').update(nuevaContrasena).digest('hex');
                        try {
                            //console.log('a ver si esto se ejecuta', contrasena);
                            accesos.editarContrasena(id_empleado, contrasena,  (err, fila) => {
                                //console.log('a ver si esto se ejecuta')
                                if (err) {
                                        console.log('Hubo un error')
                                        
                        
                                } else {
                                    console.log(fila)
                                    res.send(fila);
                                }
                            });
                        } catch (error) {
                            console.log("Error durante la insert:", error);      
                        }
                    }else {
                        res.json({ success: true, message: 'Inicio de sesión exitoso' }); 
                    }
                } else {
                    //console.log ('contraseña no trae nada ')
                    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
                }
            } else {
              res.status(404).json({ success: false, message: 'Usuario no exite' });
            }
        }
    });
    
});

module.exports = app;