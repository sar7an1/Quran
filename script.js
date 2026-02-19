const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

const surahNames = ["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];

// تشغيل الصوت
function playAudio(url, title) {
    audio.src = url;
    audio.play().then(() => {
        trackTitle.innerText = title;
        playIcon.className = 'fas fa-pause';
    }).catch(() => {
        trackTitle.innerText = "خطأ: جرب مرة أخرى";
    });
}

function togglePlay() {
    if (!audio.src) return;
    if (audio.paused) { audio.play(); playIcon.className = 'fas fa-pause'; }
    else { audio.pause(); playIcon.className = 'fas fa-play'; }
}

function skip(time) { audio.currentTime += time; }

document.getElementById('volControl').oninput = function() { audio.volume = this.value; };

// وظائف التنقل
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

// القراء والسور
async function openReciters() {
    showPage("<p class='text-center'>جاري جلب القراء...</p>");
    try {
        const res = await fetch('https://mp3quran.net/api/v3/reciters?language=ar');
        const data = await res.json();
        
        let html = `
            <div class="sticky-nav">
                <button onclick="goHome()" class="back-btn">رجوع للرئيسية</button>
                <span class="text-xs font-bold">اختر القارئ</span>
            </div>
            <div class="reciters-list">`;
        
        html += data.reciters.slice(0, 60).map(r => `
            <div class="card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:15px;" 
                 onclick="openSurahs('${r.moshaf[0].server}', '${r.name}', '${r.moshaf[0].surah_list}')">
                <span class="text-xs">الشيخ ${r.name}</span>
                <i class="fas fa-chevron-left text-gray-300"></i>
            </div>
        `).join('') + `</div>`;
        showPage(html);
    } catch (e) { showPage("<p>تعذر التحميل</p>"); }
}

function openSurahs(server, name, list) {
    const sArray = list.split(',');
    let html = `
        <div class="sticky-nav">
            <button onclick="openReciters()" class="back-btn" style="background:#444">العودة للقراء</button>
            <span class="text-[10px] font-bold">${name}</span>
        </div>
        <div class="surah-grid">`;
    
    sArray.forEach(sNum => {
        const formattedNum = sNum.padStart(3, '0');
        const sName = surahNames[parseInt(sNum) - 1];
        html += `<div class="surah-item" onclick="playAudio('${server}${formattedNum}.mp3', '${name} - ${sName}')">${sName}</div>`;
    });
    
    html += `</div>`;
    document.getElementById('content-area').innerHTML = html;
    window.scrollTo(0,0);
}

// الأذكار
function openAzkar() {
    let html = `
        <div class="sticky-nav">
            <button onclick="goHome()" class="back-btn">رجوع</button>
            <span class="font-bold">حصن المسلم</span>
        </div>
        <div class="menu-grid">
            <div class="card" onclick="loadAzkar('morning')" style="background:#fff7ed; border-color:#f97316;">☀️ صباح</div>
            <div class="card" onclick="loadAzkar('evening')" style="background:#eef2ff; border-color:#6366f1;">🌙 مساء</div>
        </div>`;
    showPage(html);
}

function loadAzkar(t) {
    const list = t === 'morning' ? ["آية الكرسي", "أصبحنا وأصبح الملك لله", "اللهم بك أصبحنا"] : ["آية الكرسي", "أمسينا وأمسى الملك لله", "اللهم بك أمسينا"];
    let html = `
        <div class="sticky-nav">
            <button onclick="openAzkar()" class="back-btn">الأذكار</button>
            <span class="text-xs font-bold">${t === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}</span>
        </div>`;
    html += list.map(z => `<div class="card" style="margin-bottom:10px; text-align:right; font-size:13px;">${z}</div>`).join('');
    document.getElementById('content-area').innerHTML = html;
}
