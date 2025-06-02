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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (27,16,11),(30,17,11),(31,29,11),(32,30,11),(33,31,11);
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (16,'goku man','goku man 2.0','Hogar','Decoración','kg',15,'5','Contra entrega','Valledupar',80000.00,300,11,1,'1748672507557-604928866.webp',NULL,NULL),(17,'Naruto mini figura de accion','figura de acción del personaje principal de la serie naruto, esta figura cuenta con una altura de 10\'\'','Hogar','Decoración','kg',1,'7','Tarjeta de crédito','Valledupar',90000.00,600,11,1,'1748729605956-175508721.jpg',NULL,NULL),(19,'Toyota AE86','Toyota AE86 de la serie animada Initial-D, conducida por takumi ( el protagonista)','Hogar','Electrodomésticos','kg',2,'1 mes','Transferencia bancaria','Japon',7500000.00,600,10,0,'1748732038453-883473154.jpg',NULL,NULL),(20,'Samsung A3','Teléfono Samsung A3\r\nRAM 8\r\nAlmacenamiento 1T\r\nprocesador Snapdragon 8\r\npantalla de 6,7\'\' \r\nbatería de 5300mAh','Electrónica','Teléfonos móviles','kg',1,'3 Días','Contra entrega','Valledupar',700000.00,500,10,0,'1748732459781-906456975.jpg','1748732459792-850822547.webp',NULL),(25,'imagen ramdon','sssssssssss s ss s s sss   ','Electrónica','Teléfonos móviles','kg',12,'1 mes','Transferencia bancaria','Valledupar',15489.00,500,10,0,'1748733115450-481854397.jpg',NULL,NULL),(26,'Naruto mini figura de accion','kk','Electrónica','Teléfonos móviles','kg',15,'1 mes','Transferencia bancaria','Colombia',1.00,300,10,0,'1748733212449-437223878.jpg',NULL,NULL),(27,'hsshj','julion','Electrónica','Teléfonos móviles','kg',156,'2 semanas ','Transferencia bancaria','Colombia',1245.00,156546,10,0,'1748733374951-9775411.gif',NULL,NULL),(28,'hsshj','1548','Electrónica','Teléfonos móviles','pieza',15484,'6 dias','Transferencia bancaria','Valledupar',154.00,1254,10,0,'1748733840733-605046149.jpg',NULL,NULL),(29,'b','ja','Electrónica','Teléfonos móviles','kg',1,'2 semanas ','Contra entrega','Valledupar',32.00,65,10,1,'1748746961396-733834771.jpg',NULL,NULL),(30,'c','c','Electrónica','Teléfonos móviles','kg',1,'2 semanas ','Transferencia bancaria','Valledupar',1.00,2,11,1,'1748802399963-642955360.gif',NULL,NULL),(31,'d','d2','Electrónica','Teléfonos móviles','kg',1,'1 mes','Transferencia bancaria','Colombia',2.00,2,11,1,'1748802581375-211132141.gif',NULL,NULL),(32,'e','e','Electrónica','Teléfonos móviles','kg',1,'1 mes','Transferencia bancaria','Valledupar',3.00,56556,11,1,'1748829331468-895113908.jpg',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
INSERT INTO `resenas` VALUES (16,16,'Bryan David Guerra Ramirez','bdguerra@unicesar.edu.co','Colombia','CO',5,'muy buen material\n',NULL,'2025-05-31 06:43:11',0,1),(17,17,'luis manuel','suluisma@gmail.com','Colombia','CO',4,'hhj',NULL,'2025-05-31 14:08:49',0,1),(18,17,'luis manuel','suluisma@gmail.com','Colombia','CO',5,'el ñaruto',NULL,'2025-05-31 14:25:10',0,1),(20,17,'Bryan David Guerra Ramirez','bdguerra@unicesar.edu.co','Colombia','CO',5,'full cute',NULL,'2025-05-31 16:03:24',0,1),(21,28,'Bryan David Guerra Ramirez','bdg@gmail.com','Colombia','CO',5,'es bueno',NULL,'2025-05-31 23:44:52',0,1),(22,17,'Bryan David Guerra Ramirez','bdg@gmail.com','Colombia','CO',5,'esta bien\n',NULL,'2025-06-01 01:28:18',0,1),(23,16,'Bryan David Guerra Ramirez','bdg@gmail.com','Colombia','CO',4,'esta buena la figura, muy cute',NULL,'2025-06-01 01:30:03',0,1),(24,29,'Bryan David Guerra Ramirez','bdg@gmail.com','Colombia','CO',5,'buen producto',NULL,'2025-06-01 03:03:17',0,1),(25,29,'Bryan David Guerra Ramirez','bdg@gmail.com','Colombia','CO',5,'buen producto\n',NULL,'2025-06-01 03:08:32',0,1),(26,29,'Bryan David Guerra Ramirez','bdg@gmail.com','Colombia','CO',1,'no me gusto',NULL,'2025-06-01 03:08:44',0,1),(27,29,'Bryan David Guerra Ramirez','bdg@gmail.com','Colombia','CO',2,'esta masomenos',NULL,'2025-06-01 03:09:01',0,1),(28,29,'Bryan David Guerra Ramirez','bdg@gmail.com','Colombia','CO',5,'buen producto',NULL,'2025-06-01 03:09:21',0,1),(29,29,'Bryan David Guerra Ramirez','bdg@gmail.com','Colombia','CO',5,'muy buneo',NULL,'2025-06-01 03:09:33',0,1),(30,16,'Bryan David Guerra Ramirez','bdguerra@unicesar.edu.co','Colombia','CO',5,'muy bueno',NULL,'2025-06-01 18:25:19',0,1),(31,29,'Bryan David Guerra Ramirez','bdguerra@unicesar.edu.co','Colombia','CO',5,'muy bueno el producto',NULL,'2025-06-01 18:25:46',0,1),(32,30,'Bryan David Guerra Ramirez','bdguerra@unicesar.edu.co','Colombia','CO',5,'esta chevre',NULL,'2025-06-01 18:27:21',0,1),(33,31,'Bryan David Guerra Ramirez','bdguerra@unicesar.edu.co','Colombia','CO',5,'muy bueno',NULL,'2025-06-01 18:30:18',0,1),(34,17,'Bryan David Guerra Ramirez','bdguerra@unicesar.edu.co','Colombia','CO',1,'malo',NULL,'2025-06-02 01:54:46',0,1),(35,32,'Bryan David Guerra Ramirez','bdguerra@unicesar.edu.co','Colombia','CO',5,'bueno\n',NULL,'2025-06-02 01:56:12',0,1),(36,32,'Bryan David Guerra Ramirez','bdguerra@unicesar.edu.co','Colombia','CO',5,'exel',NULL,'2025-06-02 01:58:54',0,1);
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `resenas_estadisticas` VALUES (16,3,4.7,2,1,0,0,0,'2025-06-01 18:25:19'),(17,5,4.0,3,1,0,0,1,'2025-06-02 01:54:46'),(28,1,5.0,1,0,0,0,0,'2025-05-31 23:44:52'),(29,7,4.0,5,0,0,1,1,'2025-06-01 18:25:46'),(30,1,5.0,1,0,0,0,0,'2025-06-01 18:27:21'),(31,1,5.0,1,0,0,0,0,'2025-06-01 18:30:18'),(32,2,5.0,2,0,0,0,0,'2025-06-02 01:58:54');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'camilo','123456','12345678','junapa@gmail.com','3159997653','Proveedor',NULL),(2,'altagh5','contra23','9327328','jaun@334','4009998761','Distribuidor',NULL),(3,'Juan Pérez','1234','12345678','juan@example.com','0999999999','Proveedor','/uploads/1748653958247-943615558.gif'),(4,'r','123','123','r@r.com','123','Proveedor',NULL),(5,'comprador','123','9','comprador@c','1','Distribuidor',NULL),(6,'prove','123','123467','prove@1','12132145','Proveedor',NULL),(7,'nuevo','123','9382323','nuevoprove@1','33223','Proveedor',NULL),(8,'Nisan','12345','1098328823','Nisan43@gmail.com','3009997865','Proveedor',NULL),(9,'Luis Camilo Editar','123','108993823','luiscamilo@gmail.com','4003009871','Proveedor',NULL),(10,'Bryan David Guerra Ramirez','Blash20','1067599519','bdg@gmail.com','3232532190','Proveedor','/uploads/1748731884404-144805078.jpg'),(11,'Bryan David Guerra Ramirez','Blash','1067599517','bdguerra@unicesar.edu.co','3232532190','Proveedor','/uploads/1748703340497-222631446.gif'),(12,'luis manuel','123','1067599513','suluisma@gmail.com','3232532190','Distribuidor',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-01 21:08:13
