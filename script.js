const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

// تبديل القائمة الجانبية
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// تبديل الوضع الليلي
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-btn');
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        btn.innerHTML = '<i class="fas fa-sun"></i> الوضع النهاري';
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        btn.innerHTML = '<i class="fas fa-moon"></i> الوضع الليلي';
    }
}

// تشغيل الصوت
function playAudio(url, title) {
    audio.src = url;
    audio.play().then(() => {
        trackTitle.innerText = title;
        playIcon.className = 'fas fa-pause';
        // غلق القائمة الجانبية إذا كانت مفتوحة عند اختيار إذاعة منها
        if (document.getElementById('sidebar').classList.contains('active')) toggleSidebar();
    }).catch(() => {
        trackTitle.innerText = "خطأ في تشغيل المصدر";
    });
}

function togglePlay() {
    if (!audio.src) return;
    if (audio.paused) { audio.play(); playIcon.className = 'fas fa-pause'; }
    else { audio.pause(); playIcon.className = 'fas fa-play'; }
}

function skip(time) { audio.currentTime += time; }

// التحكم في مستوى الصوت
document.getElementById('volControl').oninput = function() {
    audio.volume = this.value;
};

// --- وظائف جلب القراء والسور (الجزء المكمل) ---

const surahNames = ["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];

async function openReciters() {
    showPage("<p class='text-center'>جاري تحميل قائمة القراء...</p>");
    try {
        const res = await fetch('https://mp3quran.net/api/v3/reciters?language=ar');
        const data = await res.json();
        let html = `
            <div class="sticky-nav">
                <button onclick="goHome()" class="back-btn">رجوع</button>
                <span class="font-bold text-xs">اختر القارئ</span>
            </div>`;
        html += data.reciters.slice(0, 50).map(r => `
            <div class="card mb-3 flex justify-between items-center px-4" style="padding:15px" onclick="openSurahs('${r.moshaf[0].server}', '${r.name}', '${r.moshaf[0].surah_list}')">
                <span class="text-xs font-bold">${r.name}</span>
                <i class="fas fa-chevron-left text-gray-400 text-xs"></i>
            </div>
        `).join('');
        document.getElementById('content-area').innerHTML = html;
    } catch (e) { 
        document.getElementById('content-area').innerHTML = "<p class='text-center'>حدث خطأ في الاتصال بالخادم</p>"; 
    }
}

function openSurahs(server, reciterName, list) {
    const sArray = list.split(',');
    let html = `
        <div class="sticky-nav">
            <button onclick="openReciters()" class="back-btn">القراء</button>
            <span class="text-[10px] font-bold">${reciterName}</span>
        </div>
        <div class="menu-grid">`;
    
    sArray.forEach(sNum => {
        const sName = surahNames[parseInt(sNum) - 1];
        const formattedNum = sNum.padStart(3, '0');
        html += `
            <div class="card" onclick="playAudio('${server}${formattedNum}.mp3', '${reciterName} - ${sName}')">
                <span style="font-size:11px">${sName}</span>
            </div>`;
    });
    
    html += `</div>`;
    document.getElementById('content-area').innerHTML = html;
    window.scrollTo(0,0);
}

function openAzkar() {
    let html = `
        <div class="sticky-nav">
            <button onclick="goHome()" class="back-btn">رجوع</button>
            <span class="font-bold text-xs">حصن المسلم</span>
        </div>
        <div class="menu-grid">
            <div class="card" onclick="loadAzkar('morning')">☀️ أذكار الصباح</div>
            <div class="card" onclick="loadAzkar('evening')">🌙 أذكار المساء</div>
        </div>`;
    showPage(html);
}

function loadAzkar(t) {
    const morning = ["آية الكرسي", "أصبحنا وأصبح الملك لله", "اللهم بك أصبحنا", "سيد الاستغفار"];
    const evening = ["آية الكرسي", "أمسينا وأمسى الملك لله", "اللهم بك أمسينا", "أعوذ بكلمات الله التامات"];
    const list = t === 'morning' ? morning : evening;
    
    let html = `<div class="sticky-nav"><button onclick="openAzkar()" class="back-btn">رجوع</button><span>${t=='morning'?'أذكار الصباح':'أذكار المساء'}</span></div>`;
    html += list.map(z => `<div class="card mb-2 text-right text-xs p-4" style="border-right:4px solid #064e3b">${z}</div>`).join('');
    document.getElementById('content-area').innerHTML = html;
}

function showPage(html) {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('sub-view').classList.remove('hidden');
    document.getElementById('content-area').innerHTML = html;
    window.scrollTo(0,0);
}

function goHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('sub-view').classList.add('hidden');
}
