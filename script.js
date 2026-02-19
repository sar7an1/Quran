const audio = document.getElementById("main-audio");
const playIcon = document.getElementById("play-icon");
const trackTitle = document.getElementById("track-title");
const volControl = document.getElementById("volControl");

let isLive = false;

/* تشغيل صوت */
function playAudio(url, title){
    isLive = url.includes("radio") || url.includes("radiojar");

    audio.pause();
    audio.currentTime = 0;
    audio.src = url;

    audio.play().then(()=>{
        trackTitle.innerText = title;
        playIcon.className = "fas fa-pause";
    }).catch(()=>{
        alert("اضغط تشغيل للسماح بالصوت");
    });
}

/* تشغيل / إيقاف */
function togglePlay(){
    if(!audio.src) return;

    if(audio.paused){
        audio.play();
        playIcon.className = "fas fa-pause";
    }else{
        audio.pause();
        playIcon.className = "fas fa-play";
    }
}

/* تقديم وتأخير */
function skip(sec){
    if(isLive) return;
    audio.currentTime += sec;
}

/* الصوت */
volControl.oninput = function(){
    audio.volume = this.value;
};

/* عند الانتهاء */
audio.onended = function(){
    playIcon.className = "fas fa-play";
};

/* صفحات */
function openReciters(){
    document.getElementById("sub-view").classList.remove("hidden");
    document.getElementById("content-area").innerHTML =
        "<div class='card'>سيتم إضافة القراء قريبًا إن شاء الله</div>";
}

function openAzkar(){
    document.getElementById("sub-view").classList.remove("hidden");
    document.getElementById("content-area").innerHTML =
        "<div class='card'>سيتم إضافة الأذكار قريبًا إن شاء الله</div>";
}

function goHome(){
    document.getElementById("sub-view").classList.add("hidden");
}
