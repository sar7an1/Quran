const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

// مواقيت الصلاة
async function updatePrayers() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5');
        const data = await res.json();
        const t = data.data.timings;
        const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
        const names = ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"];
        
        document.getElementById('prayer-times').innerHTML = prayers.map((p, i) => `
            <div class="prayer-item">
                <div>${names[i]}</div>
                <div>${t[p]}</div>
            </div>`).join('');
    } catch (e) { console.error("API Error"); }
}
updatePrayers();

// الرقية الشرعية
function openRoqia() {
    let html = `<div class="sticky-nav"><button onclick="goHome()" style="background:var(--accent); border:none; padding:5px 15px; border-radius:8px; font-weight:bold;">رجوع</button><span>الرقية الشرعية</span></div>
    <div class="menu-grid">
        <div class="card" onclick="playAudio('https://server12.mp3quran.net/maher/115.mp3', 'رقية ماهر المعيقلي')"><i class="fas fa-heart" style="color:red"></i><span>ماهر المعيقلي</span></div>
        <div class="card" onclick="playAudio('https://server8.mp3quran.net/afs/115.mp3', 'رقية مشاري العفاسي')"><i class="fas fa-heart" style="color:red"></i><span>مشاري العفاسي</span></div>
    </div>`;
    showPage(html);
}

// الأذكار
const azkar = {
    morning: [{t:"آية الكرسي", c:1}, {t:"الإخلاص (3)", c:3}, {t:"الفلق (3)", c:3}, {t:"الناس (3)", c:3}],
    evening: [{t:"آية الكرسي", c:1}, {t:"المعوذات (3)", c:3}, {t:"أعوذ بكلمات الله التامات (3)", c:3}]
};

function openAzkar() {
    showPage(`<div class="sticky-nav"><button onclick="goHome()" style="background:var(--accent); border:none; padding:5px 15px; border-radius:8px; font-weight:bold;">رجوع</button></div>
    <div class="menu-grid"><div class="card" onclick="loadAzkar('morning')">☀️ أذكار الصباح</div><div class="card" onclick="loadAzkar('evening')">🌙 أذكار المساء</div></div>`);
}

function loadAzkar(type) {
    let html = `<div class="sticky-nav"><button onclick="openAzkar()" style="background:var(--accent); border:none; padding:5px 15px; border-radius:8px; font-weight:bold;">رجوع</button></div>`;
    azkar[type].forEach(z => {
        html += `<div class="card" style="margin:10px auto; width:85%;"><p>${z.t}</p><button onclick="updateCnt(this)" style="background:var(--main); color:white; border:none; padding:5px 20px; border-radius:5px;">${z.c}</button></div>`;
    });
    document.getElementById('content-area').innerHTML = html;
}

function updateCnt(btn) { let v = parseInt(btn.innerText); if(v > 0) btn.innerText = --v === 0 ? '✓' : v; }

// وظائف عامة
function playAudio(url, title) { audio.src = url; audio.play(); trackTitle.innerText = title; playIcon.className = 'fas fa-pause'; }
function togglePlay() { if(audio.paused) { audio.play(); playIcon.className = 'fas fa-pause'; } else { audio.pause(); playIcon.className = 'fas fa-play'; } }
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
function showPage(html) { document.getElementById('home-view').classList.add('hidden'); document.getElementById('sub-view').classList.remove('hidden'); document.getElementById('content-area').innerHTML = html; }
function goHome() { document.getElementById('home-view').classList.remove('hidden'); document.getElementById('sub-view').classList.add('hidden'); }
function skip(t) { audio.currentTime += t; }