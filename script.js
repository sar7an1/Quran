const audio = document.getElementById("main-audio");
const playIcon = document.getElementById("play-icon");
const trackTitle = document.getElementById("track-title");
const volControl = document.getElementById("volControl");

function playAudio(url, title){
    audio.src = url;
    audio.play().then(()=>{
        trackTitle.innerText = title;
        playIcon.className = "fas fa-pause";
    }).catch(()=>{
        alert("اضغط تشغيل للسماح بالصوت");
    });
}

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

function skip(sec){
    audio.currentTime += sec;
}

volControl.oninput = function(){
    audio.volume = this.value;
};

audio.onended = function(){
    playIcon.className = "fas fa-play";
};

function openReciters(){
    document.getElementById("sub-view").classList.remove("hidden");
    document.getElementById("content-area").innerHTML =
        "<div class='card'>قائمة القراء سيتم إضافتها لاحقًا</div>";
}

function openAzkar(){
    document.getElementById("sub-view").classList.remove("hidden");
    document.getElementById("content-area").innerHTML =
        "<div class='card'>الأذكار سيتم إضافتها لاحقًا</div>";
}

function goHome(){
    document.getElementById("sub-view").classList.add("hidden");
}
