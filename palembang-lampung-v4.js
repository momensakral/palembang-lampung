// Daftar awalan nomor yang valid untuk Indonesia
const indonesiaValidPrefixes = [
  "0811", "0812", "0813",  // Telkomsel Kartu Halo
  "0821", "0822",          // Telkomsel Kartu Simpati
  "0851", "0852", "0853",  // Telkomsel Kartu AS
  "0896", "0897", "0898", "0899", // Telkomsel Kartu AS
  "0831", "0832", "0833",  // Indosat
  "0855", "0856",          // XL Axiata
  "0877", "0878",          // Tri (3)
  "0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889" // Smartfren
];

// Fungsi untuk memvalidasi dan mengonversi nomor WhatsApp
function validateWhatsApp() {
  const whatsappInput = document.getElementById('whatsapp');
  const whatsappValue = whatsappInput.value.trim();

  // Reset custom validity setiap kali input berubah
  whatsappInput.setCustomValidity('');

  // Validasi jika tidak dimulai dengan angka 0
  if (!whatsappValue.startsWith('0')) {
    whatsappInput.setCustomValidity("Nomor WhatsApp harus dimulai dengan angka 0.");
  }
  // Validasi panjang nomor WhatsApp (minimal 10 digit)
  else if (whatsappValue.length < 10) {
    whatsappInput.setCustomValidity("Nomor WhatsApp harus memiliki minimal 12 digit.");
  }
  // Validasi prefix
  else {
    const prefix = whatsappValue.substring(0, 4); // Ambil 4 digit pertama untuk cek prefix
    if (!indonesiaValidPrefixes.includes(prefix)) {
      whatsappInput.setCustomValidity("Nomor yang kamu masukkan salah atau tidak terdaftar.");
    }
  }
}

document.getElementById('rsvpForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Mencegah pengiriman form default
  
  const form = document.getElementById('rsvpForm');
  const whatsappInput = form.querySelector('#whatsapp');
  const whatsappValue = whatsappInput.value.trim();
  const button = form.querySelector('button[type="submit"]');
  const spinner = button.querySelector('.spinner');
  const notification = document.getElementById('notification');
  
  // Validasi nomor WhatsApp sebelum pengiriman
  if (!whatsappValue.startsWith('0')) {
    whatsappInput.setCustomValidity("Nomor WhatsApp harus dimulai dengan angka 0.");
    return;
  }

  if (whatsappValue.length < 10) {
    whatsappInput.setCustomValidity("Nomor WhatsApp harus memiliki minimal 12 digit.");
    return;
  }

  const prefix = whatsappValue.substring(0, 4); // Ambil 4 digit pertama untuk cek prefix
  if (!indonesiaValidPrefixes.includes(prefix)) {
    whatsappInput.setCustomValidity("Nomor yang kamu masukkan salah atau tidak terdaftar.");
    return;
  }

  // Menampilkan spinner dan menyembunyikan teks "Kirim"
  button.querySelector('span').style.display = 'none';
  spinner.style.display = 'inline-block';

  const data = new FormData(form);
  const url = 'https://script.google.com/macros/s/AKfycbxsTsi3WR22ZF_U7XDcxREcrgQ2Qa9HCQiGco4a9KhqB542EX6LbkD-ycPDC0QDqOzPdQ/exec'; // Ganti dengan URL Web App Anda
  
  // Mendapatkan tanggal dan waktu saat ini
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(',', ''); // Menghilangkan koma setelah pemformatan
  
  // Tambahkan waktu ke FormData
  data.append('timestamp', formattedDate); // Menambahkan timestamp ke form data

  // Tambahkan status "Belum Terkirim" ke FormData
  data.append('status', 'Belum Terkirim'); // Menambahkan status

  fetch(url, {
    method: 'POST',
    body: data
  })
  .then(response => response.text())
  .then(() => {
    // Ganti alert dengan notifikasi sukses
    notification.textContent = 'Terkirim!';
    notification.style.display = 'block'; // Menampilkan notifikasi

    // Reset form
    form.reset(); // Membersihkan semua input di form

    // Menyembunyikan notifikasi setelah beberapa detik (misalnya 3 detik)
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000); // Hide setelah 3 detik

    // Menyembunyikan spinner dan menampilkan teks "Kirim" kembali
    spinner.style.display = 'none';
    button.querySelector('span').style.display = 'inline-block';
    
    // Menambahkan entri baru secara langsung ke dalam tampilan tanpa load ulang data
    const newEntry = document.createElement('div');
	newEntry.className = 'comment-item';
    const name = data.get('name'); // Ambil nama dari form
    const attending = data.get('attending'); // Ambil status kehadiran
    const message = data.get('message'); // Ambil pesan
    const timestamp = formattedDate; // Ambil timestamp yang sudah diformat

	// Tentukan kelas berdasarkan status kehadiran
    const badgeClass = attending === 'Hadir' ? 'hadir' : attending === 'Tidak Hadir' ? 'tidak-hadir' : '';
    
    newEntry.innerHTML = `
	  <div class="d-flex">
	  <img src="https://ui-avatars.com/api/?size=40&amp;background=random&amp;color=random&amp;name=${name}" alt="${name}" loading="lazy" class="avatar rounded-circle" style="height: 30px; width: 30px;"/>
	  <div class="ml-2 text-left">
      <p class="mb-0 font-weight-bold">${name}<span class="badge alert-info ${badgeClass}">${attending}</span></p>
      <p class="mb-0 pesan">${message}</p>
      <small>${timestamp}</small> <!-- Menambahkan waktu ke tampilan -->
	  </div>
      </div>
    `;

    const container = document.getElementById('rsvpDisplayContainer');
    // Menambahkan elemen baru di bagian atas container
    container.prepend(newEntry); // Gunakan prepend untuk menambahkan elemen di atas

	// *** Tambahkan kode ini di sini ***
    history.replaceState(null, document.title, window.location.pathname);	

  })
  .catch(error => {
    console.error('Error:', error);
    alert('Terjadi kesalahan. Silakan coba lagi.');
    
    // Menyembunyikan spinner dan menampilkan teks "Kirim" kembali
    spinner.style.display = 'none';
    button.querySelector('span').style.display = 'inline-block';
  });
});

let start = 0; // Indeks mulai
const limit = 4; // Membatasi hanya 2 data per request
let isLoading = false; // Menandakan apakah data sedang dimuat
let allDataLoaded = false; // Menandakan apakah semua data sudah dimuat

// Fungsi untuk menampilkan/menghilangkan pesan loading
function toggleLoadingMessage(isLoading) {
  const loadingMessage = document.getElementById('loadingMessage');
  if (isLoading) {
    loadingMessage.style.display = 'block'; // Tampilkan pesan loading
  } else {
    loadingMessage.style.display = 'none'; // Sembunyikan pesan loading
  }
}

// Fungsi untuk memuat data
async function loadData() {
  // Jika sedang memuat data atau sudah semua data dimuat, hentikan permintaan baru
  if (isLoading || allDataLoaded) return;

  isLoading = true;
  toggleLoadingMessage(true); // Tampilkan pesan "Sedang memuat data..."

  const url = `https://script.google.com/macros/s/AKfycbxsTsi3WR22ZF_U7XDcxREcrgQ2Qa9HCQiGco4a9KhqB542EX6LbkD-ycPDC0QDqOzPdQ/exec?start=${start}&limit=${limit}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const container = document.getElementById('rsvpDisplayContainer');

    if (data.length > 0) {
      // Menambahkan data terbaru di bawah
      data.forEach(item => {
		const badgeClass = item.attending === 'Hadir' ? 'hadir' : item.attending === 'Tidak Hadir' ? 'tidak-hadir' : '';
        const newEntry = document.createElement('div');
		newEntry.className = 'comment-item';
        newEntry.innerHTML = `
		  <div class="d-flex">
		  <img src="https://ui-avatars.com/api/?size=40&amp;background=random&amp;color=random&amp;name=${item.name}" alt="${item.name}" loading="lazy" class="avatar rounded-circle" style="height: 30px; width: 30px;"/>
		  <div class="ml-2 text-left">
          <p class="mb-0 font-weight-bold">${item.name}<span class="badge alert-info ${badgeClass}">${item.attending}</span></p>
          <p class="mb-0 pesan">${item.message}</p>
          <small>${item.timestamp}</small>
    	  </div>
    	  </div>
        `;
        
        container.appendChild(newEntry); // Menambahkan data di bawah form (di akhir container)
      });

      // Update start untuk mengambil batch berikutnya
      start += limit;

      // Hapus pesan "Semua data telah dimuat." jika masih ada
      const noMoreDataMessage = document.getElementById('noMoreDataMessage');
      if (noMoreDataMessage) {
        noMoreDataMessage.remove(); // Hapus pesan jika data masih ada
      }
    } else {
      // Jika tidak ada data lagi, tampilkan pesan hanya jika belum ada
      if (!document.getElementById('noMoreDataMessage')) {
        const noMoreDataMessage = document.createElement('div');
        noMoreDataMessage.id = 'noMoreDataMessage'; // Tambahkan ID untuk pengecekan
        noMoreDataMessage.textContent = 'Semua komentar telah dimuat.';
        
        // Menambahkan gaya CSS untuk penataan
        noMoreDataMessage.style.textAlign = 'center';
        noMoreDataMessage.style.fontSize = '12px'; // Menyesuaikan ukuran font
        noMoreDataMessage.style.color = '#777'; // Warna font abu-abu

        container.appendChild(noMoreDataMessage);

        // Menandakan bahwa semua data telah dimuat
        allDataLoaded = true;

        // Menghilangkan pesan setelah 5 detik
        setTimeout(() => {
          noMoreDataMessage.remove();
        }, 5000);
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading = false;
    toggleLoadingMessage(false); // Sembunyikan pesan setelah data dimuat
  }
}

// Muat data pertama kali saat halaman dimuat
window.addEventListener('DOMContentLoaded', loadData);

// Fungsi untuk memulai observer pada elemen terakhir
function observeLastItem() {
  const container = document.getElementById('rsvpDisplayContainer');
  const lastItem = container.lastElementChild; // Ambil elemen terakhir

  // Jika ada elemen terakhir, mulai amati elemen tersebut
  if (lastItem) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log("Elemen terakhir terlihat, memuat data...");
          loadData(); // Panggil loadData() jika elemen terakhir terlihat
        }
      });
    }, {
      root: null, // Melihat perubahan di viewport
      rootMargin: '0px',
      threshold: 1.0 // Hanya memicu jika seluruh elemen terlihat
    });

    observer.observe(lastItem); // Mulai mengamati elemen terakhir
  }
}

// Gunakan MutationObserver untuk memantau perubahan DOM (penambahan elemen)
const container = document.getElementById('rsvpDisplayContainer');
const mutationObserver = new MutationObserver(() => {
  observeLastItem(); // Memulai observasi pada elemen terakhir setiap kali ada perubahan
});

mutationObserver.observe(container, { childList: true, subtree: true });

// Mulai mengamati elemen terakhir yang ada saat ini
observeLastItem();
