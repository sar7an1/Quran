const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

// الأذكار كاملة
const morningAzkar = [
    {text:"آية الكرسي: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", count:1},
    {text:"سورة الإخلاص (3 مرات)", count:3},
    {text:"سورة الفلق (3 مرات)", count:3},
    {text:"سورة الناس (3 مرات)", count:3},
    {text:"أصبحنا وأصبح الملك لله والحمد لله", count:1},
    {text:"بسم الله الذي لا يضر مع اسمه شيء (3 مرات)", count:3},
    {text:"اللهم بك أصبحنا وبك أمسينا (1)", count:1},
    {text:"رضيت بالله رباً وبالإسلام ديناً (3)", count:3}
];

const eveningAzkar = [
    {text:"آية الكرسي", count:1},
    {text:"سورة الإخلاص والمعوذتين (3 مرات)", count:3},
    {text:"أعوذ بكلمات الله التامات من شر ما خلق (3)", count:3},
    {text:"اللهم بك أمسينا وبك أصبحنا (1)", count:1}
];

// الرقية الشرعية بروابط مباشرة تعمل فوراً
function openRoqia() {
    const roqiaList = [
        { name: "الرقية الشرعية - ماهر المعيقلي", url: "https://server12.mp3quran.net/maher/115.mp3" },
        { name: "الرقية الشرعية - مشاري العفاسي", url: "https://server8.mp3quran.net/afs/115.mp3" }
    ];
    let html = `<div class="sticky-nav"><button onclick="goHome()" class="back-btn">رجوع</button><span>الرقية الشرعية</span></div><div class="menu-grid">`;
    roqiaList.forEach(r => {
        html += `<div class="card" onclick="playAudio('${r.url}', '${r.name}')"><i class="fas fa-heart"></i><span>${r.name}</span></div>`;
    });
    showPage(html + "</div>");
}

function playAudio(url, title) {
    audio.src = url;
    audio.play().catch(() => alert("يرجى الضغط على زر التشغيل"));
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
    const list = type === 'morning' ? morningAzkar : eveningAzkar;
    let html = `<div class="sticky-nav"><button onclick="openAzkar()" class="back-btn">رجوع</button><span>أذكار ${type==='morning'?'الصباح':'المساء'}</span></div><div style="padding:10px">`;
    list.forEach(z => {
        html += `<div class="card" style="margin-bottom:10px; text-align:right; padding:15px; grid-column: span 2;">
            <p style="font-size:14px; line-height:1.6;">${z.text}</p>
            <button onclick="updateCnt(this)" style="background:var(--main-green); color:white; border:none; padding:5px 20px; border-radius:5px;">${z.count}</button>
        </div>`;
    });
    document.getElementById('content-area').innerHTML = html + "</div>";
}

function updateCnt(btn) {
    let val = parseInt(btn.innerText);
    if (val > 0) { val--; btn.innerText = val === 0 ? '✓' : val; if(val===0) btn.style.background="#fbbf24"; }
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
function skip(t) { audio.currentTime += t; }