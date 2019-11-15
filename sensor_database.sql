-- phpMyAdmin SQL Dump
-- version 4.6.6deb4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 16, 2019 at 04:51 AM
-- Server version: 10.1.23-MariaDB-9+deb9u1
-- PHP Version: 7.0.30-0+deb9u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
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
-- Table structure for table `current_reading`
--

CREATE TABLE `current_reading` (
  `id` int(11) NOT NULL,
  `sensor_id` char(6) NOT NULL,
  `value` float NOT NULL,
  `timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `relay_control`
--

CREATE TABLE `relay_control` (
  `id` int(11) NOT NULL,
  `sensor_id` char(6) NOT NULL,
  `status` char(2) NOT NULL,
  `override` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sensor`
--

CREATE TABLE `sensor` (
  `id` char(6) NOT NULL,
  `sensor_name` varchar(50) NOT NULL,
  `sensor_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `voltage_reading`
--

CREATE TABLE `voltage_reading` (
  `id` int(11) NOT NULL,
  `sensor_id` char(6) NOT NULL,
  `value` float NOT NULL,
  `timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `wind_speed_reading`
--

CREATE TABLE `wind_speed_reading` (
  `id` int(11) NOT NULL,
  `sensor_id` char(6) NOT NULL,
  `value` float NOT NULL,
  `timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `current_reading`
--
ALTER TABLE `current_reading`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `relay_control`
--
ALTER TABLE `relay_control`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `voltage_reading`
--
ALTER TABLE `voltage_reading`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wind_speed_reading`
--
ALTER TABLE `wind_speed_reading`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `current_reading`
--
ALTER TABLE `current_reading`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `relay_control`
--
ALTER TABLE `relay_control`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `voltage_reading`
--
ALTER TABLE `voltage_reading`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `wind_speed_reading`
--
ALTER TABLE `wind_speed_reading`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
