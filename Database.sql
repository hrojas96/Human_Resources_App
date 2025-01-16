DROP SCHEMA IF EXISTS `FausticaSA` ;

CREATE SCHEMA IF NOT EXISTS `FausticaSA` DEFAULT CHARACTER SET utf8mb4 ;
USE `FausticaSA` ;

   															/* Rol*/ 
DROP TABLE IF EXISTS `FausticaSA`.`Rol` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Rol` (
  `id_rol` INT NOT NULL AUTO_INCREMENT,
  `nombre_rol` VARCHAR(45) NOT NULL UNIQUE,
  `acc_mantenimeintos` TINYINT NOT NULL,
  `acc_planilla` TINYINT NOT NULL,
  `acc_horasExtras_RRHH` TINYINT NOT NULL,
  `acc_prestamos` TINYINT NOT NULL,
  `acc_permisos_RRHH` TINYINT NOT NULL,
  `acc_vacaciones_RRHH` TINYINT NOT NULL,
  `acc_incapacidades` TINYINT NOT NULL,
  `acc_aguinaldo` TINYINT NOT NULL,
  `acc_liquidacion` TINYINT NOT NULL,
  `acc_horasExtras_jefatura` TINYINT NOT NULL,
  `acc_vacaciones_jefatura` TINYINT NOT NULL,
  `acc_permisos_jefatura` TINYINT NOT NULL,
  `acc_marcas` TINYINT NOT NULL,
  PRIMARY KEY (`id_rol`));
  
															/* Puesto*/
DROP TABLE IF EXISTS `FausticaSA`.`Puesto` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Puesto` (
  `id_puesto` INT NOT NULL AUTO_INCREMENT,
  `nombre_puesto` VARCHAR(45) NOT NULL UNIQUE,
  `monto_por_hora` DECIMAL (10,2) NOT NULL,
  `salario_base` DECIMAL (10,2) NOT NULL,
  PRIMARY KEY (`id_puesto`));
  
  ALTER TABLE `FausticaSA`.`Puesto` ADD COLUMN   salario_base  DECIMAL(10,2) NOT NULL;
  
    DROP TABLE IF EXISTS `FausticaSA`.`provincia` ;
  CREATE TABLE `FausticaSA`.`provincia` (
  id_provincia int NOT NULL,
  codigo_provincia int DEFAULT NULL,
  descripcion VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (id_provincia));
  
  DROP TABLE IF EXISTS `FausticaSA`.`canton` ;
  
  CREATE TABLE `FausticaSA`.`canton` (
  id_canton INT NOT NULL,
  codigo_provincia INT NOT NULL,
  codigo_canton INT NOT NULL,
  descripcion VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (id_canton));
  
  DROP TABLE IF EXISTS `FausticaSA`.`distrito` ;
  
  CREATE TABLE `FausticaSA`.`distrito` (
  id_distrito int NOT NULL,
  codigo_canton INT DEFAULT NULL,
  codigo_distrito int DEFAULT NULL,
  descripcion VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (id_distrito));

															/* Empleado*/
DROP TABLE IF EXISTS `FausticaSA`.`Empleado` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Empleado` (
  `id_empleado` INT NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido1` VARCHAR(45) NOT NULL,
  `apellido2` VARCHAR(45) NOT NULL,
  `genero` VARCHAR(45) NOT NULL,
  `id_puesto` INT NOT NULL,
  `id_rol` INT NOT NULL,
  `id_jefatura` INT NULL,
  `fecha_ingreso` DATE NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
  `estado_civil` VARCHAR(45) NOT NULL,
  `hijos_dependientes` TINYINT NOT NULL,
  `id_provincia` INT NOT NULL,
  `id_canton` INT NOT NULL,
  `id_distrito` INT NOT NULL,
  `direccion` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id_empleado`),
  FOREIGN KEY (`id_puesto`) REFERENCES `FausticaSA`.`Puesto` (`id_puesto`),
  FOREIGN KEY (`id_jefatura`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`),
  FOREIGN KEY (`id_rol`) REFERENCES `FausticaSA`.`Rol` (`id_rol`),
  FOREIGN KEY (`id_provincia`) REFERENCES `FausticaSA`.`provincia` (`id_provincia`),
  FOREIGN KEY (`id_canton`) REFERENCES `FausticaSA`.`canton` (`id_canton`),
  FOREIGN KEY (`id_distrito`) REFERENCES `FausticaSA`.`distrito` (`id_distrito`));
  
 
															/* Marcas*/
DROP TABLE IF EXISTS `FausticaSA`.`Marcas` ; 

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Marcas` (
  `id_marca` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL,
  `fecha` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `hora_entrada` TIME NOT NULL,
  `hora_salida` TIME NULL,
  `horas_ordinarias` DECIMAL (5,2) NULL,
  PRIMARY KEY (`id_marca`),
  FOREIGN KEY (`id_empleado`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`));

ALTER TABLE `FausticaSA`.`Marcas` Modify COLUMN   horas_ordinarias  DECIMAL(5,2) NULL;

															/* Horas_Extras*/
DROP TABLE IF EXISTS `FausticaSA`.`Horas_Extras` ; 

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Horas_Extras` (
  `id_marca` INT NOT NULL UNIQUE,
  `horas_extras` DECIMAL (5,2) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `decision_jefatura` VARCHAR(45) NOT NULL,
  `decision_RRHH` VARCHAR(45) NOT NULL,
  FOREIGN KEY (`id_marca`) REFERENCES `FausticaSA`.`Marcas` (`id_marca`));
  

															/* Prestamos*/
DROP TABLE IF EXISTS `FausticaSA`.`Prestamos` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Prestamos` (
  `id_prestamo` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL,
  `fecha_solicitud` DATE NOT NULL,
  `monto_solicitado` DECIMAL (10.2) NOT NULL,
  `rebajo_salarial` DECIMAL (10.2) NOT NULL,
  `saldo` DECIMAL (10.2) NOT NULL,
  PRIMARY KEY (`id_prestamo`),
  FOREIGN KEY (`id_empleado`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`));

															/* Abono*/
DROP TABLE IF EXISTS `FausticaSA`.`Abono` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Abono` (
  `id_abono` INT NOT NULL AUTO_INCREMENT,
  `id_prestamo` INT NOT NULL,
  `fecha_abono` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `monto` DECIMAL (10.2) NOT NULL,
  PRIMARY KEY (`id_abono`),
  FOREIGN KEY (`id_prestamo`) REFERENCES `FausticaSA`.`Prestamos` (`id_prestamo`));

															/* Tipo_Incapacidad*/
DROP TABLE IF EXISTS `FausticaSA`.`Tipo_Incapacidad` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Tipo_Incapacidad` (
  `id_tipo_incapacidad` INT NOT NULL AUTO_INCREMENT,
  `concepto` VARCHAR(150) NOT NULL UNIQUE,
  `porcentaje_salarial` DECIMAL (5,2) NOT NULL,
  PRIMARY KEY (`id_tipo_incapacidad`));
  
															/* Incapacidad*/
DROP TABLE IF EXISTS `FausticaSA`.`Incapacidad` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Incapacidad` (
  `id_incapacidad` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL,
  `id_tipo_incapacidad` INT NOT NULL,
  `fecha_desde` DATE NOT NULL,
  `fecha_hasta` DATE NOT NULL,
  `monto_subcidio` DECIMAL (10,2) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_incapacidad`),
  FOREIGN KEY (`id_empleado`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`));
  
  ALTER TABLE Incapacidad ADD COLUMN estado VARCHAR(45) NOT NULL;
  
  
   															/* Bonos*/
DROP TABLE IF EXISTS `FausticaSA`.`Bonos` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Bonos` (
  `id_bono` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL ,
  `fecha` DATE NOT NULL ,
  `monto_bono` DECIMAL (10,2) NOT NULL,
  `razon` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_bono`),
  FOREIGN KEY (`id_empleado`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`));
  
  															/* RentaxCobrar*/
DROP TABLE IF EXISTS `FausticaSA`.`RentaxCobrar` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`RentaxCobrar` (
  `id_rentaxc` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL,
  `fecha_desde` DATE NOT NULL,
  `fecha_hasta` DATE NOT NULL,
  `monto_por_cobrar` DECIMAL (10.2) NOT NULL,
  `rebajo_semanal` DECIMAL (10.2) NOT NULL,
  `saldo_renta` DECIMAL (10.2) NOT NULL,
  PRIMARY KEY (`id_rentaxc`),
  FOREIGN KEY (`id_empleado`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`));

															/* FacturacionRenta*/
DROP TABLE IF EXISTS `FausticaSA`.`FacturacionRenta` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`FacturacionRenta` (
  `id_factRenta` INT NOT NULL AUTO_INCREMENT,
  `id_rentaxc` INT NOT NULL,
  `fecha_fact` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `monto_fact` DECIMAL (10.2) NOT NULL,
  PRIMARY KEY (`id_factRenta`),
  FOREIGN KEY (`id_rentaxc`) REFERENCES `FausticaSA`.`RentaxCobrar` (`id_rentaxc`));
  

															/* Planilla*/
DROP TABLE IF EXISTS `FausticaSA`.`Planilla` ;

  CREATE TABLE IF NOT EXISTS `FausticaSA`.`Planilla` (
  `id_salario` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL ,
  `fecha_desde` DATE NOT NULL ,
  `fecha_hasta` DATE NOT NULL ,
  `monto_horas_ordinarias` DECIMAL (10.2) NOT NULL,
  `monto_horas_extras` DECIMAL (10.2) NULL,
  `id_bono` INT NULL,
  `monto_bono` DECIMAL (10.2) NULL,
  `monto_dias_solicitados` DECIMAL (10.2) NULL,
  `salario_bruto` DECIMAL (10.2) NOT NULL,
  `deduccion_ccss` DECIMAL (10.2) NOT NULL,
  `deduccion_bancopopular` DECIMAL (10.2) NOT NULL,
  `id_rentaxc` INT NULL,
  `deduccion_renta` DECIMAL (10.2) NULL,
  `id_prestamo` INT NULL,
  `deduccion_prestamo` DECIMAL (10.2) NULL,
  `monto_cancelado` DECIMAL (10.2) NOT NULL,
  PRIMARY KEY (`id_salario`),
  FOREIGN KEY (`id_empleado`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`),
  FOREIGN KEY (`id_bono`) REFERENCES `FausticaSA`.`Bonos` (`id_bono`),
  FOREIGN KEY (`id_rentaxc`) REFERENCES `FausticaSA`.`RentaxCobrar` (`id_rentaxc`),
  FOREIGN KEY (`id_prestamo`) REFERENCES `FausticaSA`.`Prestamos` (`id_prestamo`));

  
  															/* Deducciones_Legales*/
DROP TABLE IF EXISTS `FausticaSA`.`Deducciones_Legales` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Deducciones_Legales` (
  `id_deduccion` INT NOT NULL AUTO_INCREMENT,
  `concepto` VARCHAR(45) NOT NULL UNIQUE,
  `porcentaje_salarial` DECIMAL (5,5) NOT NULL,
  PRIMARY KEY (`id_deduccion`));
  
    															/* Impuesto_Renta*/
DROP TABLE IF EXISTS `FausticaSA`.`Impuesto_Renta` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Impuesto_Renta` (
  `id_impuesto` INT NOT NULL AUTO_INCREMENT,
  `tramo1` DECIMAL (10,2) NOT NULL UNIQUE,
  `tramo2` DECIMAL (10,2) NULL,
  `porcentaje_salarial` DECIMAL (5,2) NOT NULL,
  PRIMARY KEY (`id_impuesto`));
  
AlTER TABLe Impuesto_Renta Modify column tramo2 DECIMAL (10,2)  NULL;

																/* Créditos_Fiscal_Renta*/
DROP TABLE IF EXISTS `FausticaSA`.`Créditos_Fiscal_Renta` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Créditos_Fiscal_Renta` (
  `id_credFiscal` INT NOT NULL AUTO_INCREMENT,
  `concepto` VARCHAR(45) NOT NULL UNIQUE,
  `monto_rebajo` DECIMAL (10,2) NULL,
  PRIMARY KEY (`id_credFiscal`));

															/* Vacaciones*/
DROP TABLE IF EXISTS `FausticaSA`.`Vacaciones` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Vacaciones` (
  `id_vacaciones` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL,
  `inicio_vacacion` DATE NOT NULL,
  `final_vacacion` DATE NOT NULL,
  `cant_dias_solicitados` INT NOT NULL,
  `decision_jefatura` VARCHAR(20) NOT NULL,
  `msj_jefatura` VARCHAR(150) NULL,
  `decision_RRHH` VARCHAR(20) NOT NULL,
  `msj_RRHH` VARCHAR(150) NULL,
  PRIMARY KEY (`id_vacaciones`),
  FOREIGN KEY (`id_empleado`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`));
  

															/* Permisos*/
DROP TABLE IF EXISTS `FausticaSA`.`Permisos` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Permisos` (
  `id_permiso` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL,
  `inicio_permiso` DATE NOT NULL,
  `final_permiso` DATE NOT NULL,
  `cant_dias_solicitados` INT NOT NULL,
  `msj_empleado` VARCHAR(150) NOT NULL,
  `decision_jefatura` VARCHAR(20) NOT NULL,
  `msj_jefatura` VARCHAR(150) NULL,
  `decision_RRHH` VARCHAR(150) NOT NULL,
  `derecho_pago` VARCHAR(10) NOT NULL,
  `msj_RRHH` VARCHAR(150) NULL,
  PRIMARY KEY (`id_permiso`),
  FOREIGN KEY (`id_empleado`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`));
SELECT CURRENT_TIMESTAMP ;
  															/* Solicitudes*/
DROP TABLE IF EXISTS `FausticaSA`.`Solicitudes` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Solicitudes` (
  `id_solicitud` INT NOT NULL AUTO_INCREMENT,
  `id_vacaciones` INT NULL,
  `id_permiso` INT NULL,
  `id_incapacidad` INT NULL,
  `id_empleado` INT NOT NULL,
  `dia_solicitado` DATE NOT NULL,
  `pago_dia` DECIMAL (10.2) NOT NULL,
  PRIMARY KEY (`id_solicitud`),
  FOREIGN KEY (`id_vacaciones`) REFERENCES `FausticaSA`.`Vacaciones` (`id_vacaciones`),
  FOREIGN KEY (`id_permiso`) REFERENCES `FausticaSA`.`Permisos` (`id_permiso`),
  FOREIGN KEY (`id_incapacidad`) REFERENCES `FausticaSA`.`Incapacidad` (`id_incapacidad`),
  FOREIGN KEY (`id_empleado`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`));
  
  															/* Feriados*/
DROP TABLE IF EXISTS `FausticaSA`.`Feriados` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Feriados` (
  `id_feriado` INT NOT NULL AUTO_INCREMENT,
  `nombre_feriado` VARCHAR(45) NOT NULL UNIQUE,
  `fecha_feriado` DATE NOT NULL UNIQUE,
  `pago_obligatorio` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_feriado`));
  

															/* Aguinaldo*/
DROP TABLE IF EXISTS `FausticaSA`.`Aguinaldo` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Aguinaldo` (
  `id_aguinaldo` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL,
  `fecha_desde` DATE NOT NULL,
  `fecha_hasta` DATE NOT NULL,
  `monto_pagado` DECIMAL(10.2) NOT NULL,
  PRIMARY KEY (`id_aguinaldo`),
  FOREIGN KEY (`id_empleado`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`));

															/* Liquidacion*/
DROP TABLE IF EXISTS `FausticaSA`.`Liquidacion` ;

CREATE TABLE IF NOT EXISTS `FausticaSA`.`Liquidacion` (
  `id_liquidacion` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL UNIQUE,
  `fecha` DATE NOT NULL,
  `pago_vacaciones` DECIMAL (10.2) NOT NULL,
  `pago_aguinaldo` DECIMAL (10.2) NOT NULL,
  `pago_preaviso` DECIMAL (10.2) NOT NULL,
  `cesantia` DECIMAL (10.2) NULL,
  `monto_liquidado` DECIMAL (10.2) NOT NULL,
  PRIMARY KEY (`id_liquidacion`),
  FOREIGN KEY (`id_empleado`) REFERENCES `FausticaSA`.`Empleado` (`id_empleado`));

															/* SP_ConsultaEmpleados*/
DROP PROCEDURE SP_ConsultaEmpleados;

delimiter //
CREATE PROCEDURE SP_ConsultaEmpleados ()
BEGIN
  SELECT Empleado.id_empleado, Empleado.fecha_nacimiento, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Empleado.genero,
  Empleado.id_puesto, Puesto.nombre_puesto  AS puesto, Empleado.id_rol, Rol.nombre_rol  AS rol,  Empleado.id_jefatura, jefatura.nombre AS jefaturaN, Empleado.fecha_ingreso, Empleado.estado, Empleado.correo, 
  Empleado.telefono, Empleado.estado_civil, Empleado.hijos_dependientes, Empleado.id_provincia, provincia.descripcion AS provincia, Empleado.id_canton, canton.descripcion AS canton, Empleado.id_distrito, distrito.descripcion AS distrito, Empleado.direccion
  FROM Empleado 
  JOIN Empleado jefatura ON Empleado.id_jefatura = jefatura.id_empleado
  LEFT JOIN Puesto ON Empleado.id_puesto = Puesto.id_puesto
  LEFT JOIN Rol ON Empleado.id_rol = Rol.id_rol
  LEFT JOIN provincia ON Empleado.id_provincia = provincia.id_provincia
  LEFT JOIN canton ON Empleado.id_canton = canton.id_canton
  LEFT JOIN distrito ON Empleado.id_distrito = distrito.id_distrito
  ORDER BY Empleado.nombre ASC;
END //
delimiter ;

CALL SP_ConsultaEmpleados;

															/* SP_ConsultaPrestamos*/
DROP PROCEDURE SP_ConsultaPrestamos;

delimiter //
CREATE PROCEDURE SP_ConsultaPrestamos ()
BEGIN
  SELECT Prestamos.id_prestamo, Prestamos.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Prestamos.fecha_solicitud,
  Prestamos.monto_solicitado, Prestamos.rebajo_salarial, Prestamos.saldo
  FROM Prestamos
  LEFT JOIN Empleado ON Prestamos.id_empleado = Empleado.id_empleado;
END //
delimiter ;

CALL SP_ConsultaPrestamos;

															/* SP_ConsultaAbonosPrestamos*/
DROP PROCEDURE SP_ConsultaAbonosPrestamos;

delimiter //
CREATE PROCEDURE SP_ConsultaAbonosPrestamos (IN prestamo INT)
BEGIN
    SELECT Prestamos.id_empleado, Empleado.nombre, Empleado.apellido1, Empleado.apellido2, Prestamos.fecha_solicitud, Prestamos.monto_solicitado, 
    Prestamos.rebajo_salarial, Abono.id_abono, Abono.fecha_abono, Abono.monto
    FROM Prestamos
    LEFT JOIN Abono ON Prestamos.id_prestamo = Abono.id_prestamo
    LEFT JOIN Empleado ON Prestamos.id_empleado = Empleado.id_empleado
    WHERE Prestamos.id_prestamo = prestamo;
END //
delimiter ;

CALL SP_ConsultaAbonosPrestamos(1);

															/* SP_ConsultaTipoUsuario*/
DROP PROCEDURE SP_ConsultaTipoUsuario;

delimiter //
CREATE PROCEDURE SP_ConsultaTipoUsuario (IN usuario INT)
BEGIN
    SELECT Empleado.id_rol, Rol.acc_mantenimeintos, Rol.acc_planilla, 
    Rol.acc_horasExtras_RRHH, Rol.acc_prestamos, Rol.acc_permisos_RRHH, Rol.acc_vacaciones_RRHH,
    Rol.acc_incapacidades, Rol.acc_aguinaldo, Rol.acc_liquidacion, Rol.acc_horasExtras_jefatura,
    Rol.acc_vacaciones_jefatura, Rol.acc_permisos_jefatura, Rol.acc_marcas
    FROM Empleado
    LEFT JOIN Rol ON Empleado.id_rol = Rol.id_rol
    WHERE Empleado.id_empleado = usuario;
END //
delimiter ;

CALL SP_ConsultaTipoUsuario();


															/* SP_CalcularPlanilla*/
                                                            
DROP PROCEDURE SP_CalcularPlanilla; 

DELIMITER //
CREATE PROCEDURE SP_CalcularPlanilla (IN fecha1 DATE, IN fecha2 DATE)
BEGIN
    WITH Horas AS (
        SELECT Empleado.id_empleado, SUM(Marcas.horas_ordinarias) AS total_horas_ordinarias, 
				SUM(Horas_Extras.horas_extras) AS total_horas_extras
        FROM Empleado
        INNER JOIN Marcas ON Empleado.id_empleado = Marcas.id_empleado AND Marcas.fecha BETWEEN fecha1 AND fecha2
        LEFT JOIN Horas_Extras ON Marcas.id_marca = Horas_Extras.id_marca AND Horas_Extras.estado = 'Aprobado'
        GROUP BY Empleado.id_empleado)
    SELECT 
        Empleado.id_empleado,
        Puesto.nombre_puesto,
        Puesto.monto_por_hora,
        IFNULL(Horas.total_horas_ordinarias, 0) AS total_horas_ordinarias,
        IFNULL(Horas.total_horas_extras, 0) AS total_horas_extras,
        IFNULL(Horas.total_horas_ordinarias * Puesto.monto_por_hora, 0) AS pago_horas_ordinarias,
        IFNULL(Horas.total_horas_extras * Puesto.monto_por_hora * 2, 0) AS pago_horas_extras,
        IFNULL(SUM(Solicitudes.pago_dia), 0) AS pago_dias_solicitados,
        Bonos.id_bono,
        IFNULL(SUM(Bonos.monto_bono), 0) AS total_bonos,
        RentaxCobrar.id_rentaxc,
        RentaxCobrar.rebajo_semanal,
        RentaxCobrar.saldo_renta,
        Prestamos.id_prestamo,
        Prestamos.rebajo_salarial,
        Prestamos.saldo,
        ccss.porcentaje_salarial AS rebajo_ccss,
        bancoPopular.porcentaje_salarial AS rebajo_bancoPopular
    FROM Empleado
    INNER JOIN Puesto ON Empleado.id_puesto = Puesto.id_puesto 
    INNER JOIN Horas ON Empleado.id_empleado = Horas.id_empleado 
    LEFT JOIN Solicitudes ON Empleado.id_empleado = Solicitudes.id_empleado AND Solicitudes.dia_solicitado BETWEEN fecha1 AND fecha2 
    LEFT JOIN RentaxCobrar ON Empleado.id_empleado = RentaxCobrar.id_empleado AND RentaxCobrar.saldo_renta > 0
    LEFT JOIN Prestamos ON Empleado.id_empleado = Prestamos.id_empleado AND Prestamos.saldo > 0
    LEFT JOIN Bonos ON Empleado.id_empleado = Bonos.id_empleado AND Bonos.fecha BETWEEN fecha1 AND fecha2
    LEFT JOIN Deducciones_Legales AS ccss ON ccss.concepto = 'CCSS'
    LEFT JOIN Deducciones_Legales AS bancoPopular ON bancoPopular.concepto = 'Banco Popular'
    
    GROUP BY 
        Empleado.id_empleado, 
        Puesto.nombre_puesto, 
        Puesto.monto_por_hora,
        Bonos.id_bono,
        RentaxCobrar.id_rentaxc,
        RentaxCobrar.rebajo_semanal,
        RentaxCobrar.saldo_renta,
        Prestamos.id_prestamo,
        Prestamos.rebajo_salarial,
        Prestamos.saldo,
        ccss.porcentaje_salarial,
        bancoPopular.porcentaje_salarial
    ORDER BY Empleado.id_empleado;
END //
DELIMITER ;
                                                            
CALL SP_CalcularPlanilla('2024-07-08', '2024-12-12');                                                             
                                                            

															/* SP_CalcularPlanilla_Individual*/
                                                            
DROP PROCEDURE SP_CalcularPlanilla_Individual; 

DELIMITER //
CREATE PROCEDURE SP_CalcularPlanilla_Individual (IN cedula INT, IN fecha1 DATE, IN fecha2 DATE)
BEGIN
    WITH Horas AS (
        SELECT Empleado.id_empleado, SUM(Marcas.horas_ordinarias) AS total_horas_ordinarias, 
				SUM(Horas_Extras.horas_extras) AS total_horas_extras
        FROM Empleado
        INNER JOIN Marcas ON Empleado.id_empleado = Marcas.id_empleado AND Marcas.fecha BETWEEN fecha1 AND fecha2
        LEFT JOIN Horas_Extras ON Marcas.id_marca = Horas_Extras.id_marca AND Horas_Extras.estado = 'Aprobado'
        GROUP BY Empleado.id_empleado)
    SELECT 
        Empleado.id_empleado,
        Puesto.nombre_puesto,
        Puesto.monto_por_hora,
        IFNULL(Horas.total_horas_ordinarias, 0) AS total_horas_ordinarias,
        IFNULL(Horas.total_horas_extras, 0) AS total_horas_extras,
        IFNULL(Horas.total_horas_ordinarias * Puesto.monto_por_hora, 0) AS pago_horas_ordinarias,
        IFNULL(Horas.total_horas_extras * Puesto.monto_por_hora * 2, 0) AS pago_horas_extras,
        IFNULL(SUM(Solicitudes.pago_dia), 0) AS pago_dias_solicitados,
        Bonos.id_bono,
        IFNULL(SUM(Bonos.monto_bono), 0) AS total_bonos,
        RentaxCobrar.id_rentaxc,
        RentaxCobrar.rebajo_semanal,
        RentaxCobrar.saldo_renta,
        Prestamos.id_prestamo,
        Prestamos.rebajo_salarial,
        Prestamos.saldo,
        ccss.porcentaje_salarial AS rebajo_ccss,
        bancoPopular.porcentaje_salarial AS rebajo_bancoPopular
    FROM Empleado
    INNER JOIN Puesto ON Empleado.id_puesto = Puesto.id_puesto 
    INNER JOIN Horas ON Empleado.id_empleado = Horas.id_empleado 
    LEFT JOIN Solicitudes ON Empleado.id_empleado = Solicitudes.id_empleado AND Solicitudes.dia_solicitado BETWEEN fecha1 AND fecha2 
    LEFT JOIN RentaxCobrar ON Empleado.id_empleado = RentaxCobrar.id_empleado AND RentaxCobrar.saldo_renta > 0
    LEFT JOIN Prestamos ON Empleado.id_empleado = Prestamos.id_empleado AND Prestamos.saldo > 0
    LEFT JOIN Bonos ON Empleado.id_empleado = Bonos.id_empleado AND Bonos.fecha BETWEEN fecha1 AND fecha2
    LEFT JOIN Deducciones_Legales AS ccss ON ccss.concepto = 'CCSS'
    LEFT JOIN Deducciones_Legales AS bancoPopular ON bancoPopular.concepto = 'Banco Popular'
    WHERE Empleado.id_empleado = cedula
    GROUP BY 
        Empleado.id_empleado, 
        Puesto.nombre_puesto, 
        Puesto.monto_por_hora,
        Bonos.id_bono,
        RentaxCobrar.id_rentaxc,
        RentaxCobrar.rebajo_semanal,
        RentaxCobrar.saldo_renta,
        Prestamos.id_prestamo,
        Prestamos.rebajo_salarial,
        Prestamos.saldo,
        ccss.porcentaje_salarial,
        bancoPopular.porcentaje_salarial
    ORDER BY Empleado.id_empleado;
END //
DELIMITER ;
                                                            
    
                                                            



		


