-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2020 at 12:41 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sensor_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `energy-summary`
--

CREATE TABLE `energy-summary` (
  `id` int(11) NOT NULL,
  `sensor_id` char(6) NOT NULL,
  `voltage` float NOT NULL,
  `current` float NOT NULL,
  `timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `energy_reading`
--

CREATE TABLE `energy_reading` (
  `id` int(11) NOT NULL,
  `sensor_id` char(6) NOT NULL,
  `voltage` float NOT NULL,
  `current` float NOT NULL,
  `timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `environment-summary`
--

CREATE TABLE `environment-summary` (
  `id` int(11) NOT NULL,
  `sensor_id` char(6) NOT NULL,
  `voltage` float NOT NULL,
  `current` float NOT NULL,
  `timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `environment_reading`
--

CREATE TABLE `environment_reading` (
  `id` int(11) NOT NULL,
  `sensor_id` char(6) NOT NULL,
  `wind_speed` float NOT NULL,
  `solar_irradiance` float NOT NULL,
  `timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `relay_control`
--

CREATE TABLE `relay_control` (
  `id` int(11) NOT NULL,
  `relay_id` varchar(255) NOT NULL,
  `status` char(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `relay_control`
--

INSERT INTO `relay_control` (`id`, `relay_id`, `status`) VALUES
(1, 'PSN001-R0', 'FL'),
(2, 'PSN001-R1', 'FL'),
(3, 'PSN001-R2', 'FL'),
(4, 'PSN001-R3', 'FL'),
(5, 'PSN002-R0', 'FL'),
(6, 'PSN003-R0', 'FL');

-- --------------------------------------------------------

--
-- Table structure for table `sensor`
--

CREATE TABLE `sensor` (
  `id` char(6) NOT NULL,
  `sensor_name` varchar(50) NOT NULL,
  `sensor_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sensor`
--

INSERT INTO `sensor` (`id`, `sensor_name`, `sensor_type`) VALUES
('ESN001', 'Wind Sensor Node', 'environment'),
('PSN001', 'Electrical Sensor Node #1', 'electrical'),
('PSN002', 'Electrical Sensor Node #2', 'electrical'),
('PSN003', 'Electrical Sensor Node #3', 'electrical'),
('PSN004', 'Electrical Sensor Node #4', 'electrical');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `energy_reading`
--
ALTER TABLE `energy_reading`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `environment_reading`
--
ALTER TABLE `environment_reading`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `relay_control`
--
ALTER TABLE `relay_control`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sensor`
--
ALTER TABLE `sensor`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `energy_reading`
--
ALTER TABLE `energy_reading`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `environment_reading`
--
ALTER TABLE `environment_reading`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `relay_control`
--
ALTER TABLE `relay_control`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
