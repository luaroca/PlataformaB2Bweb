CREATE DATABASE  IF NOT EXISTS `provecta` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `provecta`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: provecta
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_producto` (`id_producto`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (40,1,13);
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `subcategoria` varchar(50) DEFAULT NULL,
  `unidad_medida` varchar(50) DEFAULT NULL,
  `minimo_pedido` int DEFAULT NULL,
  `tiempo_entrega` varchar(50) DEFAULT NULL,
  `condiciones_pago` varchar(100) DEFAULT NULL,
  `origen_producto` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `proveedor_id` int NOT NULL,
  `publicado` tinyint(1) DEFAULT '0',
  `imagen_principal` varchar(255) DEFAULT NULL,
  `imagen_secundaria1` varchar(255) DEFAULT NULL,
  `imagen_secundaria2` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `proveedor_id` (`proveedor_id`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Auriculares Bluetooth','Auriculares inalámbricos con cancelación de ruido','Electrónica','Audio y sonido','pieza',3,'5 días','Tarjeta de crédito','Colombia',45.20,50,13,1,'1748861970525-278961356.jpg',NULL,NULL),(2,'Camiseta Deportiva','Camiseta transpirable para actividades físicas','Ropa','Deportiva','caja',2,'3 días','Efectivo','Colombia',32.99,20,13,1,'1748862013546-840014880.webp',NULL,NULL),(3,'Sartén Antiadherente','Sartén de 24 cm para cocina','Hogar','Cocina','kg',1,'7 días','Transferencia bancaria','Colombia',18.50,70,13,1,'1748862048371-17457673.webp',NULL,NULL),(4,'Miel Orgánica','Miel natural sin aditivos','Alimentos','Orgánicos','litro',5,'2 días','PayPal','Colombia',15.75,100,13,1,'1748862083466-574242145.webp',NULL,NULL),(5,'Agua Mineral','Botella de agua mineral natural','Bebidas','Agua','paquete',4,'4 días','Crédito a 30 días','Colombia',22.00,80,13,1,'1748862122750-939053464.webp',NULL,NULL),(6,'Crema Facial Hidratante','Crema para cuidado de la piel','Salud y Belleza','Cuidado de la piel','pieza',3,'6 días','Tarjeta de débito','Colombia',30.99,40,13,1,'1748862159619-550520293.webp',NULL,NULL),(7,'Zapatillas Running','Calzado para correr con amortiguación','Deportes','Calzado','rollo',1,'3 días','Cheque','Colombia',50.00,25,13,1,'1748862211396-100121545.webp',NULL,NULL),(8,'Juego de Mesa Estrategia','Juego de mesa para 2-4 jugadores','Juguetes','Juegos de mesa','pieza',2,'5 días','Contra entrega','Colombia',28.45,60,13,1,'1748862252181-16879507.webp',NULL,NULL),(9,'Alimento para Perros','Croquetas para perros adultos','Mascotas','Perros','caja',3,'7 días','PayPal','Colombia',12.50,90,13,1,'1748862286202-405367312.webp',NULL,NULL),(10,'Kit de Herramientas para Autos','Juego completo de herramientas','Automotriz','Accesorios','kg',4,'4 días','Tarjeta de crédito','Colombia',65.30,55,13,1,'1748862324633-4861997.webp',NULL,NULL),(11,'Libro Autoayuda','Guía para mejorar tu bienestar personal','Libros','Autoayuda','pieza',2,'3 días','Efectivo','Colombia',10.00,100,13,1,'1748862370132-857097476.webp',NULL,NULL),(12,'Cuaderno Universitario','Cuaderno rayado de 100 hojas','Papelería','Cuadernos','paquete',1,'2 días','Transferencia bancaria','Colombia',7.50,150,13,1,'1748862402896-459095322.webp',NULL,NULL),(13,'Botas de Cuero','Botas para clima frío','Calzado','Botas','pieza',2,'6 días','Crédito a 30 días','Colombia',45.99,35,13,1,'1748862452315-373308771.webp',NULL,NULL),(14,'Tablet 10 pulgadas','Tablet con pantalla HD y 64GB','Tecnología','Tablets','litro',5,'5 días','Tarjeta de débito','Colombia',150.00,15,13,1,'1748862496036-986233096.webp',NULL,NULL),(15,'Maleta de Viaje','Maleta rígida con ruedas y candado','Viajes','Maletas','caja',3,'7 días','Efectivo','Colombia',120.50,20,13,1,'1748862528705-777406620.webp',NULL,NULL),(16,'Guitarra Acústica','Guitarra de madera para principiantes','Instrumentos Musicales','Guitarras','pieza',1,'4 días','PayPal','Colombia',300.00,10,13,1,'1748862560976-275518476.webp',NULL,NULL),(17,'Planta de Interior','Planta decorativa para el hogar','Jardín','Plantas','gramo',2,'3 días','Contra entrega','Colombia',25.75,70,13,1,'1748862620877-889180110.jpg',NULL,NULL),(18,'Sofá de 3 plazas','Sofá cómodo para sala de estar','Muebles','Sofás','pieza',1,'6 días','Cheque','Colombia',400.00,5,13,1,'1748862677112-392160863.webp',NULL,NULL),(19,'Pañales para Bebés','Pañales desechables tamaño mediano','Bebés','Pañales','paquete',4,'2 días','Transferencia bancaria','Colombia',18.25,200,13,1,'1748862711855-596107140.webp',NULL,NULL),(20,'Silla de Oficina Ergonomica','Silla con soporte lumbar ajustable','Muebles','Sillas de oficina','pieza',3,'5 días','Tarjeta de crédito','Colombia',75.00,30,13,1,'1748862800910-807447338.webp',NULL,NULL);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resenas`
--

DROP TABLE IF EXISTS `resenas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resenas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `usuario_nombre` varchar(100) NOT NULL,
  `usuario_email` varchar(150) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `codigo_pais` varchar(2) DEFAULT NULL,
  `calificacion` int NOT NULL,
  `comentario` text,
  `imagen_resena` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `verificado` tinyint(1) DEFAULT '0',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_producto_id` (`producto_id`),
  KEY `idx_calificacion` (`calificacion`),
  KEY `idx_fecha` (`fecha_creacion`),
  CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resenas_chk_1` CHECK (((`calificacion` >= 1) and (`calificacion` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
INSERT INTO `resenas` VALUES (59,1,'Bryan Guerra','bdguerra@unicesar.edu.co','Colombia','CO',5,'buen producto',NULL,'2025-06-02 11:18:05',0,1);
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `actualizar_estadisticas_resenas` AFTER INSERT ON `resenas` FOR EACH ROW BEGIN 
    -- Insertar o actualizar estadísticas
    INSERT INTO resenas_estadisticas (
        producto_id, 
        total_resenas, 
        promedio_calificacion,
        calificacion_5, 
        calificacion_4, 
        calificacion_3, 
        calificacion_2, 
        calificacion_1
    )
    SELECT 
        NEW.producto_id,
        COUNT(*) as total,
        ROUND(AVG(calificacion), 1) as promedio,
        SUM(CASE WHEN calificacion = 5 THEN 1 ELSE 0 END) as cal_5,
        SUM(CASE WHEN calificacion = 4 THEN 1 ELSE 0 END) as cal_4,
        SUM(CASE WHEN calificacion = 3 THEN 1 ELSE 0 END) as cal_3,
        SUM(CASE WHEN calificacion = 2 THEN 1 ELSE 0 END) as cal_2,
        SUM(CASE WHEN calificacion = 1 THEN 1 ELSE 0 END) as cal_1
    FROM resenas 
    WHERE producto_id = NEW.producto_id AND activo = TRUE
    ON DUPLICATE KEY UPDATE 
        total_resenas = VALUES(total_resenas),
        promedio_calificacion = VALUES(promedio_calificacion),
        calificacion_5 = VALUES(calificacion_5),
        calificacion_4 = VALUES(calificacion_4),
        calificacion_3 = VALUES(calificacion_3),
        calificacion_2 = VALUES(calificacion_2),
        calificacion_1 = VALUES(calificacion_1);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `resenas_estadisticas`
--

DROP TABLE IF EXISTS `resenas_estadisticas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resenas_estadisticas` (
  `producto_id` int NOT NULL,
  `total_resenas` int DEFAULT '0',
  `promedio_calificacion` decimal(2,1) DEFAULT '0.0',
  `calificacion_5` int DEFAULT '0',
  `calificacion_4` int DEFAULT '0',
  `calificacion_3` int DEFAULT '0',
  `calificacion_2` int DEFAULT '0',
  `calificacion_1` int DEFAULT '0',
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`producto_id`),
  CONSTRAINT `resenas_estadisticas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas_estadisticas`
--

LOCK TABLES `resenas_estadisticas` WRITE;
/*!40000 ALTER TABLE `resenas_estadisticas` DISABLE KEYS */;
INSERT INTO `resenas_estadisticas` VALUES (1,1,5.0,1,0,0,0,0,'2025-06-02 11:18:05');
/*!40000 ALTER TABLE `resenas_estadisticas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `rol` enum('distribuidor','proveedor','admin') NOT NULL DEFAULT 'distribuidor',
  `imagen` varchar(150) DEFAULT NULL,
  `pais` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (13,'Bryan Guerra','123','1067599519','bdguerra@unicesar.edu.co','3232532190','proveedor','/uploads/1748861489171-108510195.webp','CO'),(14,'Juan Pérez','admin','1067599519','juanp@gmail.com','3232532190','proveedor',NULL,'CO'),(19,'hsshj','mnbv','1472583690','juan@example.com','0999999999','distribuidor','/uploads/1748845161146-243427059.webp','CO'),(20,'Naruto mini figura de accion','hjkl','12345678','bdg@gmail.com','0999999999','proveedor',NULL,'CO'),(22,'Juan Pérez','mnbv','1067599517','suluisma@gmail.com','0999999999','distribuidor',NULL,'CO'),(23,'Bryan David Guerra','admin','1234567890','admin@gmail.com','555-1234','admin',NULL,'CO');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'provecta'
--

--
-- Dumping routines for database 'provecta'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-02  9:09:47
