-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: provecta
-- ------------------------------------------------------
-- Server version	9.2.0

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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (35,101,14);
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
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (101,'Martillo de Uña','Martillo con mango ergonómico','Ferretería','Herramientas','unidad',5,'2 días','Contado','Nacional',12000.00,50,14,1,'1748839299836-6065411.jpg',NULL,NULL),(102,'Destornillador Plano','Destornillador tamaño estándar','Ferretería','Herramientas','unidad',10,'2 días','Transferencia','Importado',3500.00,100,14,1,'1748839847182-986396546.jpg',NULL,NULL),(103,'Taladro Eléctrico','Taladro de 650W con brocas','Ferretería','Herramientas Eléctricas','unidad',2,'3 días','Crédito','Importado',85000.00,20,14,1,'1748839886451-133665661.jpg',NULL,NULL),(104,'Pintura Blanca 1 Galón','Pintura vinílica para interior','Construcción','Pinturas','galón',10,'4 días','Contado','Nacional',25000.00,30,14,1,'1748841105943-867772222.jpg',NULL,NULL),(105,'Brocha 3 pulgadas','Brocha para pintura en madera','Construcción','Herramientas','unidad',15,'2 días','Transferencia','Nacional',4500.00,60,14,1,'1748841138007-708276425.jpg',NULL,NULL),(106,'Lámpara LED Recargable','Lámpara portátil con USB','Iluminación','Lámparas','unidad',5,'3 días','Efectivo','Importado',22000.00,40,14,1,'1748841180771-919319093.jpg',NULL,NULL),(107,'Escoba Plástica','Escoba resistente para exteriores','Aseo','Limpieza','unidad',20,'2 días','Contado','Nacional',7800.00,70,14,1,'1748841212297-904216018.jpg',NULL,NULL),(108,'Trapeador de Microfibra','Trapeador absorbente giratorio','Aseo','Limpieza','unidad',15,'2 días','Transferencia','Importado',12500.00,50,14,1,'1748841263369-734030809.jpg',NULL,NULL),(109,'Desinfectante 1L','Desinfectante multiusos cítrico','Aseo','Productos Químicos','litro',30,'1 día','Contado','Nacional',3200.00,100,14,1,'1748841293932-301381954.jpg',NULL,NULL),(110,'Detergente en Polvo 5kg','Detergente biodegradable','Aseo','Lavandería','bolsa',10,'1 día','Efectivo','Nacional',9500.00,80,14,1,'1748841333300-676971001.jpg',NULL,NULL),(111,'Cemento Gris 50kg','Cemento Portland uso general','Construcción','Materiales','saco',50,'2 días','Transferencia','Nacional',32000.00,200,14,1,'1748841365858-61375968.jpg',NULL,NULL),(112,'Arena Fina m³','Arena lavada para mezcla','Construcción','Materiales','m³',1,'1 día','Contado','Nacional',150000.00,15,14,1,'1748841386486-800115398.jpg',NULL,NULL),(113,'Laptop 15.6\" Intel i5','Portátil con 8GB RAM y SSD','Tecnología','Computadores','unidad',3,'5 días','Crédito','Importado',2200000.00,10,14,1,'1748841431088-739149152.jpg',NULL,NULL),(114,'Mouse Inalámbrico','Mouse con conexión USB y batería','Tecnología','Accesorios','unidad',10,'2 días','Transferencia','Importado',35000.00,25,14,1,'1748841462054-397553334.jpg',NULL,NULL),(115,'Cargador de Celular','Cargador tipo C carga rápida','Tecnología','Accesorios','unidad',20,'1 día','Contado','Nacional',18000.00,60,14,1,'1748841490497-435438957.jpg',NULL,NULL),(116,'Impresora Multifuncional','Impresora, escáner y copiadora','Tecnología','Equipos de Oficina','unidad',2,'4 días','Crédito','Importado',380000.00,8,14,1,'1748841541815-144987009.jpg',NULL,NULL),(117,'Silla Oficina Ergonómica','Silla con soporte lumbar y ruedas','Muebles','Oficina','unidad',5,'3 días','Contado','Nacional',210000.00,15,14,1,'1748841575209-102523364.jpg',NULL,NULL),(118,'Escritorio de Madera','Escritorio modular color roble','Muebles','Oficina','unidad',3,'5 días','Transferencia','Nacional',350000.00,12,14,1,'1748841613567-401552838.jpg',NULL,NULL),(119,'Ventilador de Pedestal','Ventilador de 3 velocidades','Electrodomésticos','Climatización','unidad',10,'2 días','Contado','Importado',90000.00,20,14,1,'1748841655436-138771578.jpg',NULL,NULL),(120,'Plancha a Vapor','Plancha con sistema antigoteo','Electrodomésticos','Hogar','unidad',10,'1 día','Transferencia','Importado',78000.00,18,14,1,'1748841692307-28080852.jpg',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
INSERT INTO `resenas` VALUES (46,114,'Emelin Elvira Rodriguez Niebles','eelvirarodriguez@unicesar.edu.co','Colombia','CO',4,'bien',NULL,'2025-06-02 05:22:56',0,1);
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
INSERT INTO `resenas_estadisticas` VALUES (114,1,4.0,0,1,0,0,0,'2025-06-02 05:22:56');
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
  `rol` enum('Proveedor','Distribuidor') NOT NULL,
  `imagen` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (13,'Bryan Antonio  Guerra Ramirez','123','1067599510','bdguerra@unicesar.edu.co','3232532190','Proveedor',NULL),(14,'Emelin Elvira Rodriguez Niebles','123','1066868585','eelvirarodriguez@unicesar.edu.co','3183415053','Proveedor',NULL);
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

-- Dump completed on 2025-06-02  0:33:14
