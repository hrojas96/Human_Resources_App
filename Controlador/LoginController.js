const express = require('express');
const crypto = require('crypto');
const accesos = require('../Modelo/LoginModel');

class LoginController {
    constructor () {
        this.router = express.Router();
        this.inicializarRutas();
    }

    inicializarRutas() {
        this.router.post('/:id_empleado', this.consultarUsuario);
    };

    consultarUsuario(req,res) {
    
        let id_empleado = req.params.id_empleado;
        let contrasena = req.body.contrasena;
        let nuevaContrasena = req.body.nuevaContrasena;
        let codigo = req.body.codigo;
        
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
                
                    // Verifica las credenciales
                    if (contrasenaCryp === contrasenaAlmacenada) {
                        if (codigo === 1){
                            
                            const contrasena = crypto.createHash('md5').update(nuevaContrasena).digest('hex');
                            try {
                                
                                accesos.editarContrasena(id_empleado, contrasena,  (err, fila) => {
                                
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
                        
                        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
                    }
                } else {
                res.status(404).json({ success: false, message: 'Usuario no exite' });
                }
            }
        });
        
    };
}

module.exports = new LoginController().router;