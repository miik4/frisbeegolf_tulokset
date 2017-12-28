-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 19.10.2016 klo 20:00
-- Palvelimen versio: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `frisbeegolf`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `omattulokset`
--

CREATE TABLE IF NOT EXISTS `omattulokset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `radan_id` int(11) NOT NULL,
  `pvm` bigint(20) NOT NULL,
  `tulos` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Vedos taulusta `omattulokset`
--

INSERT INTO `omattulokset` (`id`, `radan_id`, `pvm`, `tulos`) VALUES
(1, 1, 1476525600, -2),
(2, 2, 1476648000, 3),
(6, 4, 1476716400, 0),
(7, 2, 1476799200, 3),
(8, 1, 1476894057, -4);

-- --------------------------------------------------------

--
-- Rakenne taululle `radat`
--

CREATE TABLE IF NOT EXISTS `radat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `radan_nimi` text NOT NULL,
  `vaylat` int(11) NOT NULL,
  `par` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Vedos taulusta `radat`
--

INSERT INTO `radat` (`id`, `radan_nimi`, `vaylat`, `par`) VALUES
(1, 'Juvan Frisbeegolfpuisto', 9, 27),
(2, 'Mikkelin frisbeegolfpuisto', 21, 63),
(3, 'Kaihun frisbeegolfpuisto', 18, 61),
(4, 'Kaitaisten frisbeegolf', 9, 27),
(5, 'Kanavan frisbeegolf', 18, 61);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
