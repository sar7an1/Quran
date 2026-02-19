const audio = document.getElementById('main-audio');
const playIcon = document.getElementById('play-icon');
const trackTitle = document.getElementById('track-title');

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

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

function playAudio(url, title) {
    audio.src = url;
    audio.play().then(() => {
        trackTitle.innerText = title;
        playIcon.className = 'fas fa-pause';
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

document.getElementById('volControl').oninput = function() {
    audio.volume = this.value;
};

// ... (باقي الوظائف للقراء والسور والأذكار كما هي من الأكواد السابقة لضمان عملها) ...
