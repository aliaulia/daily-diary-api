-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2020 at 06:40 PM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `diary_daily_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `diaries`
--

CREATE TABLE `diaries` (
  `diary_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `diaries`
--

INSERT INTO `diaries` (`diary_id`, `date`, `title`, `content`, `user_id`, `created_at`, `updated_at`) VALUES
(1, '2020-02-03', 'test diary yang pertama', 'test isi content yang pertama, tapi ini sudah di update', 7, '2020-06-04 07:33:17', '0000-00-00 00:00:00'),
(2, '2020-02-03', 'berawal dari sebuah pertemuan', 'test bertemu teman sepermainan', 8, '2020-06-03 05:35:58', '0000-00-00 00:00:00'),
(3, '2020-02-04', 'hari terakhir sekolah', 'test isi content yang kedua ', 8, '2020-06-03 05:35:58', '0000-00-00 00:00:00'),
(4, '2020-03-07', 'senantiasa menaklukan kejahatan', 'test isi content yang ketiga', 8, '2020-06-03 05:35:58', '0000-00-00 00:00:00'),
(5, '2020-03-09', 'In food we trust', 'test isi content yang keempat', 9, '2020-06-03 05:35:58', '0000-00-00 00:00:00'),
(6, '2020-03-13', 'Tenaga kesehatan di bantu warga', 'test isi content yang kelima', 12, '2020-06-03 05:35:58', '0000-00-00 00:00:00'),
(7, '2020-04-19', 'Olahraga hari minggu', 'test isi content yang keenam', 12, '2020-06-03 05:35:58', '0000-00-00 00:00:00'),
(8, '2019-12-10', 'Akhir tahun yang baik baik biarlah tetap baik', 'test akhir tahun dapat angpao apapun yang terjadi', 12, '2020-06-04 07:08:51', '0000-00-00 00:00:00'),
(9, '2020-02-02', 'test kembali update', 'test isi content, tapi ini sudah di update kembali', 7, '2020-06-04 07:33:41', '0000-00-00 00:00:00'),
(10, '2019-06-15', 'Menelusur keingintahuan update', 'test keingintahuan anda dengan membuat test update', 21, '2020-06-04 07:36:36', '2020-06-04 07:42:11'),
(11, '2020-06-18', 'Lorem adalah ketidakpastian', 'menulis dengan lorem cukup memudahkan orang-orang dalam mengembangkan program', 23, '2020-06-05 15:52:02', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `birthday` date NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(70) NOT NULL,
  `session_token` varchar(70) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `fullname`, `birthday`, `email`, `username`, `password`, `session_token`) VALUES
(7, 'aba ba', '1994-03-12', 'nama1@gmail.com', 'pintar1', '$2b$10$uTktJ0QhJve.wlu.NPSpIeisPNHYC0ytuDB01HHB2B9KrymdRWlCS', NULL),
(8, 'abi bu', '1993-12-26', 'nama2@gmail.com', 'pintar2', '$2b$10$ol9o4DKc9pNuzNH5J33R2.DWJ4ew689R1z7sOFJuNYD2kaeIeH7e2', NULL),
(9, 'abi bi', '2000-08-07', 'nama3@gmail.com', 'pintar3', '$2b$10$n8oPchtyHsRyBJXFZuiVPe3CszemTOUrpFDt7KBvCds.AlTpFGAO.', NULL),
(10, 'caka ca', '1997-01-09', 'nama4@gmail.com', 'pintar4', '$2b$10$4MSkz4mTaaAf9kLtAvd/RuIVGAtitdbYHsK3R36v2odTEvupVX7eC', NULL),
(11, 'caka ci', '1995-03-13', 'nama5@gmail.com', 'pintar5', '$2b$10$Nj4J8NqCpFf6uBArkcGMnenAjMmwn6FPgMjfi.MuV6ifkqytTSMUS', NULL),
(12, 'caka cu', '2005-06-19', 'nama6@gmail.com', 'pintar6', '$2b$10$G5QnWgD0fwxR3i5yS007we4IITst1BJVE/tq1xwgCpi5eA2XoOt7e', NULL),
(19, 'Raykonji Register test', '1998-12-14', 'raykonji@gmail.com', 'raykonji', '$2b$10$UrRlVRdCaH1pQDhzN5M6sOokh/RaSE1MzEhf1GlYvdMnspUtQPloW', NULL),
(20, 'Magister Register test tanpa angka', '1998-11-11', 'magister@gmail.com', 'magister', '$2b$10$lXJPjSnVvTMfxe.RLpGNQO/sZvfOa6ZCWwUfewJ9Zgetk4ZBcWcCK', NULL),
(21, 'Juanda Sudirman', '1965-02-02', 'juanda@gmail.com', 'juandapahlawan', '$2b$10$EoQBXey3dbFBv6h2xxslhePzH3sxrJSo4mYgJHf9a4xi/poLfCmm2', 'eYk4ohjDS0WBvy1v4lm-eHnsAHvlL71K'),
(22, 'Yasin Mayasin', '1969-12-21', 'yasin@yahoo.com', 'yasin_cibaduyut', '$2b$10$SiQwkbl7CRhxf2QKjjG1LuJ44cai5UhW4GiQdsWZ2ZeRa8EvtqYOG', NULL),
(23, 'Juna Jamu', '1969-12-21', 'juna@yahoo.com', 'junajamu', '$2b$10$D7GLELNk6HMM86xrFHHyBuSBbnx9pJF7mt4/p2CfGD3RH0NxNCuBy', 'jL3SMvs8l3zajOwIIECPqHgCzcadvbKI');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `diaries`
--
ALTER TABLE `diaries`
  ADD PRIMARY KEY (`diary_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `diaries`
--
ALTER TABLE `diaries`
  MODIFY `diary_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `diaries`
--
ALTER TABLE `diaries`
  ADD CONSTRAINT `diaries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
