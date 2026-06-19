let galeriSaatIni = [];
let indeksFotoSaatIni = 0;

// =======================
// MODAL FOTO
// =======================

function bukaModalFoto(galeri, rasio = "16-9") {
    const modal = document.getElementById("modal-foto");
    const img = document.getElementById("foto-kegiatan");

    galeriSaatIni = galeri;
    indeksFotoSaatIni = 0;

    img.src = galeriSaatIni[0];
    modal.style.display = "flex";

    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");

if (galeri.length > 1) {
    prev.style.display = "block";
    next.style.display = "block";
} else {
    prev.style.display = "none";
    next.style.display = "none";
}

    document.body.classList.add("no-scroll");

    img.className = "modal-content rasio-" + rasio;
}

function gantiFoto(dir) {
    indeksFotoSaatIni += dir;

    if (indeksFotoSaatIni >= galeriSaatIni.length) indeksFotoSaatIni = 0;
    if (indeksFotoSaatIni < 0) indeksFotoSaatIni = galeriSaatIni.length - 1;

    const img = document.getElementById("foto-kegiatan");

img.style.opacity = "0";

setTimeout(() => {
    img.src = galeriSaatIni[indeksFotoSaatIni];

    img.onload = () => {
        img.style.opacity = "1";
    };

}, 200);
}

function tutupFoto() {
    document.getElementById("modal-foto").style.display = "none";
    document.body.classList.remove("no-scroll");
}

// =======================
// MODAL INFO
// =======================

const infoData = {
    osis: {
        judul: "OSIS SMAN 1 Kuningan",
        deskripsi: "OSIS adalah organisasi siswa..."
    },
    mpk: {
        judul: "MPK SMAN 1 Kuningan",
        deskripsi: "MPK adalah lembaga legislatif siswa..."
    }
};

function bukaInfo(key){
    const data = infoData[key];

    if(!data) return;

    document.getElementById("info-judul").innerText = data.judul;
    document.getElementById("info-deskripsi").innerText = data.deskripsi;

    document.getElementById("modal-info").style.display="flex";
    document.body.classList.add("no-scroll");
}

function tutupInfo() {
    document.getElementById("modal-info").style.display = "none";
    document.body.classList.remove("no-scroll");
}

// =======================
// EVENT LISTENER (CLEAN VERSION)
// =======================

document.addEventListener("DOMContentLoaded", () => {

    // LOGO INFO
    document.querySelectorAll("[data-info]").forEach(el => {
        el.addEventListener("click", () => {
            bukaInfo(el.dataset.info);
        });
    });

    // GALERI LIST
    document.querySelectorAll("#seragam [data-gallery]").forEach(el => {
    el.addEventListener("click", () => {
        bukaModalFoto(JSON.parse(el.dataset.gallery), "3-4");
    });
});

    // SINGLE IMAGE
    document.querySelectorAll("[data-img]").forEach(el => {
        el.addEventListener("click", () => {
            bukaModalFoto([el.dataset.img]);
        });
    });

    // CLOSE BUTTONS
    document.querySelector(".close").onclick = tutupFoto;
    document.querySelector(".close-info").onclick = tutupInfo;

    document.querySelector(".prev").onclick = () => gantiFoto(-1);
    document.querySelector(".next").onclick = () => gantiFoto(1);
});
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("muncul");

            observer.unobserve(entry.target);

        }

    });
});

document.querySelectorAll("section").forEach(section => {
    section.classList.add("animasi-scroll");
    observer.observe(section);
});
let startX = 0;

const gambar = document.getElementById("foto-kegiatan");

gambar.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

gambar.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {
        gantiFoto(1);
    }

    if (endX - startX > 50) {
        gantiFoto(-1);
    }
});
document.getElementById("modal-foto").addEventListener("click", function(e){
    if(e.target === this){
        tutupFoto();
    }
});

document.getElementById("modal-info").addEventListener("click", function(e){
    if(e.target === this){
        tutupInfo();
    }
});
document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape"){
        tutupFoto();
        tutupInfo();
    }
});
// =======================
// LOADING SCREEN
// =======================

window.addEventListener("load", () => {

    const loading = document.getElementById("loading-screen");

    loading.classList.add("hidden");

});
// =======================
// COUNTDOWN MPLS
// =======================

// Ganti sesuai hari pertama MPLS
const tanggalMPLS = new Date("July 13, 2026 07:00:00").getTime();

const hitungCountdown = () => {

    const sekarang = new Date().getTime();

    const selisih = tanggalMPLS - sekarang;

    if(selisih <= 0){

        document.getElementById("status-mpls").innerHTML =
        "🎉 Selamat Datang Peserta MPLS 2026!";

        document.getElementById("hari").innerHTML="00";
        document.getElementById("jam").innerHTML="00";
        document.getElementById("menit").innerHTML="00";
        document.getElementById("detik").innerHTML="00";

        clearInterval(timer);

        return;

    }

    const hari = Math.floor(selisih/(1000*60*60*24));

    const jam = Math.floor((selisih%(1000*60*60*24))/(1000*60*60));

    const menit = Math.floor((selisih%(1000*60*60))/(1000*60));

    const detik = Math.floor((selisih%(1000*60))/1000);

    document.getElementById("hari").innerHTML = hari;
    document.getElementById("jam").innerHTML = jam;
    document.getElementById("menit").innerHTML = menit;
    document.getElementById("detik").innerHTML = detik;

}

hitungCountdown();

const timer = setInterval(hitungCountdown,1000);
