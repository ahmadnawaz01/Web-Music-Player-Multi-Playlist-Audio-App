
let jsonadress = "/songs/songs.json";
let playlistsaddress = "/playlists.json";
let songs = [];
let makeplaylist = [];
let currentsong = "";
let librarylist = document.querySelector(".songlist ul");
let playlist = document.querySelector(".cardcontainer");
let currentindex = 0;
document.querySelector("#cl").style.display = "none";
// funtiocn to read the playlists from the directory-----------------
async function readplaylist(playlist) {
    try {
        let res = await fetch(playlist);
        let data = await res.json();
        makeplaylist = data;
        makingplaylists();


    } catch (err) {
        console.error("Error loading playlists:", err);
    }
}

//fucntion to make the playlist automatically in the playlisy sctin-------------------
function makingplaylists() {
    playlist.innerHTML = "";
    readsongs(makeplaylist[0].songlist);
    makeplaylist.forEach(li => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `<div class="playbutton">
                            <i class="fa-solid fa-play"></i>
                        </div>
                        <img src="${li.playlistimage}" alt="">
                        <h2>${li.playlistname}</h2>
                        <p>${li.playlistdes}</p>`;
        let j = li.songlist;
        playlist.appendChild(card);
        card.addEventListener("click", () => {
            readsongs(j);
            document.querySelector(".left").style.left = "-10px";
            document.querySelector(".playwrap").style.zIndex = "5555";
            document.querySelector("#cl").style.display = "none";
            if (window.matchMedia("(max-width: 1350px)").matches) {
                document.querySelector(".home").style.display = "none";
                document.querySelector(".songlist").style.height = "70vh";
                document.querySelector("#cl").style.display = "block";
            }
        })
    })
}

// fucntion to read the songs-------------------
async function readsongs(jsonfile) {
    try {
        let res = await fetch(jsonfile);
        let data = await res.json();
        songs = data;
        makelists(songs);


    } catch (err) {
        console.error("Error loading songs:", err);
    }
}
// funtion to make the list of the songs---------------------------

function makelists(songs) {
    librarylist.innerHTML = "";

    songs.forEach((el, index) => {
        {
            let li = document.createElement("li");
            li.innerHTML = `<div class="img"><img width="20px" src="music.svg" alt="">
                                <div class="info">
                                    <div class="songname">${el.songname}</div>
                                    <div class="songartist">${el.songartist}</div>
                                </div>
                            </div>
                            <div class="playnow"> <h6>Play Now</h6>
                                <i class="fa-regular fa-circle-play"></i></div>`
                ;
            librarylist.appendChild(li);

            li.addEventListener("click", () => {
                playsong(index);
            })
        }
    });
}

// fucntion to play the songs-----------------------------------------

function playsong(index) {
    let songinfo = document.querySelector(".songinfo");
    let songtime = document.querySelector(".songtime");
    if (currentsong) {
        currentsong.pause();
        currentsong.currentTime = 0;
    }



    songinfo.innerText = "";
    songinfo.innerText = songinfo.innerText + songs[index].songname;
    songtime.innerText = "00:00/00:00";


    currentindex = index;
    currentsong = new Audio(songs[index].song);


    currentsong.addEventListener("loadedmetadata", () => {
        let total = formatTime(currentsong.duration);
        songtime.innerText = `00:00 / ${total}`;
    });


    currentsong.addEventListener("timeupdate", () => {
        let current = formatTime(currentsong.currentTime);
        let total = formatTime(currentsong.duration);
        songtime.innerText = `${current} / ${total}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });

   
currentsong.addEventListener("ended", () => {
    let nextindex = (currentindex + 1) % songs.length;
    playsong(nextindex);
});

    currentsong.play();
    let playicon = document.getElementById("playpause");
playicon.classList.remove("fa-play");
playicon.classList.add("fa-pause");
    document.querySelectorAll(".songlist ul li").forEach(li => {
        li.classList.remove("active");
    });

    let currentLi = librarylist.children[index];
    if (currentLi) {
        currentLi.classList.add("active");
    }
}

 document.querySelector(".seekbar").addEventListener("click", e => {
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";

        if (currentsong && currentsong.duration) {
            let perc = (e.offsetX / e.target.getBoundingClientRect().width);
            currentsong.currentTime = perc * currentsong.duration;
        }
    })


// fucntion to chaneg the play pause  button icons----------------------------
let playicon = document.getElementById("playpause");
let playbutton = playicon.parentElement;
playbutton.addEventListener("click", () => {
    if (!currentsong || !currentsong.src) {
        playsong(0);
        playicon.classList.remove("fa-play");
        playicon.classList.add("fa-pause");
        return;
    }

    if (currentsong.paused) {
        currentsong.play();
        playicon.classList.remove("fa-play");
        playicon.classList.add("fa-pause");
    } else {
        currentsong.pause();
        playicon.classList.remove("fa-pause");
        playicon.classList.add("fa-play");
    }
})


// function to next or prev button-----------------------
let prev = document.getElementById("pre");
let next = document.getElementById("next");
prev.addEventListener("click", () => {
    if (!currentsong || !currentsong.src) {
        playsong(0);
        return;
    }
    if (songs.length === 0) return;
    let previndex = (currentindex - 1 + songs.length) % songs.length;
    playsong(previndex);
});
next.addEventListener("click", () => {
    if (!currentsong || !currentsong.src) {
        playsong(0);
        return;
    }
    if (songs.length === 0) return;
    let nextindex = (currentindex + 1 + songs.length) % songs.length;
    playsong(nextindex);
});


// fucntion to convert seconds to minutes and seconds---------------

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (sec < 10) sec = "0" + sec;
    return `${min}:${sec}`;
}

//funcion for mobile resposive design hamburger-----------

document.querySelector("#ham").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-10px";
    document.querySelector(".playwrap").style.zIndex = "0";
    document.querySelector(".home").style.display = "flex";
    document.querySelector(".home").style.flexDirection = "column";
    document.querySelector("#cl").style.display = "none";
})


document.querySelector("#close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-150%";
})
document.querySelector("#cl").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-150%";
    document.querySelector(".songlist").style.height = "60vh";
})
let volbar = document.querySelector(".rock")
volbar.addEventListener("input", () => {
    currentsong.volume = parseInt(volbar.value) / 100;
    let volIcon = document.querySelector(".volume i");
    volIcon.classList.remove("fa-volume-xmark", "fa-volume-low", "fa-volume-high");

    if (volbar.value == 0) {
        volIcon.classList.add("fa-volume-xmark");
        currentsong.muted = true;
    } else if (volbar.value > 0 && volbar.value < 25) {
        volIcon.classList.add("fa-volume-low");
        currentsong.muted = false;
    } else {
        volIcon.classList.add("fa-volume-high");
        currentsong.muted = false;
    }
})

readplaylist(playlistsaddress);