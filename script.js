const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

const surahs = ["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];

const morningAzkar = [
    {text:"آية الكرسي: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لا تَأْخُذُهُ سِنَةٌ وَلا نَوْمٌ", count:1},
    {text:"قُلْ هُوَ اللَّهُ أَحَدٌ (3 مرات)", count:3},
    {text:"قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (3 مرات)", count:3},
    {text:"قُلْ أَعُوذُ بِرَبِّ النَّاسِ (3 مرات)", count:3},
    {text:"أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له", count:1},
    {text:"اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور", count:1},
    {text:"بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء (3 مرات)", count:3},
    {text:"رضيت بالله رباً، وبالإسلام ديناً، وبمحمد صلى الله عليه وسلم نبياً (3 مرات)", count:3}
];

const eveningAzkar = [
    {text:"آية الكرسي: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", count:1},
    {text:"سورة الإخلاص والمعوذتين (3 مرات)", count:3},
    {text:"أمسينا وأمسى الملك لله، والحمد لله", count:1},
    {text:"اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير", count:1},
    {text:"أعوذ بكلمات الله التامات من شر ما خلق (3 مرات)", count:3},
    {text:"يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله", count:1}
];

function format12Hour(timeStr) {
    let [hours, minutes] = timeStr.split(':');
    let period = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12;
    return `${hours}:${minutes}<br><span style="font-size:10px; opacity:0.7">${period}</span>`;
}

async function updatePrayers() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5');
        const data = await res.json();
        const t = data.data.timings;
        const prayerList = [{n:"الفجر",t:t.Fajr},{n:"الظهر",t:t.Dhuhr},{n:"العصر",t:t.Asr},{n:"المغرب",t:t.Maghrib},{n:"العشاء",t:t.Isha}];
        document.getElementById('prayer-times').innerHTML = prayerList.map(p => `<div class="prayer-item"><span class="prayer-name">${p.n}</span><span class="prayer-time">${format12Hour(p.t)}</span></div>`).join('');
        calculateNextPrayer(prayerList);
    } catch (e) { console.error("Prayer Error"); }
}

function calculateNextPrayer(prayers) {
    const now = new Date(); let next = null;
    for (let p of prayers) {
        const [h, m] = p.t.split(':'); const pDate = new Date(); pDate.setHours(h, m, 0);
        if (pDate > now) { next = { n: p.n, t: pDate }; break; }
    }
    if (!next) {
        const [h, m] = prayers[0].t.split(':'); const pDate = new Date(); pDate.setDate(pDate.getDate() + 1); pDate.setHours(h, m, 0);
        next = { n: "الفجر", t: pDate };
    }
    setInterval(() => {
        const diff = next.t.getTime() - new Date().getTime();
        const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('next-prayer-banner').innerHTML = `الصلاة القادمة: <span style="color:#fbbf24">${next.n}</span><br>باقي ${h}:${m}:${s}`;
    }, 1000);
}
updatePrayers();

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('theme-toggle-btn').innerHTML = isDark ? '<i class="fas fa-sun"></i> الوضع النهاري' : '<i class="fas fa-moon"></i> الوضع الليلي';
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
function showPage(html) { document.getElementById('home-view').classList.add('hidden'); document.querySelector('.prayer-section').classList.add('hidden'); document.getElementById('sub-view').classList.remove('hidden'); document.getElementById('content-area').innerHTML = html; }
function goHome() { document.getElementById('home-view').classList.remove('hidden'); document.querySelector('.prayer-section').classList.remove('hidden'); document.getElementById('sub-view').classList.add('hidden'); }

function openRoqia() {
    const roqiaList = [
        { name: "الرقية الشرعية - ماهر المعيقلي", url: "https://docs.google.com/uc?export=download&id=1Gjg99YQEBb5EQvzMQd2OoaAs5JAKQuga" },
        { name: "الرقية الشرعية - مشاري العفاسي", url: "https://docs.google.com/uc?export=download&id=1ra9OWtUyk7kf5jRu2zw1CvbCvzIS283_" }
    ];
    let html = `<div class="sticky-nav"><button onclick="goHome()" class="back-btn"><i class="fas fa-arrow-right"></i> رجوع</button></div><div class="menu-grid">`;
    roqiaList.forEach(r => { html += `<div class="card" onclick="playAudio('${r.url}', '${r.name}')"><i class="fas fa-heart-pulse" style="color:#ef4444"></i><span>${r.name}</span></div>`; });
    showPage(html + "</div>");
}

function openAzkar() { showPage(`<div class="sticky-nav"><button onclick="goHome()" class="back-btn"><i class="fas fa-arrow-right"></i> رجوع</button></div><div class="menu-grid"><div class="card" onclick="loadAzkar('morning')">☀️ أذكار الصباح</div><div class="card" onclick="loadAzkar('evening')">🌙 أذكار المساء</div></div>`); }

function loadAzkar(type) {
    const list = type === 'morning' ? morningAzkar : eveningAzkar;
    let html = `<div class="sticky-nav"><button onclick="openAzkar()" class="back-btn"><i class="fas fa-arrow-right"></i> رجوع</button><span>أذكار ${type==='morning'?'الصباح':'المساء'}</span></div><div style="padding:15px">`;
    list.forEach(z => {
        html += `<div class="card" style="margin-bottom:12px; text-align:right; padding:20px;">
            <p style="font-size:15px; line-height:1.6; margin-bottom:15px">${z.text}</p>
            <button onclick="updateCnt(this, ${z.count})" style="background:var(--header-bg); color:white; border:none; padding:8px 25px; border-radius:10px; font-weight:bold">${z.count}</button>
        </div>`;
    });
    document.getElementById('content-area').innerHTML = html + "</div>";
}

function updateCnt(btn, max) {
    let val = parseInt(btn.innerText);
    if (val > 0) { val--; btn.innerText = val === 0 ? '✓' : val; if(val === 0) btn.style.background = "#fbbf24"; }
}

async function openReciters() {
    showPage("<p class='text-center'>جاري تحميل القراء...</p>");
    const res = await fetch('https://mp3quran.net/api/v3/reciters?language=ar');
    const data = await res.json();
    let html = `<div class="sticky-nav"><button onclick="goHome()" class="back-btn"><i class="fas fa-arrow-right"></i> رجوع</button></div>`;
    html += data.reciters.slice(0, 50).map(r => `<div class="card" style="margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; padding:15px 20px;" onclick="openSurahs('${r.moshaf[0].server}', '${r.name}', '${r.moshaf[0].surah_list}')"><span>${r.name}</span><i class="fas fa-chevron-left"></i></div>`).join('');
    document.getElementById('content-area').innerHTML = html;
}

function openSurahs(server, name, list) {
    const sArray = list.split(',');
    let html = `<div class="sticky-nav"><button onclick="openReciters()" class="back-btn"><i class="fas fa-arrow-right"></i> القراء</button><span>${name}</span></div><div class="menu-grid">`;
    sArray.forEach(sNum => {
        const sName = surahs[parseInt(sNum)-1] || "سورة " + sNum;
        html += `<div class="card" style="padding:15px;" onclick="playAudio('${server}${sNum.padStart(3, '0')}.mp3', '${name} - ${sName}')"><span>${sName}</span></div>`;
    });
    document.getElementById('content-area').innerHTML = html + "</div>";
}

function playAudio(url, title) { audio.src = url; audio.play(); trackTitle.innerText = title; playIcon.className = 'fas fa-pause'; }
function togglePlay() { if(audio.paused) { audio.play(); playIcon.className = 'fas fa-pause'; } else { audio.pause(); playIcon.className = 'fas fa-play'; } }
function skip(t) { audio.currentTime += t; }
document.getElementById('volControl').oninput = function() { audio.volume = this.value; };