const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

// 1. جلب أوقات الصلاة وتنسيقها في المربع العريض
async function getPrayerTimes() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5');
        const data = await res.json();
        const t = data.data.timings;
        const prayers = [
            {n:"الفجر", t:t.Fajr}, {n:"الظهر", t:t.Dhuhr}, {n:"العصر", t:t.Asr}, {n:"المغرب", t:t.Maghrib}, {n:"العشاء", t:t.Isha}
        ];
        document.getElementById('prayer-times').innerHTML = prayers.map(p => `
            <div class="prayer-item"><span class="prayer-name">${p.n}</span><span class="prayer-time">${p.t}</span></div>
        `).join('');
    } catch (e) { document.getElementById('prayer-times').innerText = "تعذر تحميل المواقيت"; }
}
getPrayerTimes();

// القائمة والوضع الليلي
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('theme-btn').innerHTML = isDark ? '<i class="fas fa-sun"></i> الوضع النهاري' : '<i class="fas fa-moon"></i> الوضع الليلي';
}

// التحكم في الصوت
function playAudio(url, title) {
    audio.src = url;
    audio.play().then(() => {
        trackTitle.innerText = title;
        playIcon.className = 'fas fa-pause';
        if (document.getElementById('sidebar').classList.contains('active')) toggleSidebar();
    });
}
function togglePlay() {
    if (!audio.src) return;
    if (audio.paused) { audio.play(); playIcon.className = 'fas fa-pause'; }
    else { audio.pause(); playIcon.className = 'fas fa-play'; }
}
function skip(t) { audio.currentTime += t; }
document.getElementById('volControl').oninput = function() { audio.volume = this.value; };

// نظام الأذكار والعدادات (مع الحفظ التلقائي)
const morningAzkar = [
    {id:"m1", text:"آية الكرسي: ﴿اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...﴾", count:1},
    {id:"m2", text:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿قُلْ هُوَ اللَّهُ أَحَدٌ...﴾", count:3},
    {id:"m3", text:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...﴾", count:3},
    {id:"m4", text:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ...﴾", count:3},
    {id:"m5", text:"أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ...", count:1}
];

const eveningAzkar = [
    {id:"e1", text:"أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ ﴿اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ...﴾", count:1},
    {id:"e2", text:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿قُلْ هُوَ اللَّهُ أَحَدٌ...﴾", count:3},
    {id:"e3", text:"أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ...", count:1}
];

function openAzkar() {
    showPage(`<div class="sticky-nav"><button onclick="goHome()" class="back-btn">رجوع</button></div>
    <div class="menu-grid">
        <div class="card" onclick="loadAzkar('morning')">☀️ أذكار الصباح</div>
        <div class="card" onclick="loadAzkar('evening')">🌙 أذكار المساء</div>
    </div>`);
}

function loadAzkar(type) {
    const list = type === 'morning' ? morningAzkar : eveningAzkar;
    let html = `<div class="sticky-nav"><button onclick="openAzkar()" class="back-btn">رجوع</button><span class="text-xs font-bold">${type==='morning'?'الصباح':'المساء'}</span></div>`;
    list.forEach(z => {
        let saved = localStorage.getItem(z.id);
        let current = saved !== null ? parseInt(saved) : z.count;
        let done = current === 0;
        html += `<div class="card mb-3 text-right">
            <p class="text-xs mb-4 leading-relaxed">${z.text}</p>
            <div class="flex justify-between items-center">
                <i class="fab fa-whatsapp share-icon" onclick="shareZekr('${z.text}')"></i>
                <button id="${z.id}" onclick="updateCnt('${z.id}')" class="zekr-counter ${done?'completed':''}">
                    ${done ? '✓' : current}
                </button>
            </div>
        </div>`;
    });
    document.getElementById('content-area').innerHTML = html;
}

function updateCnt(id) {
    const btn = document.getElementById(id);
    let val = btn.innerText === '✓' ? 0 : parseInt(btn.innerText);
    if (val > 0) {
        val--;
        btn.innerText = val === 0 ? '✓' : val;
        localStorage.setItem(id, val);
        if (val === 0) btn.classList.add('completed');
    }
}

function shareZekr(t) { window.open(`https://wa.me/?text=${encodeURIComponent(t + " - عبر تطبيق منصة القرآن")}`); }

function showPage(h) {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('sub-view').classList.remove('hidden');
    document.getElementById('content-area').innerHTML = h;
    window.scrollTo(0,0);
}

function goHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('sub-view').classList.add('hidden');
}

// دالة القراء المتبقية (API)
async function openReciters() {
    showPage("<p class='text-center'>جاري التحميل...</p>");
    try {
        const res = await fetch('https://mp3quran.net/api/v3/reciters?language=ar');
        const data = await res.json();
        let html = `<div class="sticky-nav"><button onclick="goHome()" class="back-btn">رجوع</button></div>`;
        html += data.reciters.slice(0, 50).map(r => `
            <div class="card mb-3 flex justify-between items-center" style="padding:15px" onclick="openSurahs('${r.moshaf[0].server}', '${r.name}', '${r.moshaf[0].surah_list}')">
                <span class="text-xs font-bold">${r.name}</span><i class="fas fa-chevron-left text-gray-400"></i>
            </div>
        `).join('');
        document.getElementById('content-area').innerHTML = html;
    } catch(e) { document.getElementById('content-area').innerHTML = "خطأ في الاتصال"; }
}

function openSurahs(server, name, list) {
    const sArray = list.split(',');
    let html = `<div class="sticky-nav"><button onclick="openReciters()" class="back-btn">رجوع</button><span class="text-[10px] font-bold">${name}</span></div><div class="menu-grid">`;
    sArray.forEach(sNum => {
        html += `<div class="card" onclick="playAudio('${server}${sNum.padStart(3, '0')}.mp3', '${name} - سورة ${sNum}')"><span>سورة ${sNum}</span></div>`;
    });
    document.getElementById('content-area').innerHTML = html + "</div>";
    window.scrollTo(0,0);
}