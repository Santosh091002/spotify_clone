let currentSong = new Audio();
let songs;
let currFolder;

//function to convert seconds into min:sec format
function formatSeconds(seconds) {

    // ⬅️ Add this line to remove decimals from input
    seconds = Math.floor(seconds); 

    //divides by 60 and removes unnecessary decimals
    const mins = Math.floor(seconds / 60);

    //finds the leftover seconds after dividing by 60(minute)
    const secs = seconds % 60;

    //adds 0 at first if it is a single digit no to maitain the format
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let array = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < array.length; index++) {
        const element = array[index];

        // Check if the href is an mp3 file
        if (element.href.endsWith(".mp3")) {
            // Adjust the split based on the actual structure of element.href
            const songPath = element.href.split(`${folder}/`)[1];
            
            if (songPath) {
                songs.push(songPath);
            }
        }
    }
         ///Show all the songs in thr playlist
         let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
         songUL.innerHTML ="";
         for (const song of songs) {
            songUL.innerHTML += `<li data-song="${song}">
                <img class="invert img" src="img/music.svg" alt="">
                <div class="artinfo">
                    <div>${decodeURIComponent(song).replaceAll("(256k)","").replaceAll("_"," ").replaceAll(".mp3","").replaceAll(" [NCS Release]","")}</div>
                </div>
                <div class="playnow flex items-center">
                    <span>Play Now</span>
                    <img class="invert" src="img/playbtn.svg" alt="">
                </div>
            </li>`;
        }
    
         //Attach an event listener to each song
         Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
             e.addEventListener("click", element =>{
                playMusic(e.getAttribute("data-song"));
            })
         })

         return songs;
}



 const playMusic =(track, pause = false)=>{
    // let audio = new Audio("/songs/" + encodeURIComponent(track));
    currentSong.src = `/${currFolder}/` + track;

    if(!pause){
        currentSong.play();
        play.src= "img/pausebtn.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURIComponent(
        track).replaceAll("(256k)", "")
             .replaceAll("_", " ")
             .replaceAll(".mp3", "")
             .replaceAll(" [NCS Release]","");

    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML = `00:00 / ${formatSeconds(currentSong.duration)}`;
    });
 }


 async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-1)[0]; // gets 'NCS' or 'bgm'
            if (folder === "NCS" || folder === "bgm" || folder === "HoliRemix" || folder === "LoveAnthems" || folder === "DjMashup" || folder === "shiva" || folder === "krishna"|| folder === "ganesh"|| folder === "lofi"|| folder === "NEFFEX") {
                 //Get the metadata of the folder
                let a = await fetch(`/songs/${folder}/info.json`);
                let response = await a.json();
                cardContainer.innerHTML += ` <div data-folder="${folder}" class="cards">
                        <div class="play-button-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black">
                              <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"/>
                            </svg>
                          </div>
                        <img src="/songs/${folder}/${folder}.png" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
`
        }
    }
    }

        //Load the Playlist based on which ever the card is clicked
        // Array.from(document.querySelectorAll(".play-button-container")).forEach(e =>{
        //     e.addEventListener("click", async (item) =>{
        //         //CurrentTarget to target the particular item which u want to listen even if there are multiple items combined
        //         const card = item.currentTarget.closest(".cards");
        //         const folder = card.dataset.folder;
        //         songs = await getSongs(`songs/${folder}`)
                
        //     })
        // })

        document.querySelectorAll(".play-button-container").forEach(e => {
            e.addEventListener("click", async (item) => {
                const button = item.currentTarget;
        
                // Add the highlight class
                button.classList.add("active-play");
        
                // Remove it after a short delay (e.g., 200ms)
                setTimeout(() => {
                    button.classList.remove("active-play");
                }, 250);
        
                // Get folder and load songs
                const card = button.closest(".cards");
                const folder = card.dataset.folder;
                await getSongs(`songs/${folder}`);
                playMusic(songs[0]);
            });
        });
               
        

 }

 async function main() {
     // Get the list of all songs


     await getSongs("songs/bgm")
     playMusic(songs[0], true)
     
     //Display All the Albums on the page
     displayAlbums();


     //Attach an event listener to previous,play and next
     play.addEventListener("click" ,()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src= "img/pausebtn.svg"
        }else{
            currentSong.pause()
            play.src ="img/playbtn.svg"
        }
     })

     //Listen to update the currenttime of the song
     currentSong.addEventListener("timeupdate", () => {
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".songtime").innerHTML = 
                `${formatSeconds(currentSong.currentTime)} / ${formatSeconds(currentSong.duration)}`;
            document.querySelector(".circle").style.left = 
                (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    //Add an event listener to play the next song automatically
    currentSong.addEventListener("ended", () => {
        console.log(currentSong.src.split("/").slice(5).join("/"))
        let index = songs.indexOf(currentSong.src.split("/").slice(5).join("/"));
        let nextIndex = (index + 1) % songs.length;
        playMusic(songs[nextIndex]);
    });
    
     //Add event listener to seekbar
     document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)* 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent)/100;
     })


     //Add an event listener for hamberg button
     document.querySelector(".hamberg").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
     })

     //Add an event listener close button
     document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%";
     })

     //Add an event listener to previous and next
     previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(5)[0]);
        let prevIndex = (index - 1 + songs.length) % songs.length;
        playMusic(songs[prevIndex]);
    });
    
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(5)[0]);
        let nextIndex = (index + 1) % songs.length;
        playMusic(songs[nextIndex]);
    });

    //Add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input", (e)=>{
        // console.log(e, e.target, e.target.value);
        currentSong.volume = (e.target.value)/100;
    })

    //Add an event to volume to mute when clicked
    document.querySelector(".volume img").addEventListener("click", (e)=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg" ,"mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })



 } 

main();

