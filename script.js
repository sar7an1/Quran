/* =====================
   عناصر أساسية
===================== */
const audio = document.getElementById("main-audio");
const playIcon = document.getElementById("play-icon");
const trackTitle = document.getElementById("track-title");
const volControl = document.getElementById("volControl");

let isLive = false;

/* =====================
   تشغيل صوت
===================== */
function playAudio(url, title) {
    isLive = url.includes("radio") || url.includes("radiojar");

    audio.src = url;
    audio.play()
        .then(() => {
            trackTitle.innerText = title;
            playIcon.className = "fas fa-pause";
        })
        .catch(() => {
            alert("اضغط على زر التشغيل لبدء الصوت");
        });
}

/* =====================
   تشغيل / إيقاف
===================== */
function togglePlay() {
    if (!audio.src) return;

    if (audio.paused) {
        audio.play();
        playIcon.className = "fas fa-pause";
    } else {
        audio.pause();
        playIcon.className = "fas fa-play";
    }
}

/* =====================
   تقديم / تأخير (غير البث المباشر)
===================== */
function skip(seconds) {
    if (isLive) return;
    audio.currentTime += seconds;
}

/* =====================
   مستوى الصوت
===================== */
volControl.addEventListener("input", function () {
    audio.volume = this.value;
});

/* =====================
   عند انتهاء الصوت
===================== */
audio.addEventListener("ended", function () {
    playIcon.className = "fas fa-play";
});

/* =====================
   التنقل بين الصفحات
===================== */
function showPage(html) {
    document.getElementById("home-view").classList.add("hidden");
    document.getElementById("sub-view").classList.remove("hidden");
    document.getElementById("content-area").innerHTML = html;
}

function goHome() {
    document.getElementById("home-view").classList.remove("hidden");
    document.getElementById("sub-view").classList.add("hidden");
    document.getElementById("content-area").innerHTML = "";
}

/* =====================
   الأذكار
===================== */
function openAzkar() {
    const html = `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <button onclick="loadAzkar('morning')" class="card">
                <i class="fas fa-sun amber"></i>
                <span>أذكار الصباح</span>
            </button>
            <button onclick="loadAzkar('evening')" class="card">
                <i class="fas fa-moon blue"></i>
                <span>أذكار المساء</span>
            </button>
        </div>
    `;
    showPage(html);
}

function loadAzkar(type) {
    const morning = [
        "آية الكرسي",
        "أصبحنا وأصبح الملك لله",
        "اللهم بك أصبحنا"
    ];

    const evening = [
        "آية الكرسي",
        "أمسينا وأمسى الملك لله",
        "اللهم بك أمسينا"
    ];

    const list = type === "morning" ? morning : evening;

    const html = list.map(z =>
        `<div class="card" style="text-align:right;">${z}</div>`
    ).join("");

    document.getElementById("content-area").innerHTML = html;
}

/* =====================
   القرّاء
===================== */
function openReciters() {
    showPage(`<div class="card">جاري تحميل قائمة القراء...</div>`);

    fetch("https://mp3quran.net/api/v3/reciters?language=ar")
        .then(res => res.json())
        .then(data => {
            const html = data.reciters.slice(0, 30).map(r => `
                <div class="card"
                     style="display:flex; justify-content:space-between; align-items:center;"
                     onclick="playAudio('${r.moshaf[0].server}001.mp3','الشيخ ${r.name}')">
                    <span>${r.name}</span>
                    <i class="fas fa-play-circle emerald"></i>
                </div>
            `).join("");

            document.getElementById("content-area").innerHTML = html;
        })
        .catch(() => {
            document.getElementById("content-area").innerHTML =
                `<div class="card">حدث خطأ أثناء تحميل القراء</div>`;
        });
}
