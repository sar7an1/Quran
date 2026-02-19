const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

// الأذكار كاملة
const azkarData = {
    morning: [
        {text:"آية الكرسي", count:1},
        {text:"سورة الإخلاص (3 مرات)", count:3},
        {text:"سورة الفلق (3 مرات)", count:3},
        {text:"سورة الناس (3 مرات)", count:3},
        {text:"أصبحنا وأصبح الملك لله", count:1},
        {text:"بسم الله الذي لا يضر مع اسمه شيء (3)", count:3},
        {text:"رضيت بالله رباً وبالإسلام ديناً (3)", count:3}
    ],
    evening: [
        {text:"آية الكرسي", count:1},
        {text:"سورة الإخلاص والمعوذتين (3 مرات)", count:3},
        {text:"أعوذ بكلمات الله التامات من شر ما خلق (3)", count:3},
        {text:"أمسينا وأمسى الملك لله", count:1}
    ]
};

// فتح صفحة الرقية
function openRoqia() {
    let html = `<div class="sticky-nav"><button onclick="goHome()" class="back-btn">رجوع</button><span>الرقية الشرعية</span></div>
    <div class="menu-grid">
        <div class="card" onclick="playAudio('https://server12.mp3quran.net/maher/115.mp3', 'رقية ماهر المعيقلي')"><i class="fas fa-heart-pulse" style="color:#ef4444"></i><span>ماهر المعيقلي</span></div>
        <div class="card" onclick="playAudio('https://server8.mp3quran.net/afs/115.mp3', 'رقية مشاري العفاسي')"><i class="fas fa-heart-pulse" style="color:#ef4444"></i><span>مشاري العفاسي</span></div>
    </div>`;
    showPage(html);
}

function playAudio(url, title) {
    audio.src = url;
    audio.play();
    trackTitle.innerText = title;
    playIcon.className = 'fas fa-pause';
}

function togglePlay() {
    if(audio.paused) { audio.play(); playIcon.className = 'fas fa-pause'; }
    else { audio.pause(); playIcon.className = 'fas fa-play'; }
}

function showPage(html) {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('sub-view').classList.remove('hidden');
    document.getElementById('content-area').innerHTML = html;
}

function goHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('sub-view').classList.add('hidden');
}

function openAzkar() {
    showPage(`<div class="sticky-nav"><button onclick="goHome()" class="back-btn">رجوع</button></div>
    <div class="menu-grid"><div class="card" onclick="loadAzkar('morning')">☀️ أذكار الصباح</div><div class="card" onclick="loadAzkar('evening')">🌙 أذكار المساء</div></div>`);
}

function loadAzkar(type) {
    const list = azkarData[type];
    let html = `<div class="sticky-nav"><button onclick="openAzkar()" class="back-btn">رجوع</button><span>أذكار ${type==='morning'?'الصباح':'المساء'}</span></div><div style="padding:15px">`;
    list.forEach(z => {
        html += `<div class="card" style="margin-bottom:15px; text-align:right; padding:20px; width:90%; margin-right:auto; margin-left:auto;">
            <p style="font-size:16px; line-height:1.6; margin-bottom:15px">${z.text}</p>
            <button onclick="updateCnt(this)" style="background:var(--main); color:white; border:none; padding:10px 30px; border-radius:10px; font-weight:bold">${z.count}</button>
        </div>`;
    });
    document.getElementById('content-area').innerHTML = html + "</div>";
}

function updateCnt(btn) {
    let val = parseInt(btn.innerText);
    if (val > 0) { val--; btn.innerText = val === 0 ? '✓' : val; if(val===0) btn.style.background="#fbbf24"; }
}

function skip(t) { audio.currentTime += t; }
