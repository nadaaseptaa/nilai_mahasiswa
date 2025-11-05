// Menggunakan instance db dari firebase-config.js

/**
 * Memeriksa apakah data input nilai sudah lengkap dan sesuai format.
 * @param {object} data - Objek berisi data dari form: {namaLengkap, nim, mataKuliah, nilai}
 * @returns {boolean} - True jika valid, false jika gagal.
 * @desc Sesuai dengan validasi data pada Activity Diagram.
 */
const validasiInput = (data) => {
    // Implementasi best practice: penamaan deskriptif (data)
    
    // Cek kelengkapan data
    if (!data.namaLengkap || !data.nim || !data.mataKuliah || !data.nilai) {
        alert("Gagal menyimpan data. Semua field harus diisi!");
        return false;
    }
    
    // Cek format NIM (misal: harus angka)
    if (!/^\d+$/.test(data.nim)) {
        alert("Gagal menyimpan data. NIM hanya boleh berisi angka.");
        return false;
    }

    // Cek rentang nilai
    const nilaiFloat = parseFloat(data.nilai);
    if (isNaN(nilaiFloat) || nilaiFloat < 0 || nilaiFloat > 100) {
        alert("Gagal menyimpan data. Nilai harus antara 0 dan 100.");
        return false;
    }

    return true;
}

/**
 * Menyimpan data nilai ke koleksi 'nilai' dan data mahasiswa ke 'mahasiswa' di Firestore.
 * @param {object} data - Data nilai yang sudah divalidasi.
 * @desc Sesuai alur 'Mengirim data ke firebase' pada Activity Diagram.
 */
const simpanData = async (data) => {
    // Pisahkan data untuk koleksi Mahasiswa dan Nilai (sesuai ERD/Class Diagram)
    const mahasiswaData = {
        nim: data.nim,
        nama: data.namaLengkap,
        prodi: "Contoh Prodi" // Dipermudah, idealnya diambil dari input/logika
    };
    
    const [kode_mk] = data.mataKuliah.split(" - ");
    const nilaiData = {
        // id_nilai akan otomatis dibuat oleh Firestore
        nim: data.nim,
        kode_mk: kode_mk.trim(),
        nilai: parseFloat(data.nilai),
        tanggal_input: firebase.firestore.FieldValue.serverTimestamp() // Timestamp
    };

    try {
        // 1. Simpan/Update data Mahasiswa (jika belum ada)
        await db.collection("mahasiswa").doc(data.nim).set(mahasiswaData, { merge: true });

        // 2. Simpan data Nilai
        await db.collection("nilai").add(nilaiData); // Firestore membuat ID dokumen otomatis

        alert("Data berhasil disimpan!"); // Kirim notifikasi berhasil simpan
        await loadData(); // Panggil loadData() untuk refresh tabel
        return true;
    } catch (error) {
        console.error("Error saat menyimpan data:", error);
        alert("Gagal menyimpan data ke database. Cek konsol untuk detail."); // Kirim notifikasi gagal simpan
        return false;
    }
}

/**
 * Mengambil dan menampilkan data nilai dari Firestore ke halaman web.
 * @desc Sesuai alur 'mengambil data dari firebase' dan 'Menampilkan data ke tabel nilai'.
 */
const loadData = async () => {
    if (window.location.pathname.endsWith('lihatdatamhs.html') === false) {
        // Fungsi ini hanya berjalan di halaman lihatdatamhs.html
        return;
    }

    const tableBody = document.getElementById('dataNilaiBody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Memuat data...</td></tr>';

    try {
        // Ambil data nilai
        const nilaiSnapshot = await db.collection("nilai").orderBy("tanggal_input", "desc").get();
        const nilaiList = [];
        nilaiSnapshot.forEach(doc => {
            nilaiList.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Tampilkan ke tabel
        tableBody.innerHTML = ''; // Kosongkan tabel
        let no = 1;

        if (nilaiList.length === 0) {
             tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Tidak ada data nilai yang tersimpan.</td></tr>';
             return;
        }
        
        // Asumsi data yang disimpan di 'nilai' sudah mencakup informasi Nama dan Mata Kuliah
        // Implementasi ini disederhanakan. Dalam implementasi nyata, Anda perlu melakukan JOIN/QUERY
        // ke koleksi 'mahasiswa' dan 'matakuliah' menggunakan NIM dan kode_mk.
        for (const item of nilaiList) {
             // Contoh sederhana: Fetch data Mahasiswa dan Mata Kuliah
             const mhsDoc = await db.collection("mahasiswa").doc(item.nim).get();
             const mhsNama = mhsDoc.exists ? mhsDoc.data().nama : 'Nama Tidak Ditemukan';
             // Asumsi kode MK ada di item.kode_mk

             const row = tableBody.insertRow();
             row.insertCell(0).textContent = no++;
             row.insertCell(1).textContent = mhsNama;
             row.insertCell(2).textContent = item.nim;
             row.insertCell(3).textContent = item.kode_mk || 'MK Unknown';
             row.insertCell(4).textContent = item.nilai.toFixed(2);
        }

    } catch (error) {
        console.error("Error saat memuat data:", error);
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Gagal memuat data!</td></tr>';
    }
}