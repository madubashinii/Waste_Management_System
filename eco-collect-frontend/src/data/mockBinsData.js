// Mock data for bins table
// Based on the database schema:
// CREATE TABLE bins (
//     bin_id INT AUTO_INCREMENT PRIMARY KEY,
//     resident_id INT,
//     ward_id INT NOT NULL,
//     location VARCHAR(255),
//     bin_type ENUM('General', 'Recyclable', 'Organic'),
//     qr_code VARCHAR(100) UNIQUE,
//     status ENUM('Active', 'Inactive', 'Missing') DEFAULT 'Active',
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (resident_id) REFERENCES users(user_id),
//     FOREIGN KEY (ward_id) REFERENCES zones(ward_id)
// );

export const mockBins = [
  // Ward 1 bins
  { bin_id: 1, resident_id: 101, ward_id: 1, location: '123 Galle Road, Colombo 03', bin_type: 'General', qr_code: 'BIN001', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 2, resident_id: 102, ward_id: 1, location: '125 Galle Road, Colombo 03', bin_type: 'Recyclable', qr_code: 'BIN002', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 3, resident_id: 103, ward_id: 1, location: '127 Galle Road, Colombo 03', bin_type: 'Organic', qr_code: 'BIN003', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 4, resident_id: 104, ward_id: 1, location: '129 Galle Road, Colombo 03', bin_type: 'General', qr_code: 'BIN004', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 5, resident_id: 105, ward_id: 1, location: '131 Galle Road, Colombo 03', bin_type: 'Recyclable', qr_code: 'BIN005', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 2 bins
  { bin_id: 6, resident_id: 201, ward_id: 2, location: '45 Duplication Road, Colombo 04', bin_type: 'General', qr_code: 'BIN006', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 7, resident_id: 202, ward_id: 2, location: '47 Duplication Road, Colombo 04', bin_type: 'Organic', qr_code: 'BIN007', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 8, resident_id: 203, ward_id: 2, location: '49 Duplication Road, Colombo 04', bin_type: 'Recyclable', qr_code: 'BIN008', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 9, resident_id: 204, ward_id: 2, location: '51 Duplication Road, Colombo 04', bin_type: 'General', qr_code: 'BIN009', status: 'Inactive', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 10, resident_id: 205, ward_id: 2, location: '53 Duplication Road, Colombo 04', bin_type: 'Recyclable', qr_code: 'BIN010', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 3 bins
  { bin_id: 11, resident_id: 301, ward_id: 3, location: '78 Ward Place, Colombo 07', bin_type: 'General', qr_code: 'BIN011', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 12, resident_id: 302, ward_id: 3, location: '80 Ward Place, Colombo 07', bin_type: 'Organic', qr_code: 'BIN012', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 13, resident_id: 303, ward_id: 3, location: '82 Ward Place, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN013', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 14, resident_id: 304, ward_id: 3, location: '84 Ward Place, Colombo 07', bin_type: 'General', qr_code: 'BIN014', status: 'Missing', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 15, resident_id: 305, ward_id: 3, location: '86 Ward Place, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN015', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 4 bins
  { bin_id: 16, resident_id: 401, ward_id: 4, location: '12 Horton Place, Colombo 07', bin_type: 'General', qr_code: 'BIN016', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 17, resident_id: 402, ward_id: 4, location: '14 Horton Place, Colombo 07', bin_type: 'Organic', qr_code: 'BIN017', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 18, resident_id: 403, ward_id: 4, location: '16 Horton Place, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN018', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 19, resident_id: 404, ward_id: 4, location: '18 Horton Place, Colombo 07', bin_type: 'General', qr_code: 'BIN019', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 20, resident_id: 405, ward_id: 4, location: '20 Horton Place, Colombo 07', bin_type: 'Organic', qr_code: 'BIN020', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 5 bins
  { bin_id: 21, resident_id: 501, ward_id: 5, location: '25 Independence Avenue, Colombo 07', bin_type: 'General', qr_code: 'BIN021', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 22, resident_id: 502, ward_id: 5, location: '27 Independence Avenue, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN022', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 23, resident_id: 503, ward_id: 5, location: '29 Independence Avenue, Colombo 07', bin_type: 'Organic', qr_code: 'BIN023', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 24, resident_id: 504, ward_id: 5, location: '31 Independence Avenue, Colombo 07', bin_type: 'General', qr_code: 'BIN024', status: 'Inactive', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 25, resident_id: 505, ward_id: 5, location: '33 Independence Avenue, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN025', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 6 bins
  { bin_id: 26, resident_id: 601, ward_id: 6, location: '8 Gregory Road, Colombo 07', bin_type: 'General', qr_code: 'BIN026', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 27, resident_id: 602, ward_id: 6, location: '10 Gregory Road, Colombo 07', bin_type: 'Organic', qr_code: 'BIN027', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 28, resident_id: 603, ward_id: 6, location: '12 Gregory Road, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN028', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 29, resident_id: 604, ward_id: 6, location: '14 Gregory Road, Colombo 07', bin_type: 'General', qr_code: 'BIN029', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 30, resident_id: 605, ward_id: 6, location: '16 Gregory Road, Colombo 07', bin_type: 'Organic', qr_code: 'BIN030', status: 'Missing', created_at: '2024-01-15T08:00:00Z' },

  // Ward 7 bins
  { bin_id: 31, resident_id: 701, ward_id: 7, location: '15 Barnes Place, Colombo 07', bin_type: 'General', qr_code: 'BIN031', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 32, resident_id: 702, ward_id: 7, location: '17 Barnes Place, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN032', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 33, resident_id: 703, ward_id: 7, location: '19 Barnes Place, Colombo 07', bin_type: 'Organic', qr_code: 'BIN033', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 34, resident_id: 704, ward_id: 7, location: '21 Barnes Place, Colombo 07', bin_type: 'General', qr_code: 'BIN034', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 35, resident_id: 705, ward_id: 7, location: '23 Barnes Place, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN035', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 8 bins
  { bin_id: 36, resident_id: 801, ward_id: 8, location: '5 Flower Road, Colombo 07', bin_type: 'General', qr_code: 'BIN036', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 37, resident_id: 802, ward_id: 8, location: '7 Flower Road, Colombo 07', bin_type: 'Organic', qr_code: 'BIN037', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 38, resident_id: 803, ward_id: 8, location: '9 Flower Road, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN038', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 39, resident_id: 804, ward_id: 8, location: '11 Flower Road, Colombo 07', bin_type: 'General', qr_code: 'BIN039', status: 'Inactive', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 40, resident_id: 805, ward_id: 8, location: '13 Flower Road, Colombo 07', bin_type: 'Organic', qr_code: 'BIN040', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 9 bins
  { bin_id: 41, resident_id: 901, ward_id: 9, location: '22 Rosmead Place, Colombo 07', bin_type: 'General', qr_code: 'BIN041', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 42, resident_id: 902, ward_id: 9, location: '24 Rosmead Place, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN042', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 43, resident_id: 903, ward_id: 9, location: '26 Rosmead Place, Colombo 07', bin_type: 'Organic', qr_code: 'BIN043', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 44, resident_id: 904, ward_id: 9, location: '28 Rosmead Place, Colombo 07', bin_type: 'General', qr_code: 'BIN044', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 45, resident_id: 905, ward_id: 9, location: '30 Rosmead Place, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN045', status: 'Missing', created_at: '2024-01-15T08:00:00Z' },

  // Ward 10 bins
  { bin_id: 46, resident_id: 1001, ward_id: 10, location: '18 Cambridge Place, Colombo 07', bin_type: 'General', qr_code: 'BIN046', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 47, resident_id: 1002, ward_id: 10, location: '20 Cambridge Place, Colombo 07', bin_type: 'Organic', qr_code: 'BIN047', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 48, resident_id: 1003, ward_id: 10, location: '22 Cambridge Place, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN048', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 49, resident_id: 1004, ward_id: 10, location: '24 Cambridge Place, Colombo 07', bin_type: 'General', qr_code: 'BIN049', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 50, resident_id: 1005, ward_id: 10, location: '26 Cambridge Place, Colombo 07', bin_type: 'Organic', qr_code: 'BIN050', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 11 bins
  { bin_id: 51, resident_id: 1101, ward_id: 11, location: '35 Reid Avenue, Colombo 07', bin_type: 'General', qr_code: 'BIN051', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 52, resident_id: 1102, ward_id: 11, location: '37 Reid Avenue, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN052', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 53, resident_id: 1103, ward_id: 11, location: '39 Reid Avenue, Colombo 07', bin_type: 'Organic', qr_code: 'BIN053', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 54, resident_id: 1104, ward_id: 11, location: '41 Reid Avenue, Colombo 07', bin_type: 'General', qr_code: 'BIN054', status: 'Inactive', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 55, resident_id: 1105, ward_id: 11, location: '43 Reid Avenue, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN055', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 12 bins
  { bin_id: 56, resident_id: 1201, ward_id: 12, location: '12 Torrington Avenue, Colombo 07', bin_type: 'General', qr_code: 'BIN056', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 57, resident_id: 1202, ward_id: 12, location: '14 Torrington Avenue, Colombo 07', bin_type: 'Organic', qr_code: 'BIN057', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 58, resident_id: 1203, ward_id: 12, location: '16 Torrington Avenue, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN058', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 59, resident_id: 1204, ward_id: 12, location: '18 Torrington Avenue, Colombo 07', bin_type: 'General', qr_code: 'BIN059', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 60, resident_id: 1205, ward_id: 12, location: '20 Torrington Avenue, Colombo 07', bin_type: 'Organic', qr_code: 'BIN060', status: 'Missing', created_at: '2024-01-15T08:00:00Z' },

  // Ward 13 bins
  { bin_id: 61, resident_id: 1301, ward_id: 13, location: '8 Kynsey Road, Colombo 08', bin_type: 'General', qr_code: 'BIN061', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 62, resident_id: 1302, ward_id: 13, location: '10 Kynsey Road, Colombo 08', bin_type: 'Recyclable', qr_code: 'BIN062', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 63, resident_id: 1303, ward_id: 13, location: '12 Kynsey Road, Colombo 08', bin_type: 'Organic', qr_code: 'BIN063', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 64, resident_id: 1304, ward_id: 13, location: '14 Kynsey Road, Colombo 08', bin_type: 'General', qr_code: 'BIN064', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 65, resident_id: 1305, ward_id: 13, location: '16 Kynsey Road, Colombo 08', bin_type: 'Recyclable', qr_code: 'BIN065', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 14 bins
  { bin_id: 66, resident_id: 1401, ward_id: 14, location: '25 Bullers Road, Colombo 07', bin_type: 'General', qr_code: 'BIN066', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 67, resident_id: 1402, ward_id: 14, location: '27 Bullers Road, Colombo 07', bin_type: 'Organic', qr_code: 'BIN067', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 68, resident_id: 1403, ward_id: 14, location: '29 Bullers Road, Colombo 07', bin_type: 'Recyclable', qr_code: 'BIN068', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 69, resident_id: 1404, ward_id: 14, location: '31 Bullers Road, Colombo 07', bin_type: 'General', qr_code: 'BIN069', status: 'Inactive', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 70, resident_id: 1405, ward_id: 14, location: '33 Bullers Road, Colombo 07', bin_type: 'Organic', qr_code: 'BIN070', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 15 bins
  { bin_id: 71, resident_id: 1501, ward_id: 15, location: '15 Havelock Road, Colombo 05', bin_type: 'General', qr_code: 'BIN071', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 72, resident_id: 1502, ward_id: 15, location: '17 Havelock Road, Colombo 05', bin_type: 'Recyclable', qr_code: 'BIN072', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 73, resident_id: 1503, ward_id: 15, location: '19 Havelock Road, Colombo 05', bin_type: 'Organic', qr_code: 'BIN073', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 74, resident_id: 1504, ward_id: 15, location: '21 Havelock Road, Colombo 05', bin_type: 'General', qr_code: 'BIN074', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 75, resident_id: 1505, ward_id: 15, location: '23 Havelock Road, Colombo 05', bin_type: 'Recyclable', qr_code: 'BIN075', status: 'Missing', created_at: '2024-01-15T08:00:00Z' },

  // Ward 16 bins
  { bin_id: 76, resident_id: 1601, ward_id: 16, location: '42 Kirula Road, Colombo 05', bin_type: 'General', qr_code: 'BIN076', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 77, resident_id: 1602, ward_id: 16, location: '44 Kirula Road, Colombo 05', bin_type: 'Organic', qr_code: 'BIN077', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 78, resident_id: 1603, ward_id: 16, location: '46 Kirula Road, Colombo 05', bin_type: 'Recyclable', qr_code: 'BIN078', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 79, resident_id: 1604, ward_id: 16, location: '48 Kirula Road, Colombo 05', bin_type: 'General', qr_code: 'BIN079', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 80, resident_id: 1605, ward_id: 16, location: '50 Kirula Road, Colombo 05', bin_type: 'Organic', qr_code: 'BIN080', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 17 bins
  { bin_id: 81, resident_id: 1701, ward_id: 17, location: '28 Narahenpita Road, Colombo 05', bin_type: 'General', qr_code: 'BIN081', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 82, resident_id: 1702, ward_id: 17, location: '30 Narahenpita Road, Colombo 05', bin_type: 'Recyclable', qr_code: 'BIN082', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 83, resident_id: 1703, ward_id: 17, location: '32 Narahenpita Road, Colombo 05', bin_type: 'Organic', qr_code: 'BIN083', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 84, resident_id: 1704, ward_id: 17, location: '34 Narahenpita Road, Colombo 05', bin_type: 'General', qr_code: 'BIN084', status: 'Inactive', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 85, resident_id: 1705, ward_id: 17, location: '36 Narahenpita Road, Colombo 05', bin_type: 'Recyclable', qr_code: 'BIN085', status: 'Active', created_at: '2024-01-15T08:00:00Z' },

  // Ward 18 bins
  { bin_id: 86, resident_id: 1801, ward_id: 18, location: '55 Thimbirigasyaya Road, Colombo 05', bin_type: 'General', qr_code: 'BIN086', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 87, resident_id: 1802, ward_id: 18, location: '57 Thimbirigasyaya Road, Colombo 05', bin_type: 'Organic', qr_code: 'BIN087', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 88, resident_id: 1803, ward_id: 18, location: '59 Thimbirigasyaya Road, Colombo 05', bin_type: 'Recyclable', qr_code: 'BIN088', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 89, resident_id: 1804, ward_id: 18, location: '61 Thimbirigasyaya Road, Colombo 05', bin_type: 'General', qr_code: 'BIN089', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 90, resident_id: 1805, ward_id: 18, location: '63 Thimbirigasyaya Road, Colombo 05', bin_type: 'Organic', qr_code: 'BIN090', status: 'Missing', created_at: '2024-01-15T08:00:00Z' },

  // Ward 19 bins
  { bin_id: 91, resident_id: 1901, ward_id: 19, location: '18 Kotte Road, Colombo 05', bin_type: 'General', qr_code: 'BIN091', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 92, resident_id: 1902, ward_id: 19, location: '20 Kotte Road, Colombo 05', bin_type: 'Recyclable', qr_code: 'BIN092', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 93, resident_id: 1903, ward_id: 19, location: '22 Kotte Road, Colombo 05', bin_type: 'Organic', qr_code: 'BIN093', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 94, resident_id: 1904, ward_id: 19, location: '24 Kotte Road, Colombo 05', bin_type: 'General', qr_code: 'BIN094', status: 'Active', created_at: '2024-01-15T08:00:00Z' },
  { bin_id: 95, resident_id: 1905, ward_id: 19, location: '26 Kotte Road, Colombo 05', bin_type: 'Recyclable', qr_code: 'BIN095', status: 'Active', created_at: '2024-01-15T08:00:00Z' }
];

// Helper functions for bin operations
export const getBinByQrCode = (qrCode) => {
  return mockBins.find(bin => bin.qr_code === qrCode);
};

export const getBinsByWard = (wardId) => {
  return mockBins.filter(bin => bin.ward_id === wardId);
};

export const getBinsByStatus = (status) => {
  return mockBins.filter(bin => bin.status === status);
};

export const getBinsByType = (binType) => {
  return mockBins.filter(bin => bin.bin_type === binType);
};

export const getActiveBins = () => {
  return mockBins.filter(bin => bin.status === 'Active');
};

// Bin type colors for UI
export const BIN_TYPE_COLORS = {
  'General': 'bg-gray-100 text-gray-800',
  'Recyclable': 'bg-blue-100 text-blue-800',
  'Organic': 'bg-green-100 text-green-800'
};

// Bin status colors for UI
export const BIN_STATUS_COLORS = {
  'Active': 'bg-emerald-100 text-emerald-800',
  'Inactive': 'bg-gray-100 text-gray-800',
  'Missing': 'bg-red-100 text-red-800'
};
