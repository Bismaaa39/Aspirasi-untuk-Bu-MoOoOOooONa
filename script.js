document.addEventListener("DOMContentLoaded", function () {
    tampilkanAspirasi();
    animasiTeks();
});

let perubahanTerjadi = false;

function animasiTeks() {
    let teks = ["Tuliskan Aspirasi untuk Bu Mona:", "Berikan Pendapatmu untuk Bu Mona:", "Sampaikan Saranmu untuk Bu Mona:"];
    let i = 0;
    setInterval(() => {
        document.getElementById("animasiTeks").innerText = teks[i];
        i = (i + 1) % teks.length;
    }, 3000);
}

window.addEventListener("beforeunload", function (event) {
    if (perubahanTerjadi) {
        event.preventDefault();
        event.returnValue = "Isi dulu woi!!!!!";
    }
});

function kirimAspirasi() {
    let nama = document.getElementById("nama").value || "Anonim";
    let aspirasi = document.getElementById("aspirasi").value;

    if (aspirasi.trim() === "") {
        alert("Isi Aspirasinya sebelum mengirim kocak!");
        return;
    }

    let aspirasiObj = { nama, aspirasi };
    simpanKeLocalStorage(aspirasiObj);
    tampilkanAspirasi();
    kirimKeGoogleForms(aspirasiObj);

    document.getElementById("aspirasiForm").reset();
    perubahanTerjadi = false;
}

function simpanKeLocalStorage(aspirasi) {
    let aspirasiList = JSON.parse(localStorage.getItem("aspirasiList")) || [];
    aspirasiList.push(aspirasi);
    localStorage.setItem("aspirasiList", JSON.stringify(aspirasiList));
}

function tampilkanAspirasi() {
    let aspirasiList = JSON.parse(localStorage.getItem("aspirasiList")) || [];
    let aspirasiContainer = document.getElementById("aspirasiList");
    aspirasiContainer.innerHTML = "<h3>📜 Daftar Aspirasi</h3>";

    aspirasiList.forEach((asp, index) => {
        let item = document.createElement("div");
        item.classList.add("aspirasi-item");
        item.innerHTML = `<strong>${asp.nama}</strong><p>${asp.aspirasi}</p>
                          <button onclick="hapusAspirasi(${index})">Hapus</button>`;
        aspirasiContainer.appendChild(item);
    });
}

function hapusAspirasi(index) {
    let aspirasiList = JSON.parse(localStorage.getItem("aspirasiList")) || [];
    aspirasiList.splice(index, 1);
    localStorage.setItem("aspirasiList", JSON.stringify(aspirasiList));
    tampilkanAspirasi();
}

function kirimKeGoogleForms() {
    let formURL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdHI_EXkwsJEkSJXX_qSK4Mzdbbp5LMZGQCofI-N-kaf44s8Q/formResponse";

    let nama = document.getElementById("nama").value;
    let aspirasi = document.getElementById("aspirasi").value;

    if (aspirasi.trim() === "") {
        alert("Harap isi aspirasi terlebih dahulu!");
        return;
    }

    let formData = new FormData();
    formData.append("entry.1551457206", nama);  // Nama
    formData.append("entry.1297461576", aspirasi);  // Aspirasi

    fetch(formURL, { method: "POST", body: formData, mode: "no-cors" })
        .then(() => {
            alert("✅ Aspirasi telah terkirim ke Bu Mona!");
            document.getElementById("aspirasiForm").reset();
        })
        .catch(() => alert("❌ Gagal mengirim aspirasi, coba lagi!"));
}

