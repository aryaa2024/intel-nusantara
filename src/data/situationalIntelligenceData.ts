import { SituationalReport, SituationalThreatLevel } from '../types';

export interface UnrasActionItem {
  w: string; // wilayah
  t: string; // jam
  l: string; // lokasi
  lat: number;
  lon: number;
  o: string; // organisasi
  p: string; // korlap
  m: number; // massa
  k: string; // kategori
  x: string; // eksposur korporasi 'Ya' | 'Tidak'
  d: string; // pokok tuntutan
  c: string; // klaster
}

export interface ParallelEventItem {
  nama: string;
  lokasi: string;
  massa: number;
  lat: number;
  lon: number;
  dampak: string;
}

export interface RouteData {
  label: string;
  teks: string;
  titik: { n: string; lat: number; lon: number }[];
  catatan: string;
}

export const RAW_UNRAS_DATA = {
  "aksi": [
    {
      "w": "Jakarta Pusat",
      "t": "15.00",
      "l": "Depan Taman Pandang, Silang Monas",
      "lat": -6.1818,
      "lon": 106.8243,
      "o": "Aksi Kamisan JSKK",
      "p": "Sumarsih",
      "m": 100,
      "k": "Pemerintah Pusat",
      "x": "Tidak",
      "d": "Penyelesaian kasus pelanggaran HAM berat masa lalu dan hapus impunitas",
      "c": "Kawasan Monas (Silang Selatan / Taman Pandang)"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Silang Selatan Monas / Seberang Gd. Danareksa",
      "lat": -6.1836,
      "lon": 106.8247,
      "o": "Forum Pemuda Indonesia Menggugat",
      "p": "Aldo Benu",
      "m": 25,
      "k": "Politik / Isu Nasional",
      "x": "Tidak",
      "d": "Mengecam dugaan manipulatif Deklarasi Sumpah Pemuda 2026 di Bundaran HI",
      "c": "Kawasan Monas (Silang Selatan / Taman Pandang)"
    },
    {
      "w": "Jakarta Pusat",
      "t": "15.00",
      "l": "Silang Selatan Monas / Seberang Gd. Danareksa",
      "lat": -6.1836,
      "lon": 106.8247,
      "o": "Forum Mahasiswa Pemuda Indonesia",
      "p": "Agung Gumelar",
      "m": 20,
      "k": "Politik / Isu Nasional",
      "x": "Tidak",
      "d": "Usut tuntas dugaan mobilisasi mahasiswa gadungan/bayaran Deklarasi Sumpah Pemuda 2026",
      "c": "Kawasan Monas (Silang Selatan / Taman Pandang)"
    },
    {
      "w": "Jakarta Pusat",
      "t": "09.00",
      "l": "Depan Balaikota DKI Jl. Merdeka Selatan & Kantor Disnakertrans-Energi DKI Jl. Prajurit KKO Usman Harun",
      "lat": -6.1818,
      "lon": 106.8272,
      "o": "DPW FSPMI DKI Jakarta",
      "p": "Rifqi Mubarok; Winarso",
      "m": 150,
      "k": "Pemda DKI / Ketenagakerjaan",
      "x": "Tidak",
      "d": "Tetapkan UMP 2027 100% KHL; rumus Inflasi + Pertumbuhan Ekonomi x Alpha 0,9; UMSP 2027 5% di atas UMP 2027",
      "c": "Balaikota DKI / Merdeka Selatan"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Depan Balaikota DKI",
      "lat": -6.1818,
      "lon": 106.8272,
      "o": "Front Rakyat Menggugat",
      "p": "Muhaimin Jarkasih",
      "m": 20,
      "k": "Pemda DKI / Ketenagakerjaan",
      "x": "Tidak",
      "d": "Usut tuntas dugaan kelebihan pembayaran proyek embung Bambu Hitam Kec. Cipayung",
      "c": "Balaikota DKI / Merdeka Selatan"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Depan Balaikota DKI",
      "lat": -6.1818,
      "lon": 106.8272,
      "o": "Forum Pemuda Jakarta Utara",
      "p": "Ahmad Faris Ainul Yaqin",
      "m": 20,
      "k": "Pemda DKI / Ketenagakerjaan",
      "x": "Tidak",
      "d": "Evaluasi penertiban bangunan liar Kampung Bahari",
      "c": "Balaikota DKI / Merdeka Selatan"
    },
    {
      "w": "Jakarta Pusat",
      "t": "09.00",
      "l": "Kantor Pusat Bank Jakarta Jl. Suryopranoto",
      "lat": -6.1746,
      "lon": 106.8155,
      "o": "Forum Pemuda dan Mahasiswa Indonesia",
      "p": "Dimas Ramadhan",
      "m": 15,
      "k": "Korporasi / BUMD",
      "x": "Ya",
      "d": "Usut tuntas dugaan korupsi Bank DKI Jakarta",
      "c": "Bank Jakarta (Bank DKI) Jl. Suryopranoto"
    },
    {
      "w": "Jakarta Pusat",
      "t": "11.00",
      "l": "Kantor Pusat Bank Jakarta",
      "lat": -6.1746,
      "lon": 106.8155,
      "o": "Gerakan Mahasiswa untuk Rakyat",
      "p": "Albinus Anwar Judat",
      "m": 15,
      "k": "Korporasi / BUMD",
      "x": "Ya",
      "d": "Usut tuntas temuan BPK terkait tata kelola dan kredit PT. Bank Jakarta",
      "c": "Bank Jakarta (Bank DKI) Jl. Suryopranoto"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Depan BPK RI Jl. Gatot Subroto",
      "lat": -6.2277,
      "lon": 106.8107,
      "o": "Koalisi Masyarakat Pemerhati Hukum Indonesia",
      "p": "Amri Loklomin",
      "m": 30,
      "k": "Pemerintah Pusat",
      "x": "Tidak",
      "d": "Periksa Bobby Adhtiyo Rizaldi anggota V BPK RI kasus suap Bupati Muara Enim Edison",
      "c": "Depan BPK RI Jl. Gatot Subroto"
    },
    {
      "w": "Jakarta Pusat",
      "t": "14.00",
      "l": "Kantor PT. Higood Live Jakarta Jl. Musi No.41 Cideng",
      "lat": -6.1733,
      "lon": 106.8125,
      "o": "DPP Persaudaraan Aceh Seranto",
      "p": "Akhyar Kamil",
      "m": 50,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Klarifikasi penganiayaan terhadap Nasriah 11 Agustus 2026 di PT. Higood Live",
      "c": "Kantor PT. Higood Live Jakarta Jl. Musi No.41 Cideng"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Depan Kemen PKP RI / Wisma Mandiri Jl. M.H Thamrin",
      "lat": -6.1852,
      "lon": 106.8232,
      "o": "DPP Garansi dan AMPPUH",
      "p": "Novrizal Taufan Nur",
      "m": 40,
      "k": "Pemerintah Pusat",
      "x": "Tidak",
      "d": "Usut tuntas dugaan korupsi Rumah Khusus Eks Pejuang Timor Timur Kab. Kupang NTT",
      "c": "Kemen PKP / Wisma Mandiri Thamrin"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Kantor DPP Hanura Jl. Proklamasi & Kantor PT. Sarana Jaya Jl. Budi Kemuliaan",
      "lat": -6.1932,
      "lon": 106.8403,
      "o": "Jaringan Mahasiswa Hukum Indonesia",
      "p": "Yadi Abas Hanubun",
      "m": 15,
      "k": "Politik / Isu Nasional",
      "x": "Tidak",
      "d": "Tolak pengangkatan Danindro Arionindita sebagai Dewan Pengawas Sarana Jaya",
      "c": "PT Sarana Jaya / DPP Hanura"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Depan Kemen PKP RI / Wisma Mandiri Jl. M.H Thamrin",
      "lat": -6.1852,
      "lon": 106.8232,
      "o": "Gerakan Mahasiswa Bogor",
      "p": "Daiamto Mony",
      "m": 15,
      "k": "Pemerintah Pusat",
      "x": "Tidak",
      "d": "Usut tuntas dugaan KKN pejabat Kemen PKP di daerah",
      "c": "Kemen PKP / Wisma Mandiri Thamrin"
    },
    {
      "w": "Jakarta Pusat",
      "t": "11.00",
      "l": "Kantor PT. Sarana Jaya Jl. Budi Kemuliaan",
      "lat": -6.1794,
      "lon": 106.8183,
      "o": "Serikat Mahasiswa Peduli Bangsa",
      "p": "Prayoga Rudiyanto",
      "m": 15,
      "k": "Korporasi / BUMD",
      "x": "Ya",
      "d": "Tolak pengangkatan Danindro Arionindita sebagai Dewan Pengawas Sarana Jaya",
      "c": "PT Sarana Jaya / DPP Hanura"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Kantor PT. Halmahera Sukses Mineral Jl. Batu Ceper & Depan Kemen ESDM RI",
      "lat": -6.1655,
      "lon": 106.816,
      "o": "Komite Aksi Mahasiswa Rakyat Maluku",
      "p": "Falen Rifaldo Guhuhuk",
      "m": 15,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Mendesak PT. Halmahera Sukses Mineral selesaikan ganti rugi lahan masyarakat",
      "c": "Kemen ESDM RI"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Kantor PT. Adhita Nickel Indonesia / Graha Hanurata Jl. Kebon Sirih & Depan Kemen ESDM RI",
      "lat": -6.183,
      "lon": 106.83,
      "o": "Barisan Anak Timur Universitas Bung Karno",
      "p": "Guntur Boinauw",
      "m": 20,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Mendesak PT. Adhita Nickel sampaikan laporan tindak lanjut pembinaan dan pengawasan tambang di Halmahera Timur",
      "c": "Kemen ESDM RI"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Kantor PT. Anugerah Bangun Makmur / Wisma 46 BNI Jl. Jend. Sudirman & Depan Kemen ESDM RI",
      "lat": -6.2088,
      "lon": 106.816,
      "o": "Asosiasi Mahasiswa Indonesia",
      "p": "Umar Souwakil",
      "m": 20,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Evaluasi perizinan dan kepatuhan operasional PT. Anugerah Bangun Makmur atas dugaan pelanggaran lingkungan",
      "c": "Kemen ESDM RI"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Depan Kemen ESDM RI Jl. Kebon Sirih",
      "lat": -6.1842,
      "lon": 106.827,
      "o": "Solidaritas Mahasiswa Untuk Keadilan",
      "p": "Selsius Pulotenga",
      "m": 25,
      "k": "Pemerintah Pusat",
      "x": "Tidak",
      "d": "Tindak tegas PT. Weda Bay Nickel, PT. Halmahera Sukses Mineral, PT. Trimegah Bangun Persada & PT. Karya Wijaya",
      "c": "Kemen ESDM RI"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Depan Kemen ESDM RI",
      "lat": -6.1842,
      "lon": 106.827,
      "o": "Jaringan Mahasiswa dan Pemuda Anti Tambang Ilegal",
      "p": "Hasan Souwakil",
      "m": 25,
      "k": "Pemerintah Pusat",
      "x": "Tidak",
      "d": "Periksa Direksi Ditjen Minerba atas dugaan manipulasi dokumen ekspor dan pengapalan batubara ilegal PT. Asmin Koalindo Tuhup",
      "c": "Kemen ESDM RI"
    },
    {
      "w": "Jakarta Pusat",
      "t": "11.00",
      "l": "Depan Kemen Kelautan & Perikanan RI Jl. Merdeka Timur",
      "lat": -6.178,
      "lon": 106.832,
      "o": "Forum Peduli Nelayan Nusantara",
      "p": "Hironimus Salesman",
      "m": 25,
      "k": "Pemerintah Pusat",
      "x": "Tidak",
      "d": "Usut tuntas dugaan korupsi program KNMP di KKP RI",
      "c": "Depan Kemen Kelautan"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Kantor PT. Dian Swastatika Sentosa / Sinarmas Land Plaza Jl. M.H Thamrin",
      "lat": -6.19,
      "lon": 106.823,
      "o": "Aliansi Mahasiswa Pemuda Indonesia",
      "p": "Ismail Souwakil",
      "m": 15,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Usut tuntas dugaan pelanggaran pasar modal PT. Dian Swastatika",
      "c": "Kantor PT. Dian Swastatika Sentosa / Sinarmas Land Plaza J"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Kantor PT. Indo Partners Plantation Service Jl. KH. Mas Mansyur",
      "lat": -6.2008,
      "lon": 106.812,
      "o": "Gerakan Mahasiswa Anti Korupsi Indonesia",
      "p": "Saputra",
      "m": 20,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Usut tuntas dugaan korupsi pricing PT. Indo Partners Plantation Service",
      "c": "Kantor PT. Indo Partners Plantation Service Jl. KH. Mas Ma"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Kantor Pusat Bank BRI Jl. Jend. Sudirman",
      "lat": -6.224,
      "lon": 106.812,
      "o": "Jaringan Aktivis Demokrasi",
      "p": "Ahmad Soadikin",
      "m": 15,
      "k": "Korporasi / BUMN",
      "x": "Ya",
      "d": "Usut tuntas dugaan penyimpangan fasilitas kredit PT. Sebaung Sawit Plantations",
      "c": "Kantor Pusat Bank BRI Jl. Jend. Sudirman"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Kantor DPP Hanura Jl. Proklamasi & Kantor PT. Sarana Jaya Jl. Budi Kemuliaan",
      "lat": -6.1932,
      "lon": 106.8403,
      "o": "Aliansi Mahasiswa Peduli Keadilan",
      "p": "M. Ifrod Maulana",
      "m": 20,
      "k": "Politik / Isu Nasional",
      "x": "Tidak",
      "d": "Tolak pengangkatan Dewan Pengawas Sarana Jaya",
      "c": "PT Sarana Jaya / DPP Hanura"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Kantor PT. Timah Jl. Merdeka Timur",
      "lat": -6.1766,
      "lon": 106.833,
      "o": "Asosiasi Pemuda Nusantara",
      "p": "Asep Saepuloh Hamzah",
      "m": 15,
      "k": "Korporasi / BUMN",
      "x": "Ya",
      "d": "Usut tuntas dugaan aliran dana suap mutasi, rotasi dan pengisian jabatan di PT. Timah",
      "c": "Kantor PT. Timah Jl. Merdeka Timur"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Kantor PT. Pelni Jl. Gajah Mada",
      "lat": -6.1625,
      "lon": 106.816,
      "o": "Asosiasi Mahasiswa Hukum Indonesia",
      "p": "Sutrisno Sidabutar",
      "m": 20,
      "k": "Korporasi / BUMN",
      "x": "Ya",
      "d": "Mengecam lambannya penuntasan skandal korupsi komisi fiktif asuransi perkapalan PT. Pelni oleh PT. Jasindo 2015-2020",
      "c": "Kantor PT. Pelni Jl. Gajah Mada"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Depan Kemendagri RI Jl. Merdeka Utara",
      "lat": -6.1755,
      "lon": 106.8275,
      "o": "Gerakan Mahasiswa Riau Jakarta",
      "p": "Khaidir Rahman",
      "m": 20,
      "k": "Pemerintah Pusat",
      "x": "Tidak",
      "d": "Periksa Bupati Rokan Hilir atas dugaan korupsi rehabilitasi pendidikan Rp73 Miliar",
      "c": "Depan Kemendagri RI Jl. Merdeka Utara"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Kantor PT. Inacash / Atria Sudirman Jl. Jend. Sudirman",
      "lat": -6.213,
      "lon": 106.817,
      "o": "Aliansi Mahasiswa Indonesia Bersatu",
      "p": "Sardi Loilatu",
      "m": 15,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Periksa PT. Inacash atas dugaan memfasilitasi judi online",
      "c": "Kantor PT. Inacash / Atria Sudirman Jl. Jend. Sudirman"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.00",
      "l": "Kantor PT. Anugerah Bangun Makmur / Wisma 46 Jl. Jend. Sudirman",
      "lat": -6.2088,
      "lon": 106.816,
      "o": "Koalisi Mahasiswa Sulteng Menggugat",
      "p": "M. Jufri Rumaratu",
      "m": 20,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Cabut IUP PT. Anugerah Bangun Makmur atas dugaan kriminalisasi warga Desa Siuna dan evaluasi PT. Anugerah Sumber Bumi",
      "c": "Wisma 46 BNI Sudirman"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Kantor PT. Alam Raya Abadi / Menara Batavia Jl. KH. Mas Mansyur",
      "lat": -6.2015,
      "lon": 106.8105,
      "o": "Persatuan Gerakan Aktivis Muda Indonesia",
      "p": "Asvin A",
      "m": 20,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Evaluasi IUP PT. Alam Raya Abadi dan selesaikan program PPM di Wasile",
      "c": "Kantor PT. Alam Raya Abadi / Menara Batavia Jl. KH. Mas Ma"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Kantor PT. Pertamina Jl. Merdeka Timur",
      "lat": -6.1775,
      "lon": 106.8318,
      "o": "Konsorsium Kajian Pemuda Indonesia",
      "p": "Akbar Rasyid",
      "m": 20,
      "k": "Korporasi / BUMN",
      "x": "Ya",
      "d": "Mendesak Pertamina atasi kelangkaan BBM di Bali",
      "c": "Kantor PT. Pertamina Jl. Merdeka Timur"
    },
    {
      "w": "Jakarta Pusat",
      "t": "13.00",
      "l": "Kantor PT. Kredivo Finance Indonesia / Dipo Tower Jl. Gatot Subroto & Depan OJK RI Jl. Lap. Banteng Timur",
      "lat": -6.2032,
      "lon": 106.8085,
      "o": "Gerakan Mahasiswa Hukum Indonesia",
      "p": "Agung Prayuda",
      "m": 20,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Usut tuntas dugaan pelecehan seksual dan pemaksaan oleh oknum Debt Collector PT. Kredivo",
      "c": "Kantor PT. Kredivo Finance Indonesia / Dipo Tower Jl. Gato"
    },
    {
      "w": "Jakarta Pusat",
      "t": "10.30",
      "l": "Pengadilan Negeri Jakpus Jl. Bungur Besar Raya No.24-26 Kemayoran",
      "lat": -6.169,
      "lon": 106.849,
      "o": "Simpatisan Silmy Karim",
      "p": "Sahril Turam",
      "m": 250,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Diduga KPK kriminalisasi hukum; Hakim Tipikor harus bebaskan Silmy Karim",
      "c": "PN Jakarta Pusat (Kemayoran)"
    },
    {
      "w": "Jakarta Selatan",
      "t": "06.00",
      "l": "Depan Kedubes RRT Jl. Mega Kuningan",
      "lat": -6.227,
      "lon": 106.827,
      "o": "Friends Of Falun Gong",
      "p": "Zaenal Abidin",
      "m": 10,
      "k": "Diplomatik",
      "x": "Tidak",
      "d": "Usut tuntas kekerasan terhadap praktisi Falun Gong oleh PKT di Tiongkok",
      "c": "Depan Kedubes RRT Jl. Mega Kuningan"
    },
    {
      "w": "Jakarta Selatan",
      "t": "10.00",
      "l": "Kantor PT. Kristalin Eka Lestari Jl. TB. Simatupang",
      "lat": -6.293,
      "lon": 106.81,
      "o": "Aliansi Mahasiswa Anti Mafia Tambang",
      "p": "Tauhid Gusti Raharusun",
      "m": 20,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Periksa Direksi PT. Kristalin Eka Lestari atas dugaan tambang dan penggunaan kawasan hutan",
      "c": "Koridor TB Simatupang"
    },
    {
      "w": "Jakarta Selatan",
      "t": "10.00",
      "l": "Depan Baharkam Polri Jl. Trunojoyo & Depan Polda Metro Jaya",
      "lat": -6.244,
      "lon": 106.8,
      "o": "Dewan Mahasiswa Reformasi dan Demokrasi",
      "p": "Yandra Kurniawan",
      "m": 20,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Mengecam dugaan manipulatif Deklarasi Sumpah Pemuda 2026",
      "c": "Polda Metro Jaya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "10.00",
      "l": "Depan Baharkam Polri",
      "lat": -6.244,
      "lon": 106.8,
      "o": "Jaringan Aktivis Muda Indonesia",
      "p": "La Ode Yasir Mukadir",
      "m": 20,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Evaluasi Kasat Reskrim Polres Kolaka Timur atas dugaan Galian C tanpa izin",
      "c": "Baharkam Polri (Jl. Trunojoyo)"
    },
    {
      "w": "Jakarta Selatan",
      "t": "11.00",
      "l": "Depan Polda Metro Jaya",
      "lat": -6.2242,
      "lon": 106.8095,
      "o": "Forum Barisan Mahasiswa Indonesia Bersuara Keadilan",
      "p": "Ahmad Souwakil",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Mengecam dugaan manipulatif Deklarasi Sumpah Pemuda 2026",
      "c": "Polda Metro Jaya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Kantor PT. Ceria Nugraha Indotama / South Quarter Tower Jl. R.A. Kartini",
      "lat": -6.289,
      "lon": 106.793,
      "o": "Gerakan Indonesia Sejahtera",
      "p": "Awaludin Bahta",
      "m": 15,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Usut tuntas dugaan korupsi, evaluasi izin tambang dan tata kelola nikel PT. Ceria Nugraha Indotama",
      "c": "Kantor PT. Ceria Nugraha Indotama / South Quarter Tower Jl"
    },
    {
      "w": "Jakarta Selatan",
      "t": "11.00",
      "l": "Kantor PT. Nusa Satu Inti Artha Jl. Jend. Sudirman",
      "lat": -6.227,
      "lon": 106.809,
      "o": "Jaringan Aktivis Aksi Indonesia",
      "p": "Talib Loilatu",
      "m": 20,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Periksa PT. Nusa Satu Inti Artha atas dugaan memfasilitasi judi online",
      "c": "Kantor PT. Nusa Satu Inti Artha Jl. Jend. Sudirman"
    },
    {
      "w": "Jakarta Selatan",
      "t": "10.00",
      "l": "Kantor PT. Stargate Pacific Resources / Equity Tower SCBD Jl. Jend. Sudirman",
      "lat": -6.2265,
      "lon": 106.809,
      "o": "Konsorsium Mahasiswa dan Pemuda Indonesia",
      "p": "Irwan",
      "m": 15,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Usut tuntas dugaan pencemaran lingkungan PT. Stargate Pacific Resources",
      "c": "Kantor PT. Stargate Pacific Resources / Equity Tower SCBD "
    },
    {
      "w": "Jakarta Selatan",
      "t": "11.00",
      "l": "Depan Baharkam Polri",
      "lat": -6.244,
      "lon": 106.8,
      "o": "Koalisi Aktivis Mahasiswa Indonesia",
      "p": "Usman Ohoiwuy",
      "m": 25,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Menyikapi peristiwa di Ponpes Hamalatul Qur'an Mojolaban Sukoharjo",
      "c": "Baharkam Polri (Jl. Trunojoyo)"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Depan Wisma Danantara Jl. Gatot Subroto",
      "lat": -6.23,
      "lon": 106.812,
      "o": "Pusat Pergerakan Mahasiswa Jakarta",
      "p": "Mubarak Tuasamu",
      "m": 15,
      "k": "Pemerintah Pusat",
      "x": "Tidak",
      "d": "Evaluasi investasi Kepala Danantara Pandu Shahrir di PT. Supra Sekuritas Indonesia",
      "c": "Depan Wisma Danantara Jl. Gatot Subroto"
    },
    {
      "w": "Jakarta Selatan",
      "t": "11.00",
      "l": "Kantor PT. Pertamina EP / RDTX Square Jl. Prof. Dr. Satrio & Depan Kejagung RI",
      "lat": -6.225,
      "lon": 106.825,
      "o": "Asosiasi Mahasiswa Indonesia",
      "p": "Alfin Rifaldi",
      "m": 20,
      "k": "Korporasi / BUMN",
      "x": "Ya",
      "d": "Usut tuntas dugaan korupsi tata kelola migas Kota Bekasi via KSO PT. Migas Kota Bekasi dengan PT. Pertamina EP",
      "c": "Kejagung RI"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Depan Baharkam Polri & Depan Polda Metro Jaya",
      "lat": -6.244,
      "lon": 106.8,
      "o": "Aliansi Aktivis Mahasiswa Jakarta",
      "p": "Saifur Rohman",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Usut tuntas dugaan mobilisasi mahasiswa gadungan/bayaran Deklarasi Sumpah Pemuda 2026",
      "c": "Polda Metro Jaya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "09.00",
      "l": "Depan Baharkam Polri",
      "lat": -6.244,
      "lon": 106.8,
      "o": "Aliansi Masyarakat Keadilan Indonesia",
      "p": "Fadlan Zainuddin Siregar",
      "m": 30,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Periksa dan evaluasi Kapolres Serdang Bedagai diduga membekingi judi togel",
      "c": "Baharkam Polri (Jl. Trunojoyo)"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Depan Polda Metro Jaya",
      "lat": -6.2242,
      "lon": 106.8095,
      "o": "Koordinator Aliansi Mahasiswa dan Pemuda Sumatera",
      "p": "Rian Febriansyah",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Usut tuntas dugaan mobilisasi mahasiswa gadungan/bayaran Deklarasi Sumpah Pemuda 2026",
      "c": "Polda Metro Jaya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Depan Polda Metro Jaya",
      "lat": -6.2242,
      "lon": 106.8095,
      "o": "Koalisi Pemuda Republik Indonesia",
      "p": "Faldy Ahmad",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Usut tuntas dugaan mobilisasi mahasiswa gadungan/bayaran Deklarasi Sumpah Pemuda 2026",
      "c": "Polda Metro Jaya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "10.00",
      "l": "Depan Polda Metro Jaya",
      "lat": -6.2242,
      "lon": 106.8095,
      "o": "Gerakan Oposisi Nasional Indonesia",
      "p": "Akbar",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Usut tuntas dugaan mobilisasi mahasiswa gadungan/bayaran Deklarasi Sumpah Pemuda 2026",
      "c": "Polda Metro Jaya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Depan Polda Metro Jaya",
      "lat": -6.2242,
      "lon": 106.8095,
      "o": "Gerakan Mahasiswa Pengawal Aspirasi Rakyat",
      "p": "Wisnu Saputra",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Usut tuntas dugaan mobilisasi mahasiswa gadungan/bayaran Deklarasi Sumpah Pemuda 2026",
      "c": "Polda Metro Jaya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "09.30",
      "l": "Kantor Ditjen Minerba Jl. Prof. Dr. Soepomo",
      "lat": -6.242,
      "lon": 106.842,
      "o": "KNPI Kab. Konawe Utara",
      "p": "Akbar Rasyid",
      "m": 40,
      "k": "Pemerintah Pusat",
      "x": "Tidak",
      "d": "Mendesak Ditjen Minerba cabut IUP PT. Geomineral Inti Perkasa",
      "c": "Ditjen Minerba (Jl. Soepomo)"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Depan Baharkam Polri",
      "lat": -6.244,
      "lon": 106.8,
      "o": "Koalisi Pemerhati Hukum Sultra",
      "p": "Abdi Aditya",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Periksa Kapolsek Lalonggasumeeto atas dugaan jual beli narkotika dan penimbunan BBM ilegal",
      "c": "Baharkam Polri (Jl. Trunojoyo)"
    },
    {
      "w": "Jakarta Selatan",
      "t": "09.00",
      "l": "Depan Baharkam Polri",
      "lat": -6.244,
      "lon": 106.8,
      "o": "Persatuan Koalisi Sipil Indonesia",
      "p": "M. Rizki",
      "m": 25,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Menyikapi peristiwa di Ponpes Hamalatul Qur'an Mojolaban Sukoharjo",
      "c": "Baharkam Polri (Jl. Trunojoyo)"
    },
    {
      "w": "Jakarta Selatan",
      "t": "10.00",
      "l": "Depan Polda Metro Jaya",
      "lat": -6.2242,
      "lon": 106.8095,
      "o": "Aliansi Mahasiswa Se-DKI Jakarta",
      "p": "Ahmad Ghazy Abulkhair",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Usut tuntas dugaan mobilisasi mahasiswa gadungan/bayaran Deklarasi Sumpah Pemuda 2026",
      "c": "Polda Metro Jaya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Depan Polda Metro Jaya",
      "lat": -6.2242,
      "lon": 106.8095,
      "o": "Masyarakat untuk Demokrasi Indonesia",
      "p": "M. Zulfikli",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Usut tuntas dugaan mobilisasi mahasiswa gadungan/bayaran Deklarasi Sumpah Pemuda 2026",
      "c": "Polda Metro Jaya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Depan Polda Metro Jaya",
      "lat": -6.2242,
      "lon": 106.8095,
      "o": "Gerakan Mahasiswa dan Pemuda",
      "p": "Syahrul Romadon Rambe",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Mengecam dugaan manipulatif Deklarasi Sumpah Pemuda 2026",
      "c": "Polda Metro Jaya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "11.00",
      "l": "Depan Baharkam Polri",
      "lat": -6.244,
      "lon": 106.8,
      "o": "Forum Mahasiswa Zilenial Sadar Hukum Nusantara",
      "p": "Selvin Nazara",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Usut tuntas dugaan Paylabs memfasilitasi judi online",
      "c": "Baharkam Polri (Jl. Trunojoyo)"
    },
    {
      "w": "Jakarta Selatan",
      "t": "12.00",
      "l": "Kantor PT. Pertamina Hulu Energi Jl. TB. Simatupang",
      "lat": -6.293,
      "lon": 106.818,
      "o": "Lembaga Kajian dan Peduli Hukum Indonesia DKI Jakarta",
      "p": "Sandy Rahangmetan",
      "m": 15,
      "k": "Korporasi / BUMN",
      "x": "Ya",
      "d": "Usut tuntas dugaan temuan BPK pada PT. Pertamina Hulu Energi dan PT. Pertamina",
      "c": "Koridor TB Simatupang"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Depan Kejagung RI Jl. Sultan Hasanudin",
      "lat": -6.234,
      "lon": 106.802,
      "o": "Lembaga Pengawasan Pertambangan Nasional",
      "p": "Brian Putra",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Usut tuntas dugaan penyimpangan ekspor nikel PT. Ifishdeco",
      "c": "Kejagung RI"
    },
    {
      "w": "Jakarta Selatan",
      "t": "11.00",
      "l": "Depan Baharkam Polri",
      "lat": -6.244,
      "lon": 106.8,
      "o": "Jaringan Advokasi Mahasiswa Indonesia",
      "p": "Fadli",
      "m": 30,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Menyikapi peristiwa di Ponpes Hamalatul Qur'an Mojolaban Sukoharjo",
      "c": "Baharkam Polri (Jl. Trunojoyo)"
    },
    {
      "w": "Jakarta Selatan",
      "t": "12.00",
      "l": "Depan KPK RI Jl. Kuningan Persada",
      "lat": -6.2385,
      "lon": 106.83,
      "o": "Lembaga Kajian dan Peduli Hukum Indonesia DKI Jakarta",
      "p": "Alif Hadi Pratama",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Usut tuntas dugaan korupsi cukai PT. Djarum yang melibatkan oknum Bea Cukai",
      "c": "KPK RI"
    },
    {
      "w": "Jakarta Selatan",
      "t": "Tidak dicantumkan",
      "l": "Depan Polda Metro Jaya",
      "lat": -6.2242,
      "lon": 106.8095,
      "o": "Lembaga Kajian dan Peduli Hukum Indonesia DKI Jakarta",
      "p": "M. Tahtawi Letsoin",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Usut tuntas dugaan pungli Samsat Jakarta Timur",
      "c": "Polda Metro Jaya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Kantor PT. Adhita Nikel Indonesia / Gedung Granadi Jl. HR. Rasuna Said",
      "lat": -6.224,
      "lon": 106.831,
      "o": "Front Mahasiswa dan Aktivis Menggugat",
      "p": "Rivai Sabon Mehen",
      "m": 30,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Usut tuntas dugaan pencemaran dan kerusakan lingkungan PT. Adhita Nikel Indonesia",
      "c": "Kantor PT. Adhita Nikel Indonesia / Gedung Granadi Jl. HR."
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Depan Bmart Kemang Jl. Kemang Raya",
      "lat": -6.261,
      "lon": 106.813,
      "o": "Solidaritas Mahasiswa Islam Indonesia",
      "p": "Riswan Wadi",
      "m": 20,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Cabut izin operasional Bmart Kemang",
      "c": "Depan Bmart Kemang Jl. Kemang Raya"
    },
    {
      "w": "Jakarta Selatan",
      "t": "13.00",
      "l": "Depan KPK RI",
      "lat": -6.2385,
      "lon": 106.83,
      "o": "Koalisi Mahasiswa Indonesia Raya",
      "p": "Ach. Fauzi",
      "m": 15,
      "k": "Yudikatif / Penegak Hukum",
      "x": "Tidak",
      "d": "Mendesak Gus Yahya klarifikasi dugaan suap dan aliran dana polemik Muktamar NU ke-35",
      "c": "KPK RI"
    },
    {
      "w": "Jakarta Utara",
      "t": "08.00",
      "l": "PT Borwita Citra Prima Jl. Pegangsaan Dua Raya No.2, Kel. Pegangsaan Dua, Kec. Kelapa Gading",
      "lat": -6.154,
      "lon": 106.91,
      "o": "Pimpinan Cabang SPAI FSPMI DKI Jakarta",
      "p": "Supriyadi (Pn Jawab)",
      "m": 200,
      "k": "Korporasi / Swasta",
      "x": "Ya",
      "d": "Bayarkan potongan upah (± Rp32.000.000); angkat pekerja PKWT menjadi PKWTT; sediakan alat kerja; hapus outsourcing pada bisnis inti",
      "c": "PT Borwita Citra Prima (Kelapa Gading)"
    },
    {
      "w": "Jakarta Utara",
      "t": "07.00",
      "l": "Titik kumpul: Sekretariat PUK SPAI-FSPMI PT. Indomarco Prismatama Jl. Ancol Barat VI, Kel. Ancol — bergerak ke Balaikota DKI",
      "lat": -6.12,
      "lon": 106.829,
      "o": "SPAI-FSPMI PT. Indomarco Prismatama",
      "p": "Kakang (Korlap)",
      "m": 30,
      "k": "Pemda DKI / Ketenagakerjaan",
      "x": "Tidak",
      "d": "Tetapkan UMP 2027 100% KHL; rumus Inflasi UMP + Pertumbuhan Ekonomi x Alpha 0,9; UMSP 2027 5% di atas UMP 2027",
      "c": "Balaikota DKI / Merdeka Selatan"
    },
    {
      "w": "Jakarta Utara",
      "t": "13.00",
      "l": "Kantor Walikota Jakarta Utara Jl. Yos Sudarso RW.5, Kel. Kebon Bawang, Kec. Tanjung Priok",
      "lat": -6.123,
      "lon": 106.881,
      "o": "Forum Pemuda Jakarta Utara",
      "p": "Ahmad Faris Ainul Yaqin (Korlap)",
      "m": 20,
      "k": "Pemda DKI / Ketenagakerjaan",
      "x": "Tidak",
      "d": "Mendesak Gubernur DKI dan Walikota Jakut mengevaluasi penertiban bangunan liar di kawasan Kampung Bahari",
      "c": "Kantor Walikota Jakut"
    }
  ],
  "klaster": [
    {
      "n": "PN Jakarta Pusat (Kemayoran)",
      "a": 1,
      "m": 250,
      "lat": -6.169,
      "lon": 106.849,
      "w": "Jakarta Pusat",
      "tg": "TINGGI"
    },
    {
      "n": "Balaikota DKI / Merdeka Selatan",
      "a": 4,
      "m": 220,
      "lat": -6.12,
      "lon": 106.829,
      "w": "Jakarta Pusat; Jakarta Utara",
      "tg": "TINGGI"
    },
    {
      "n": "PT Borwita Citra Prima (Kelapa Gading)",
      "a": 1,
      "m": 200,
      "lat": -6.154,
      "lon": 106.91,
      "w": "Jakarta Utara",
      "tg": "TINGGI"
    },
    {
      "n": "Polda Metro Jaya",
      "a": 11,
      "m": 170,
      "lat": -6.2242,
      "lon": 106.8095,
      "w": "Jakarta Selatan",
      "tg": "TINGGI"
    },
    {
      "n": "Baharkam Polri (Jl. Trunojoyo)",
      "a": 7,
      "m": 160,
      "lat": -6.244,
      "lon": 106.8,
      "w": "Jakarta Selatan",
      "tg": "SEDANG"
    },
    {
      "n": "Kawasan Monas (Silang Selatan / Taman Pandang)",
      "a": 3,
      "m": 145,
      "lat": -6.1836,
      "lon": 106.8247,
      "w": "Jakarta Pusat",
      "tg": "SEDANG"
    },
    {
      "n": "Kemen ESDM RI",
      "a": 5,
      "m": 105,
      "lat": -6.1842,
      "lon": 106.827,
      "w": "Jakarta Pusat",
      "tg": "SEDANG"
    },
    {
      "n": "Kemen PKP / Wisma Mandiri Thamrin",
      "a": 2,
      "m": 55,
      "lat": -6.1852,
      "lon": 106.8232,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "PT Sarana Jaya / DPP Hanura",
      "a": 3,
      "m": 50,
      "lat": -6.1932,
      "lon": 106.8403,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Higood Live Jakarta Jl. Musi No.41 Cideng",
      "a": 1,
      "m": 50,
      "lat": -6.1733,
      "lon": 106.8125,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Ditjen Minerba (Jl. Soepomo)",
      "a": 1,
      "m": 40,
      "lat": -6.242,
      "lon": 106.842,
      "w": "Jakarta Selatan",
      "tg": "RENDAH"
    },
    {
      "n": "Koridor TB Simatupang",
      "a": 2,
      "m": 35,
      "lat": -6.293,
      "lon": 106.818,
      "w": "Jakarta Selatan",
      "tg": "RENDAH"
    },
    {
      "n": "Kejagung RI",
      "a": 2,
      "m": 35,
      "lat": -6.234,
      "lon": 106.802,
      "w": "Jakarta Selatan",
      "tg": "RENDAH"
    },
    {
      "n": "Bank Jakarta (Bank DKI) Jl. Suryopranoto",
      "a": 2,
      "m": 30,
      "lat": -6.1746,
      "lon": 106.8155,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "KPK RI",
      "a": 2,
      "m": 30,
      "lat": -6.2385,
      "lon": 106.83,
      "w": "Jakarta Selatan",
      "tg": "RENDAH"
    },
    {
      "n": "Depan BPK RI Jl. Gatot Subroto",
      "a": 1,
      "m": 30,
      "lat": -6.2277,
      "lon": 106.8107,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Adhita Nikel Indonesia / Gedung Granadi Jl. HR.",
      "a": 1,
      "m": 30,
      "lat": -6.224,
      "lon": 106.831,
      "w": "Jakarta Selatan",
      "tg": "RENDAH"
    },
    {
      "n": "Depan Kemen Kelautan",
      "a": 1,
      "m": 25,
      "lat": -6.178,
      "lon": 106.832,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Indo Partners Plantation Service Jl. KH. Mas Ma",
      "a": 1,
      "m": 20,
      "lat": -6.2008,
      "lon": 106.812,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Pelni Jl. Gajah Mada",
      "a": 1,
      "m": 20,
      "lat": -6.1625,
      "lon": 106.816,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Depan Kemendagri RI Jl. Merdeka Utara",
      "a": 1,
      "m": 20,
      "lat": -6.1755,
      "lon": 106.8275,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Wisma 46 BNI Sudirman",
      "a": 1,
      "m": 20,
      "lat": -6.2088,
      "lon": 106.816,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Alam Raya Abadi / Menara Batavia Jl. KH. Mas Ma",
      "a": 1,
      "m": 20,
      "lat": -6.2015,
      "lon": 106.8105,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Pertamina Jl. Merdeka Timur",
      "a": 1,
      "m": 20,
      "lat": -6.1775,
      "lon": 106.8318,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Kredivo Finance Indonesia / Dipo Tower Jl. Gato",
      "a": 1,
      "m": 20,
      "lat": -6.2032,
      "lon": 106.8085,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Nusa Satu Inti Artha Jl. Jend. Sudirman",
      "a": 1,
      "m": 20,
      "lat": -6.227,
      "lon": 106.809,
      "w": "Jakarta Selatan",
      "tg": "RENDAH"
    },
    {
      "n": "Depan Bmart Kemang Jl. Kemang Raya",
      "a": 1,
      "m": 20,
      "lat": -6.261,
      "lon": 106.813,
      "w": "Jakarta Selatan",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor Walikota Jakut",
      "a": 1,
      "m": 20,
      "lat": -6.123,
      "lon": 106.881,
      "w": "Jakarta Utara",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Dian Swastatika Sentosa / Sinarmas Land Plaza J",
      "a": 1,
      "m": 15,
      "lat": -6.19,
      "lon": 106.823,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor Pusat Bank BRI Jl. Jend. Sudirman",
      "a": 1,
      "m": 15,
      "lat": -6.224,
      "lon": 106.812,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Timah Jl. Merdeka Timur",
      "a": 1,
      "m": 15,
      "lat": -6.1766,
      "lon": 106.833,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Inacash / Atria Sudirman Jl. Jend. Sudirman",
      "a": 1,
      "m": 15,
      "lat": -6.213,
      "lon": 106.817,
      "w": "Jakarta Pusat",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Ceria Nugraha Indotama / South Quarter Tower Jl",
      "a": 1,
      "m": 15,
      "lat": -6.289,
      "lon": 106.793,
      "w": "Jakarta Selatan",
      "tg": "RENDAH"
    },
    {
      "n": "Kantor PT. Stargate Pacific Resources / Equity Tower SCBD ",
      "a": 1,
      "m": 15,
      "lat": -6.2265,
      "lon": 106.809,
      "w": "Jakarta Selatan",
      "tg": "RENDAH"
    },
    {
      "n": "Depan Wisma Danantara Jl. Gatot Subroto",
      "a": 1,
      "m": 15,
      "lat": -6.23,
      "lon": 106.812,
      "w": "Jakarta Selatan",
      "tg": "RENDAH"
    },
    {
      "n": "Depan Kedubes RRT Jl. Mega Kuningan",
      "a": 1,
      "m": 10,
      "lat": -6.227,
      "lon": 106.827,
      "w": "Jakarta Selatan",
      "tg": "RENDAH"
    }
  ],
  "jam": [
    {
      "jam": "06.00",
      "jumlah_aksi": 1,
      "massa": 10
    },
    {
      "jam": "07.00",
      "jumlah_aksi": 1,
      "massa": 30
    },
    {
      "jam": "08.00",
      "jumlah_aksi": 1,
      "massa": 200
    },
    {
      "jam": "09.00",
      "jumlah_aksi": 5,
      "massa": 260
    },
    {
      "jam": "10.00",
      "jumlah_aksi": 19,
      "massa": 610
    },
    {
      "jam": "11.00",
      "jumlah_aksi": 9,
      "massa": 180
    },
    {
      "jam": "12.00",
      "jumlah_aksi": 2,
      "massa": 30
    },
    {
      "jam": "13.00",
      "jumlah_aksi": 26,
      "massa": 470
    },
    {
      "jam": "14.00",
      "jumlah_aksi": 1,
      "massa": 50
    },
    {
      "jam": "15.00",
      "jumlah_aksi": 2,
      "massa": 120
    },
    {
      "jam": "Tidak dicantumkan",
      "jumlah_aksi": 1,
      "massa": 15
    }
  ],
  "kat": [
    {
      "kategori": "Yudikatif / Penegak Hukum",
      "jumlah_aksi": 22,
      "massa": 625
    },
    {
      "kategori": "Korporasi / Swasta",
      "jumlah_aksi": 17,
      "massa": 535
    },
    {
      "kategori": "Pemerintah Pusat",
      "jumlah_aksi": 10,
      "massa": 335
    },
    {
      "kategori": "Korporasi / BUMN",
      "jumlah_aksi": 6,
      "massa": 105
    },
    {
      "kategori": "Pemda DKI / Ketenagakerjaan",
      "jumlah_aksi": 5,
      "massa": 240
    },
    {
      "kategori": "Politik / Isu Nasional",
      "jumlah_aksi": 4,
      "massa": 80
    },
    {
      "kategori": "Korporasi / BUMD",
      "jumlah_aksi": 3,
      "massa": 45
    },
    {
      "kategori": "Diplomatik",
      "jumlah_aksi": 1,
      "massa": 10
    }
  ],
  "wil": [
    {
      "wilayah": "Jakarta Pusat",
      "jumlah_aksi": 33,
      "massa": 1130
    },
    {
      "wilayah": "Jakarta Selatan",
      "jumlah_aksi": 32,
      "massa": 595
    },
    {
      "wilayah": "Jakarta Utara",
      "jumlah_aksi": 3,
      "massa": 250
    }
  ],
  "tema": [
    {
      "tema": "Lain-lain (isu tunggal/kasus spesifik)",
      "jumlah_aksi": 25,
      "massa": 825
    },
    {
      "tema": "Deklarasi Sumpah Pemuda 2026 (dugaan manipulasi/mobilisasi)",
      "jumlah_aksi": 12,
      "massa": 200
    },
    {
      "tema": "Tambang & nikel (IUP, lingkungan, ekspor)",
      "jumlah_aksi": 9,
      "massa": 205
    },
    {
      "tema": "Dugaan korupsi BUMN/BUMD",
      "jumlah_aksi": 7,
      "massa": 120
    },
    {
      "tema": "Judi online & layanan keuangan digital",
      "jumlah_aksi": 4,
      "massa": 80
    },
    {
      "tema": "Dewan Pengawas Sarana Jaya",
      "jumlah_aksi": 3,
      "massa": 50
    },
    {
      "tema": "Ponpes Hamalatul Qur'an Mojolaban Sukoharjo",
      "jumlah_aksi": 3,
      "massa": 80
    },
    {
      "tema": "Upah minimum / UMP-UMSP 2027",
      "jumlah_aksi": 2,
      "massa": 180
    },
    {
      "tema": "Kinerja & integritas aparat kepolisian",
      "jumlah_aksi": 2,
      "massa": 35
    },
    {
      "tema": "Ketenagakerjaan tingkat perusahaan (PHK, PKWT, upah)",
      "jumlah_aksi": 1,
      "massa": 200
    }
  ],
  "totals": {
    "total_aksi": 68,
    "total_massa": 1975,
    "aksi_korporasi": 26,
    "massa_korporasi": 685,
    "titik_klaster": 36,
    "giat_jumlah": 9,
    "giat_massa": 10900,
    "aksi_massa_besar": 4,
    "aksi_massa_kecil": 56
  },
  "rute": {
    "label": "Rute aksi SPAI-FSPMI PT. Indomarco Prismatama (±30 orang, mulai 07.00 WIB)",
    "teks": "Jl. Ancol Barat - Jl. RE Martadinata - Jl. Benyamin Sueb - Jl. Letjend Suprapto - Jl. Pantura - PTC Pulo Gading - Kantor Gubernur DKI Jakarta",
    "titik": [
      {
        "n": "Tikpul: Sekretariat PUK, Jl. Ancol Barat VI",
        "lat": -6.12,
        "lon": 106.829
      },
      {
        "n": "Jl. RE Martadinata",
        "lat": -6.1235,
        "lon": 106.842
      },
      {
        "n": "Jl. Benyamin Sueb",
        "lat": -6.143,
        "lon": 106.854
      },
      {
        "n": "Jl. Letjend Suprapto",
        "lat": -6.176,
        "lon": 106.864
      },
      {
        "n": "Kantor Gubernur DKI / Balaikota",
        "lat": -6.1818,
        "lon": 106.8272
      }
    ],
    "catatan": "Urutan rute dalam pesan sumber tidak konsisten secara geografis: Jl. Letjend Suprapto mengarah ke Jakpus, namun disusul 'Jl. Pantura, PTC Pulo Gading' yang berada kembali di arah timur laut. Polyline pada peta hanya memetakan segmen yang koheren (Ancol - Martadinata - Benyamin Sueb - Letjend Suprapto - Balaikota). Perlu konfirmasi korlap sebelum dipakai untuk perencanaan penutupan jalur."
  },
  "giat": [
    {
      "w": "Jakpus",
      "t": "13.00-22.00",
      "l": "Beranda Gedung Sarinah Jl. M.H. Thamrin No. 11 Menteng",
      "lat": -6.1862,
      "lon": 106.823,
      "keg": "Pertunjukan Seni dan Musik Bulan November 2026",
      "pj": "PT. Sarinah / Aditia Ashari",
      "m": 500
    },
    {
      "w": "Jakut",
      "t": "08.00-20.00",
      "l": "Swissotel Jakarta PIK Avenue, Penjaringan",
      "lat": -6.108,
      "lon": 106.742,
      "keg": "Konferensi Internasional RSPO 2026",
      "pj": "PT. RSPO Secretariat Indonesia / Aryo Gustomo",
      "m": 700
    },
    {
      "w": "Jakpus",
      "t": "07.00-18.00",
      "l": "Exhibition Hall JICC Senayan, Tanah Abang",
      "lat": -6.2185,
      "lon": 106.802,
      "keg": "Expo Paten dan Talkshow FBPI 2026",
      "pj": "PT. Falah Eka Cahya / Denny Isetiorahadi P.",
      "m": 3500
    },
    {
      "w": "Jakpus",
      "t": "10.00-18.00",
      "l": "Hall A1 JIExpo Kemayoran",
      "lat": -6.1455,
      "lon": 106.845,
      "keg": "Heatech Indonesia 2026; South East Asia Sugar Summit 2026; Wire & Cable Technology 2026",
      "pj": "PT. Media Artha Sentosa / Tri Coya Oktaria",
      "m": 500
    },
    {
      "w": "Jakpus",
      "t": "10.00-18.00",
      "l": "Hall B123 & C123 JIExpo Kemayoran",
      "lat": -6.1455,
      "lon": 106.845,
      "keg": "SIAL Food and Drinks Indonesia 2026",
      "pj": "PT. Amara Tujuh Perjuangan / Irica Yoshiko",
      "m": 3000
    },
    {
      "w": "Jaksel",
      "t": "08.00-22.00",
      "l": "Gelanggang Remaja Tebet & Cougar Arena 1 Tebet",
      "lat": -6.2345,
      "lon": 106.845,
      "keg": "Turnamen Bola Basket Cougar Indonesia Championship",
      "pj": "Cougar Indonesia Basketball Club / Ahmad Barlian",
      "m": 100
    },
    {
      "w": "Jaksel",
      "t": "10.00-22.00",
      "l": "Taman Literasi Martha Christina Tiahahu Jl. Sisingamangaraja No. 2, Kebayoran Baru",
      "lat": -6.244,
      "lon": 106.7985,
      "keg": "Pertamina Smexpo",
      "pj": "Genezys / Ricky Ardian",
      "m": 1000
    },
    {
      "w": "Jaksel",
      "t": "23.00-02.00",
      "l": "Super Club Jl. Gatot Subroto No. 1003 Tebet",
      "lat": -6.237,
      "lon": 106.838,
      "keg": "Live Musik Denny Caknan",
      "pj": "PT. Kreasi Gatsu Berjaya / Arif Afandi",
      "m": 800
    },
    {
      "w": "Jaksel",
      "t": "23.00-02.00",
      "l": "The H Club Jl. Jend. Sudirman Kav. 52-53 SCBD Lot. 19, Kebayoran Baru",
      "lat": -6.2265,
      "lon": 106.8085,
      "keg": "Live Music Novelli X Panda",
      "pj": "PT. Terbang Bersama Artha / Ruswandi",
      "m": 800
    }
  ],
  "batal": [
    {
      "o": "Mahasiswa Berdialektika Dengan Logika Sumut",
      "k": "Habibi Martua Hasibuan",
      "l": "Silang Selatan Monas",
      "s": "BATAL"
    },
    {
      "o": "Gerakan Mahasiswa dan Pemuda",
      "k": "Syahrul Romadon Rambe",
      "l": "Silang Selatan Monas",
      "s": "BATAL"
    },
    {
      "o": "Gerakan Mahasiswa Demokrasi",
      "k": "Wildan Riscky Candra",
      "l": "Klinik Venus Jl. Cideng Timur",
      "s": "BATAL"
    },
    {
      "o": "Solidaritas Mahasiswa Islam Indonesia",
      "k": "Riswan Wadi",
      "l": "Kantor Balaikota DKI Jakarta Jl. Merdeka Selatan",
      "s": "BATAL"
    }
  ],
  "obs": [
    {
      "t": "04/11/2026 11.55",
      "l": "Bundaran Hotel Indonesia",
      "d": "Permintaan update area Bundaran HI",
      "p": "+62 811-1380-4741"
    },
    {
      "t": "04/11/2026 11.58",
      "l": "Bundaran Hotel Indonesia",
      "d": "\"Bunderan HI masih landai\"",
      "p": "Jerry Yuswan ASIS Chapter"
    },
    {
      "t": "04/11/2026 12.36",
      "l": "Bundaran Hotel Indonesia",
      "d": "\"Nihil\" — tidak ada pergerakan massa",
      "p": "+62 857-7974-6522"
    },
    {
      "t": "04/11/2026 12.37",
      "l": "Bundaran Hotel Indonesia",
      "d": "Info beredar akan ada pergerakan ke Bundaran HI; tidak terkonfirmasi di lapangan",
      "p": "+62 812-1818-6091"
    },
    {
      "t": "04/11/2026 15.51",
      "l": "Jakarta",
      "d": "Mahasiswa Muhammadiyah \"masih nihil\"",
      "p": "+62 813-8751-6278"
    },
    {
      "t": "04/11/2026 16.01",
      "l": "Lokasi tidak disebut",
      "d": "\"Di samperin da steril\" — lokasi sudah steril saat didatangi",
      "p": "+62 857-7974-6522"
    }
  ],
  "sinyal": [
    {
      "t": "04/11/2026 08.15",
      "s": "Rencana aksi Hari Pahlawan 10 November 2026",
      "d": "Pertanyaan anggota grup; belum ada jawaban/konfirmasi di dalam sumber",
      "st": "Belum terkonfirmasi"
    },
    {
      "t": "04/11/2026 09.31",
      "s": "Bandung — \"5 juga dah meriah\"",
      "d": "Indikasi aktivitas unras di Bandung 5 Nov; tanpa rincian lokasi/massa",
      "st": "Belum terkonfirmasi"
    },
    {
      "t": "04/11/2026 22.28",
      "s": "Samarinda — pertanyaan \"rusuh?\"",
      "d": "Dijawab \"belum monitor\" oleh anggota lain",
      "st": "Belum terkonfirmasi"
    },
    {
      "t": "04/11/2026 18.53",
      "s": "\"Besok Jakarta ada agenda apakah?\"",
      "d": "Dijawab dengan rengiat 5 Nov (Jakpus/Jaksel/Jakut)",
      "st": "Terjawab"
    },
    {
      "t": "05/11/2026 03.46",
      "s": "Penutupan jalur ke Pengadilan Jakarta Timur karena sidang",
      "d": "Pertanyaan terbuka; tidak ada konfirmasi di dalam sumber",
      "st": "Belum terkonfirmasi"
    }
  ],
  "makassar": [
    {
      "t": "08.00 WITA",
      "l": "PT. Yin Jing Internasional Jl. Kima 3 Kav. S13, Biringkanaya",
      "o": "SEKAR YJI-PMBI",
      "p": "Muh. Ansyar",
      "m": 30,
      "d": "Menyikapi permasalahan ketenagakerjaan di PT. Yin Jing Internasional"
    },
    {
      "t": "11.00 WITA",
      "l": "Pertamina Jl. Garuda; SPBU 74.901.13 Jl. Masjid Raya",
      "o": "Aktivis Mahasiswa Indonesia",
      "p": "Muh. Aris",
      "m": 50,
      "d": "Menyikapi dugaan kecurangan dalam penyaluran BBM bersubsidi"
    },
    {
      "t": "13.00 WITA",
      "l": "PT. Astra Graphia Tbk Cab. Makassar Jl. Dr. Ratulangi, Mariso",
      "o": "Aliansi Serikat Buruh dan Mahasiswa Untuk Demokrasi",
      "p": "Camerad",
      "m": 20,
      "d": "PHK sepihak terhadap pekerja"
    },
    {
      "t": "13.00 WITA",
      "l": "Mapolda Sulsel",
      "o": "KEPMI Bone",
      "p": "Andi Teguh Qoemaeni",
      "m": 100,
      "d": "Copot Kapolrestabes Makassar; usut tuntas kematian alm. Sofyan"
    },
    {
      "t": "14.00 WITA",
      "l": "Jl. Pettarani (samping Kimia Farma)",
      "o": "Aliansi Mahasiswa dan Pemuda Wija To Bone & Kerukunan Pemuda Arung Palakka",
      "p": "Khaidir",
      "m": 200,
      "d": "Usut tuntas dugaan penyebab meninggalnya korban atas keterlambatan penanganan medis"
    },
    {
      "t": "10.00 WITA",
      "l": "Polda Sulsel",
      "o": "Gerakan Aktivis Mahasiswa (GAM)",
      "p": "Saki",
      "m": 20,
      "d": "Menyikapi pengeroyokan kader GAM oleh oknum Satpol PP dan pegawai PDAM di Kab. Palopo"
    },
    {
      "t": "13.00 WITA",
      "l": "Depan Phinisi UNM",
      "o": "Aliansi Mahasiswa dan Alumni UNM",
      "p": "-",
      "m": 100,
      "d": "Pecat Plt Rektor UNM terkait dugaan cawe-cawe calon rektor"
    }
  ],
  "sumber": "WhatsApp Group 'UPDATE UNRAS DI INDONESIA' — export 05/11/2026 03:46 WIB"
};

export const UNRAS_REPORTS: (SituationalReport & {
  targetCategory: string;
  isCorporateExposure: boolean;
  clusterGroup: string;
  startTimeHour: number;
})[] = RAW_UNRAS_DATA.aksi.map((item: any, idx: number) => {
  const m = item.m || 10;
  const threatLevel: SituationalThreatLevel = 
    m >= 150 ? 'CRITICAL' :
    m >= 50 ? 'HIGH' :
    m >= 25 ? 'MEDIUM' : 'LOW';

  let hourNum = 10;
  if (item.t && item.t.includes('.')) {
    const parts = item.t.split('.');
    hourNum = parseInt(parts[0], 10) || 10;
  }

  return {
    id: 'unras-jkt-' + (idx + 1),
    reportCode: 'RENGIAT-2026-' + String(idx + 1).padStart(3, '0'),
    timestamp: item.t ? item.t + ' WIB' : '10.00 WIB',
    eventDate: '2026-11-05',
    targetEntity: item.l,
    region: item.w + ', DKI Jakarta',
    coordinates: {
      latitude: item.lat,
      longitude: item.lon
    },
    partiesInvolved: item.o + (item.p ? ' (Korlap: ' + item.p + ')' : ''),
    scaleEstimate: '± ' + m + ' Orang / ' + (m >= 100 ? 'Skala Besar' : m >= 50 ? 'Skala Menengah' : 'Skala Terfokus'),
    crowdCountEstimate: m,
    issueSummary: item.d,
    fullContent: 'Unjuk rasa terencana oleh ' + item.o + ' di ' + item.l + '. Tuntutan: ' + item.d + '. Estimasi massa: ±' + m + ' orang. Korlap: ' + item.p + '. Klaster: ' + item.c,
    threatLevel,
    status: 'Rencana/Rengiat',
    scope: (item.x === 'Ya' ? 'OBVITNAS_THREAT' : 'UNRAS_MASSA'),
    sourceUrl: 'https://unrasjkt05nov.netlify.app/',
    loggedBy: 'Aryaa (ARYAA-KOMANDO)',
    sourceEngine: 'MJ-Sentinel Heuristic Engine v3.0',
    createdAt: '2026-11-05T03:46:00Z',
    shareToken: 'share_unras_' + (idx + 1),
    hotspotRank: idx + 1,
    targetCategory: item.k,
    isCorporateExposure: item.x === 'Ya',
    clusterGroup: item.c,
    startTimeHour: hourNum
  };
});

// Temuan Analisis Situasional Direksi (SitRep 7 Poin Kunci)
export const SITREP_FINDINGS = [
  {
    id: 'f1',
    accent: 'red',
    title: 'Postur hari ini: tinggi dalam jumlah, rendah dalam skala.',
    content: '68 aksi terencana namun 56 di antaranya berskala ≤25 orang. Beban utama adalah frekuensi dan sebaran titik, bukan konsentrasi massa. Risiko dominan adalah gangguan akses dan lalu lintas serta tekanan reputasi di depan gedung, bukan kerusuhan massa.'
  },
  {
    id: 'f2',
    accent: 'red',
    title: 'Dua puncak jam: 10.00 dan 13.00 WIB.',
    content: '19 aksi dimulai pukul 10.00 dan 26 aksi pukul 13.00 — 66% aksi terkonsentrasi pada dua jendela waktu ini. Jendela relatif aman untuk pergerakan eksekutif: sebelum 09.00 dan setelah 16.00 WIB.'
  },
  {
    id: 'f3',
    accent: 'amber',
    title: 'Klaster aparat penegak hukum adalah titik terpadat.',
    content: 'Polda Metro Jaya menjadi lokasi 11 aksi (±170 orang) dan Baharkam Polri 7 aksi (±160 orang). Keduanya berada di koridor Gatot Subroto–Trunojoyo, berdampak pada akses SCBD dan Kuningan sepanjang 09.00–14.00 WIB.'
  },
  {
    id: 'f4',
    accent: 'amber',
    title: 'Satu isu tunggal menggerakkan 12 aksi: Deklarasi Sumpah Pemuda 2026.',
    content: '12 aksi dari 12 organisasi berbeda dengan tuntutan hampir identik mengenai dugaan manipulasi dan mobilisasi mahasiswa bayaran, tersebar di Monas, Polda Metro Jaya, dan Baharkam Polri. Pola ini konsisten dengan aksi terkoordinasi, bukan kemunculan spontan.'
  },
  {
    id: 'f5',
    accent: 'cyan',
    title: 'Eksposur korporasi signifikan: 26 aksi menyasar kantor perusahaan dan gedung komersial.',
    content: 'Termasuk Wisma 46 BNI, Equity Tower SCBD, Menara Batavia, Sinarmas Land Plaza, Dipo Tower, South Quarter, Graha Hanurata, dan Gedung Granadi. Implikasi langsung pada lobby, akses parkir, dan citra tenant gedung-gedung tersebut.'
  },
  {
    id: 'f6',
    accent: 'cyan',
    title: 'Agenda upah mulai bergerak dengan massa terbesar yang mobile, bukan statis.',
    content: 'FSPMI ±150 orang di Balaikota pukul 09.00, ±30 orang bergerak dari Ancol Barat sejak 07.00, dan ±200 orang di PT Borwita Kelapa Gading. Siklus penetapan UMP 2027 menjadikan isu ini berpotensi berulang dan membesar pada pekan-pekan berikutnya.'
  },
  {
    id: 'f7',
    accent: 'red',
    title: 'Preseden H-1 melemahkan asumsi realisasi penuh.',
    content: 'Pada 4 November 2026, 4 dari 4 rencana aksi Jakarta Pusat dibatalkan dan Bundaran HI dilaporkan "nihil" serta "masih landai" oleh dua pelapor berbeda. Keputusan operasional sebaiknya menunggu konfirmasi lapangan pukul 08.00–09.00 WIB.'
  }
];

// Rekomendasi Operasional Tingkat Direksi
export const EXECUTIVE_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    category: 'Pergerakan Eksekutif & Tamu VIP',
    recommendation: 'Hindari pergerakan melintasi koridor Gatot Subroto (Polda Metro & DPR), Trunojoyo, dan Rasuna Said pada jendela rawan 09.30 - 14.30 WIB. Jadwalkan kedatangan tamu VIP atau pergerakan direksi sebelum pukul 08.30 atau setelah pukul 15.30 WIB.'
  },
  {
    id: 'rec-2',
    category: 'Protokol Akses Gedung Komersial & Tenant',
    recommendation: 'Untuk pengelola/tenant gedung yang masuk daftar 26 eksposur korporasi (SCBD, Wisma 46, Menara Batavia, Sinarmas Land, Dipo Tower), terapkan pengetatan pemeriksaan ID card karyawan di lobby dan batasi akses drop-off kendaraan sejak pukul 09.00 WIB.'
  },
  {
    id: 'rec-3',
    category: 'Fasilitas Pergudangan & Rute Logistik',
    recommendation: 'Tingkatkan kewaspadaan di koridor distribusi logistik Kelapa Gading, Pulogadung, dan Ancol terkait aksi pergerakan buruh SPAI-FSPMI. Siapkan rute alternatif via Tol Lingkar Luar (JORR) untuk menghindari antrean truk.'
  },
  {
    id: 'rec-4',
    category: 'Verifikasi Lapangan H-0',
    recommendation: 'Jangan terburu-buru memberlakukan penutupan fasilitas kantor secara total sebelum ada verifikasi intelijen lapangan pukul 08.00 - 09.00 WIB, mengingat tingginya tingkat pembatalan pada rencana aksi hari sebelumnya.'
  }
];

// Daftar Khusus 26 Aksi Eksposur Korporasi
export const CORPORATE_EXPOSURES = UNRAS_REPORTS.filter(r => r.isCorporateExposure);

// Data Rute Pergerakan Konvoi Massa
export const MOVEMENT_ROUTE_DATA = RAW_UNRAS_DATA.rute;

// Data Giat Massa Paralel Non-Unras
export const PARALLEL_EVENTS_DATA = RAW_UNRAS_DATA.giat;

// Data Pembatalan Aksi H-1
export const CANCELLATIONS_H1_DATA = RAW_UNRAS_DATA.batal;

// Data Sinyal Belum Terkonfirmasi
export const UNCONFIRMED_SIGNALS_DATA = RAW_UNRAS_DATA.sinyal;

// Data Konteks Luar Jakarta (Makassar)
export const OUTSIDE_JAKARTA_DATA = RAW_UNRAS_DATA.makassar;

