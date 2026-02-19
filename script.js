const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

// تحويل الوقت لنظام 12 ساعة
function format12Hour(timeStr) {
    let [hours, minutes] = timeStr.split(':');
    let period = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
}

// تحديث أوقات الصلاة والعداد
async function updatePrayers() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5');
        const data = await res.json();
        const t = data.data.timings;
        const prayerList = [
            { n: "الفجر", time: t.Fajr }, { n: "الظهر", time: t.Dhuhr },
            { n: "العصر", time: t.Asr }, { n: "المغرب", time: t.Maghrib }, { n: "العشاء", time: t.Isha }
        ];

        document.getElementById('prayer-times').innerHTML = prayerList.map(p => `
            <div class="prayer-item">
                <span class="prayer-name">${p.n}</span>
                <span class="prayer-time">${format12Hour(p.time)}</span>
            </div>
        `).join('');

        calculateNextPrayer(prayerList);
    } catch (e) { console.error("Prayer Error"); }
}

function calculateNextPrayer(prayers) {
    const now = new Date();
    let next = null;
    for (let p of prayers) {
        const [h, m] = p.time.split(':');
        const pDate = new Date(); pDate.setHours(h, m, 0);
        if (pDate > now) { next = { n: p.n, t: pDate }; break; }
    }
    if (!next) {
        const [h, m] = prayers[0].time.split(':');
        const pDate = new Date(); pDate.setDate(pDate.getDate() + 1); pDate.setHours(h, m, 0);
        next = { n: "الفجر", t: pDate };
    }
    
    // عداد الوقت المتبقي
    setInterval(() => {
        const diff = next.t.getTime() - new Date().getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('next-prayer-banner').innerHTML = 
            `الصلاة القادمة: <span style="color:#fbbf24">${next.n}</span><br>المتبقي ${h}:${m}:${s}`;
    }, 1000);
}

updatePrayers();

// تحكم الظهور والإخفاء (إظهار الصلاة في الرئيسية فقط)
function showPage(html) {
    document.getElementById('home-view').classList.add('hidden');
    document.querySelector('.prayer-section').classList.add('hidden'); 
    document.getElementById('sub-view').classList.remove('hidden');
    document.getElementById('content-area').innerHTML = html;
    window.scrollTo(0,0);
}

function goHome() { 
    document.getElementById('home-view').classList.remove('hidden'); 
    document.querySelector('.prayer-section').classList.remove('hidden'); 
    document.getElementById('sub-view').classList.add('hidden'); 
}

// القائمة والوظائف
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }

function openAzkar() {
    showPage(`<div class="sticky-nav">
        <button onclick="goHome()" class="back-btn"><i class="fas fa-arrow-right"></i> رجوع</button>
    </div>
    <div class="menu-grid" style="padding:15px">
        <div class="card" onclick="loadAzkar('morning')">☀️ أذكار الصباح</div>
        <div class="card" onclick="loadAzkar('evening')">🌙 أذكار المساء</div>
    </div>`);
}

async function openReciters() {
    showPage("<p class='text-center'>جاري تحميل القراء...</p>");
    try {
        const res = await fetch('https://mp3quran.net/api/v3/reciters?language=ar');
        const data = await res.json();
        let html = `<div class="sticky-nav"><button onclick="goHome()" class="back-btn"><i class="fas fa-arrow-right"></i> رجوع</button></div>`;
        html += data.reciters.slice(0, 50).map(r => `
            <div class="card mb-3 flex justify-between items-center" style="padding:15px; text-align:right;" onclick="openSurahs('${r.moshaf[0].server}', '${r.name}', '${r.moshaf[0].surah_list}')">
                <span class="font-bold">${r.name}</span><i class="fas fa-chevron-left"></i>
            </div>
        `).join('');
        document.getElementById('content-area').innerHTML = html;
    } catch(e) { document.getElementById('content-area').innerHTML = "خطأ في الاتصال"; }
}

function openSurahs(server, name, list) {
    const sArray = list.split(',');
    let html = `<div class="sticky-nav"><button onclick="openReciters()" class="back-btn"><i class="fas fa-arrow-right"></i> القراء</button></div><div class="menu-grid" style="padding:10px">`;
    sArray.forEach(sNum => {
        html += `<div class="card" style="padding:15px;" onclick="playAudio('${server}${sNum.padStart(3, '0')}.mp3', '${name} - سورة ${sNum}')"><span>سورة ${sNum}</span></div>`;
    });
    document.getElementById('content-area').innerHTML = html + "</div>";
    window.scrollTo(0,0);
}

function playAudio(url, title) {
    audio.src = url;
    audio.play().then(() => {
        trackTitle.innerText = title;
        playIcon.className = 'fas fa-pause';
        if(document.getElementById('sidebar').classList.contains('active')) toggleSidebar();
    });
}

function togglePlay() {
    if(!audio.src) return;
    if(audio.paused) { audio.play(); playIcon.className = 'fas fa-pause'; }
    else { audio.pause(); playIcon.className = 'fas fa-play'; }
}

function skip(t) { audio.currentTime += t; }
document.getElementById('volControl').oninput = function() { audio.volume = this.value; };

// الوضع الليلي
function toggleTheme() {
    // الوضع حاليا مظلم افتراضي، هذه الدالة للتبديل إذا رغبت مستقبلاً
    alert("أنت حالياً في الوضع المفضل للمنصة");
}
