console.log('lets write java script code')
let currentSongs = new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://192.168.29.11:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // show all the song playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                               <div>  ${song.replaceAll("%20", "")}</div> 
                                <div>Hritick</div>
                            </div>
                            <div class="playnow">
                                <span>PlayNow</span>  
                                <img class="invert" src="img/play.svg" alt="">
                            </div></li>`;
    }
    // attach an event litenser to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track) 
    currentSongs.src = `/${currFolder}/` + track
    if (!pause) {
        currentSongs.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function main() {
    //get the list of all the song
    await getsongs("songs/ncs")
    playMusic(songs[0], true)
    // Attach an Events listener to play next and previous
    play.addEventListener("click", () => {
        if (currentSongs.paused) {
            currentSongs.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSongs.pause()
            play.src = "img/play.svg"
        }
    })
    //  Listen for timeupdate event songtime circle
        currentSongs.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSongs.
            currentTime)}/${secondsToMinutesSeconds(currentSongs.duration)}`
        document.querySelector(".circle").style.left = (currentSongs.currentTime / currentSongs.
            duration) * 100 + "%";
    })
    // Add a Event litenner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSongs.currentTime = ((currentSongs.duration) * percent) / 100
    })
    //Add an events litener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //Add an events litener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    // Add a Event listerner to previous 
    previous.addEventListener("click", () => {
        console.log("Previous clicked")
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    // Add a Event listerner to next
    next.addEventListener("click", () => {
        currentSongs.pause()
        console.log("next clicked")
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
       Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
    
}
main()
