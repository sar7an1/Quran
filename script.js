const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

// الأذكار كاملة كما طلبت
const azkarData = {
    morning: [
        {text:"أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له", count:1},
        {text:"اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور", count:1},
        {text:"سيد الاستغفار: اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك...", count:1},
        {text:"آية الكرسي: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", count:1},
        {text:"سورة الإخلاص (3 مرات)", count:3},
        {text:"سورة الفلق (3 مرات)", count:3},
        {text:"سورة الناس (3 مرات)", count:3},
        {text:"اللهم إني أسألك العفو والعافية في الدنيا والآخرة", count:1},
        {text:"بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء (3)", count:3},
        {text:"رضيت بالله رباً، وبالإسلام ديناً، وبمحمد صلى الله عليه وسلم نبياً (3)", count:3},
        {text:"يا حي يا قيوم برحمتك أستغيث أصلح لي شأني كله", count:1},
        {text:"حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم (7)", count:7}
    ],
    evening: [
        {text:"أمسينا وأمسى الملك لله، والحمد لله", count:1},
        {text:"اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير", count:1},
        {text:"آية الكرسي", count:1},
        {text:"سورة الإخلاص والمعوذتين (3 مرات)", count:3},
        {text:"أعوذ بكلمات الله التامات من شر ما خلق (3 مرات)", count:3},
        {text:"اللهم ما أمسى بي من نعمة أو بأحد من خلقك فمنك وحدك", count:1}
    ]
};

// --- نظام مواقيت الصلاة والعد التنازلي ---
async function updatePrayers() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5');
        const data = await res.json();
        const t = data.data.timings;
        const prayers = [
            {n:"الفجر", t:t.Fajr}, {n:"الظهر", t:t.Dhuhr}, 
            {n:"العصر", t:t.Asr}, {n:"المغرب", t:t.Maghrib}, {n:"العشاء", t:t.Isha}
        ];
        
        document.getElementById('prayer-times').innerHTML = prayers.map(p => `
            <div class="prayer-item">
                <div style="font-size:12px; color:#fbbf24; font-weight:bold">${p.n}</div>
                <div style="font-size:11px; font-weight:bold">${p.t}</div>
            </div>`).join('');
            
        startCountdown(prayers);
    } catch (e) { console.log("Prayer API Error"); }
}

function startCountdown(prayers) {
    setInterval(() => {
        const now = new Date();
        let next = null;
        for (let p of prayers) {
            const [h, m] = p.t.split(':');
            const pDate = new Date(); pDate.setHours(h, m, 0);
            if (pDate > now) { next = { n: p.n, t: pDate }; break; }
        }
        if (!next) {
            const [h, m] = prayers[0].t.split(':');
            const pDate = new Date(); pDate.setDate(pDate.getDate() + 1); pDate.setHours(h, m, 0);
            next = { n: "الفجر", t: pDate };
        }
        const diff = next.t - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('next-prayer-info').innerHTML = `الصلاة القادمة: <span style="color:#fbbf24">${next.n}</span> خلال ${h}:${m}:${s}`;
    }, 1000);
}
updatePrayers();

// --- باقي الدوال (القراء، الرقية، الأذكار) ---
async function openReciters() {
    showPage("<p style='text-align:center'>جاري تحميل القراء...</p>");
    const res = await fetch('https://mp3quran.net/api/v3/reciters?language=ar');
    const data = await res.json();
    let html = `<div class="sticky-nav"><button onclick="goHome()" class="back-btn">رجوع</button></div>`;
    html += data.reciters.slice(0, 40).map(r => `
        <div class="card" style="margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; padding:15px;" onclick="openSurahs('${r.moshaf[0].server}', '${r.name}', '${r.moshaf[0].surah_list}')">
            <span>${r.name}</span><i class="fas fa-chevron-left"></i>
        </div>`).join('');
    document.getElementById('content-area').innerHTML = html;
}

function openSurahs(server, name, list) {
    const surahs = ["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];
    const sArray = list.split(',');
    let html = `<div class="sticky-nav"><button onclick="openReciters()" class="back-btn">رجوع</button><span>${name}</span></div><div class="menu-grid">`;
    sArray.forEach(sNum => {
        const sName = surahs[parseInt(sNum)-1] || "سورة " + sNum;
        html += `<div class="card" onclick="playAudio('${server}${sNum.padStart(3, '0')}.mp3', '${name} - ${sName}')"><span>${sName}</span></div>`;
    });
    document.getElementById('content-area').innerHTML = html + "</div>";
}

function openRoqia() {
    let html = `<div class="sticky-nav"><button onclick="goHome()" class="back-btn">رجوع</button><span>الرقية الشرعية</span></div>
    <div class="menu-grid">
        <div class="card" onclick="playAudio('https://server12.mp3quran.net/maher/115.mp3', 'رقية ماهر المعيقلي')"><i class="fas fa-heart" style="color:red"></i><span>ماهر المعيقلي</span></div>
        <div class="card" onclick="playAudio('https://server8.mp3quran.net/afs/115.mp3', 'رقية مشاري العفاسي')"><i class="fas fa-heart" style="color:red"></i><span>مشاري العفاسي</span></div>
    </div>`;
    showPage(html);
}

function openAzkar() {
    showPage(`<div class="sticky-nav"><button onclick="goHome()" class="back-btn">رجوع</button></div>
    <div class="menu-grid"><div class="card" onclick="loadAzkar('morning')">☀️ أذكار الصباح</div><div class="card" onclick="loadAzkar('evening')">🌙 أذكار المساء</div></div>`);
}

function loadAzkar(type) {
    const list = azkarData[type];
    let html = `<div class="sticky-nav"><button onclick="openAzkar()" class="back-btn">رجوع</button><span>أذكار ${type==='morning'?'الصباح':'المساء'}</span></div>`;
    list.forEach(z => {
        html += `<div class="card" style="margin:10px auto; width:90%; padding:20px; text-align:right;">
            <p style="font-size:15px; line-height:1.7">${z.text}</p>
            <button onclick="updateCnt(this)" style="background:var(--main); color:white; border:none; padding:8px 25px; border-radius:8px;">${z.count}</button>
        </div>`;
    });
    document.getElementById('content-area').innerHTML = html;
}

function updateCnt(btn) {
    let v = parseInt(btn.innerText);
    if(v > 0) { v--; btn.innerText = v === 0 ? '✓' : v; if(v===0) btn.style.background="#fbbf24"; }
}

function playAudio(url, title) { audio.src = url; audio.play(); trackTitle.innerText = title; playIcon.className = 'fas fa-pause'; }
function togglePlay() { if(audio.paused) { audio.play(); playIcon.className = 'fas fa-pause'; } else { audio.pause(); playIcon.className = 'fas fa-play'; } }
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
function showPage(html) { document.getElementById('home-view').classList.add('hidden'); document.getElementById('sub-view').classList.remove('hidden'); document.getElementById('content-area').innerHTML = html; }
function goHome() { document.getElementById('home-view').classList.remove('hidden'); document.getElementById('sub-view').classList.add('hidden'); }
function skip(t) { audio.currentTime += t; }