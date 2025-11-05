// Logika yang menghubungkan UI (HTML) dengan Logic Layer (logic.js)

document.addEventListener('DOMContentLoaded', () => {
    // Dapatkan form elemen
    const form = document.getElementById('nilaiForm');

    // Cek jika elemen form ada (berarti di halaman index.html)
    if (form) {
        // Tambahkan event listener untuk tombol Simpan Data
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Mencegah submit form default

            // Kumpulkan data dari form. 
            // Pastikan ID di sini cocok dengan ID yang ada di index.html:
            // namaLengkap, nim, mataKuliah, nilai
            const inputData = {
                // TIDAK ADA PERUBAHAN SINTAKSIS, kode ini sudah benar karena 
                // index.html sekarang menggunakan id="namaLengkap"
                namaLengkap: document.getElementById('namaLengkap').value.trim(),
                nim: document.getElementById('nim').value.trim(),
                mataKuliah: document.getElementById('mataKuliah').value.trim(),
                nilai: document.getElementById('nilai').value.trim()
            };

            // 1. Jalankan validasi
            if (validasiInput(inputData)) { //
                // 2. Jika valid, simpan data
                const isSuccess = await simpanData(inputData);
                
                // 3. Reset form jika berhasil disimpan
                if (isSuccess) {
                    form.reset();
                }
            } else {
                // Notifikasi kegagalan sudah ada di fungsi validasiInput()
            }
        });
    }
});