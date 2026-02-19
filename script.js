const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

// وظيفة تشغيل الصوت
function playAudio(url, title) {
    audio.src = url;
    audio.play().then(() => {
        trackTitle.innerText = title;
        playIcon.className = 'fas fa-pause';
    }).catch(err => {
        alert("برجاء الضغط على زر التشغيل");
    });
}

// تشغيل / إيقاف
function togglePlay() {
    if (!audio.src) return;
    if (audio.paused) {
        audio.play();
        playIcon.className = 'fas fa-pause';
    } else {
        audio.pause();
        playIcon.className = 'fas fa-play';
    }
}

// تقديم وتأخير
function skip(seconds) {
    audio.currentTime += seconds;
}

// التحكم بالصوت
document.getElementById('volControl').oninput = function() {
    audio.volume = this.value;
};

// التنقل بين الصفحات
function showPage(html) {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('sub-view').classList.remove('hidden');
    document.getElementById('content-area').innerHTML = html;
}

function goHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('sub-view').classList.add('hidden');
}

// فتح الأذكار
function openAzkar() {
    const html = `
        <div class="azkar-btns" style="display:flex; flex-direction:column; gap:10px;">
            <button onclick="loadAzkar('morning')" style="background:#fff7ed; padding:20px; border-radius:10px; font-weight:bold; border-right:5px solid #f97316;">☀️ أذكار الصباح</button>
            <button onclick="loadAzkar('evening')" style="background:#eef2ff; padding:20px; border-radius:10px; font-weight:bold; border-right:5px solid #6366f1;">🌙 أذكار المساء</button>
        </div>
    `;
    showPage(html);
}

function loadAzkar(type) {
    const morning = ["آية الكرسي", "أصبحنا وأصبح الملك لله", "اللهم بك أصبحنا"];
    const evening = ["آية الكرسي", "أمسينا وأمسى الملك لله", "اللهم بك أمسينا"];
    const list = type === 'morning' ? morning : evening;
    let html = list.map(z => `<div class="card" style="margin-bottom:10px; text-align:right;">${z}</div>`).join('');
    document.getElementById('content-area').innerHTML = html;
}

// فتح القراء
function openReciters() {
    document.getElementById('content-area').innerHTML = "جاري تحميل قائمة القراء...";
    fetch('https://mp3quran.net/api/v3/reciters?language=ar')
    .then(r => r.json())
    .then(data => {
        let html = data.reciters.slice(0, 30).map(r => `
            <div class="card" style="display:flex; justify-content:space-between; margin-bottom:10px; align-items:center;" onclick="playAudio('${r.moshaf[0].server}001.mp3', 'الشيخ ${r.name}')">
                <span>${r.name}</span> <i class="fas fa-play-circle emerald"></i>
            </div>
        `).join('');
        document.getElementById('content-area').innerHTML = html;
    });
    showPage(""); // فقط لتفعيل الواجهة
}
