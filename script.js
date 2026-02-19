const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

// تشغيل الصوت
function playAudio(url, title) {
    audio.src = url;
    audio.play().then(() => {
        trackTitle.innerText = title;
        playIcon.className = 'fas fa-pause';
    }).catch(err => console.log("خطأ في التشغيل"));
}

function togglePlay() {
    if (!audio.src) return;
    if (audio.paused) { audio.play(); playIcon.className = 'fas fa-pause'; }
    else { audio.pause(); playIcon.className = 'fas fa-play'; }
}

function skip(seconds) { audio.currentTime += seconds; }

document.getElementById('volControl').oninput = function() { audio.volume = this.value; };

// نظام التنقل
function showView(html) {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('sub-view').classList.remove('hidden');
    document.getElementById('content-area').innerHTML = html;
    window.scrollTo(0,0);
}

function goHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('sub-view').classList.add('hidden');
}

// فتح قائمة القراء
async function openReciters() {
    const contentArea = document.getElementById('content-area');
    showView("<p class='text-center'>جاري تحميل القراء...</p>");
    
    try {
        const res = await fetch('https://mp3quran.net/api/v3/reciters?language=ar');
        const data = await res.json();
        
        let html = `<div class="sticky-nav">
                        <button onclick="goHome()" class="back-btn" style="margin-bottom:0"> <i class="fas fa-arrow-right"></i> رجوع</button>
                        <span class="font-bold text-emerald-900">اختر القارئ</span>
                    </div>
                    <div style="margin-top:15px">`;
        
        html += data.reciters.slice(0, 50).map(r => `
            <div class="card" style="display:flex; justify-content:space-between; margin-bottom:10px; align-items:center;" 
                 onclick="openSurahs('${r.moshaf[0].server}', '${r.name}', '${r.moshaf[0].surah_list}')">
                <span>الشيخ ${r.name}</span>
                <i class="fas fa-chevron-left text-gray-400"></i>
            </div>
        `).join('') + `</div>`;
        
        document.getElementById('content-area').innerHTML = html;
    } catch (e) {
        document.getElementById('content-area').innerHTML = "حدث خطأ في الاتصال";
    }
}

// فتح قائمة السور للشيخ المختار
function openSurahs(serverUrl, reciterName, surahList) {
    const surahs = surahList.split(','); // تحويل نص السور إلى مصفوفة
    
    let html = `<div class="sticky-nav">
                    <button onclick="openReciters()" class="back-btn" style="margin-bottom:0; background:#444"> <i class="fas fa-arrow-right"></i> القراء</button>
                    <span class="font-bold text-xs">${reciterName}</span>
                </div>
                <div class="surah-grid">`;

    // أسماء السور مرتبة
    const surahNames = ["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];

    surahs.forEach(s => {
        let sNumber = s.padStart(3, '0'); // تحويل رقم السورة لشكل 001
        let sName = surahNames[parseInt(s) - 1];
        html += `<div class="surah-card" onclick="playAudio('${serverUrl}${sNumber}.mp3', '${reciterName} - ${sName}')">
                    ${sName}
                 </div>`;
    });

    html += `</div>`;
    document.getElementById('content-area').innerHTML = html;
    window.scrollTo(0,0);
}

// وظائف الأذكار
function openAzkar() {
    let html = `<div class="sticky-nav">
                    <button onclick="goHome()" class="back-btn" style="margin-bottom:0"> <i class="fas fa-arrow-right"></i> رجوع</button>
                    <span class="font-bold">الأذكار</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:15px;">
                    <button onclick="loadAzkar('morning')" class="card" style="background:#fff7ed; border-right-color:#f97316;">☀️ أذكار الصباح</button>
                    <button onclick="loadAzkar('evening')" class="card" style="background:#eef2ff; border-right-color:#6366f1;">🌙 أذكار المساء</button>
                </div>`;
    showView(html);
}

function loadAzkar(type) {
    const morning = ["آية الكرسي", "أصبحنا وأصبح الملك لله", "اللهم بك أصبحنا", "سيد الاستغفار", "يا حي يا قيوم"];
    const evening = ["آية الكرسي", "أمسينا وأمسى الملك لله", "اللهم بك أمسينا", "أعوذ بكلمات الله التامات", "اللهم ما أمسى بي من نعمة"];
    const list = type === 'morning' ? morning : evening;
    
    let html = `<div class="sticky-nav">
                    <button onclick="openAzkar()" class="back-btn" style="margin-bottom:0"> <i class="fas fa-arrow-right"></i> الأذكار</button>
                    <span class="font-bold">${type === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}</span>
                </div>
                <div style="margin-top:15px">`;
    html += list.map(z => `<div class="card" style="margin-bottom:10px; text-align:right; font-size:14px; line-height:1.6">${z}</div>`).join('') + `</div>`;
    
    document.getElementById('content-area').innerHTML = html;
    window.scrollTo(0,0);
}
