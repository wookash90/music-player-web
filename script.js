const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeElement = document.getElementById('current-time');
const durationElement = document.getElementById('duration');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');

//Music
const songs = [
    {
        name: 'cornfieldChase',
        displayName: 'Cornfield Chase',
        artist: 'Hans Zimmer',
    },
    {
        name: 'aGiftOfAThistle',
        displayName: 'A Gift Of A Thistle',
        artist: 'James Horner',
    },
    {
        name: 'duelOfTheFates',
        displayName: 'Duel Of The Fates',
        artist: 'John Williams',
    },
    {
        name: 'lotr',
        displayName: 'The Fellowship Of The Ring',
        artist: 'Howard Shore',
    },
    {
        name: 'theBalconyScene',
        displayName: 'The Balcony Scene',
        artist: 'Paul Bateman',
    }
];

//Check if playing. Default is set to false - song won't play when you start the website
let isPlaying = false;

//Play
function playSong() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');      //replaces play button icon with pause button
    playBtn.setAttribute('title', 'Pause');                //by default the title says 'play' - this line changes it to 'pause' after pressing it
    music.play();
}

//Pause
function pauseSong() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');      //replaces pause button icon with play button
    playBtn.setAttribute('title', 'Play');                 //when the song is playing, the play button title was changed. This changes it back to default 'play'
    music.pause();
}

//Play or Pause eventListener. Press playBtn -> if isPlaying is true = pause song, if isPlaying is false = play song 
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));

//Update DOM        This function changes objects in song array and updates it to the DOM/screen
function loadSong(song) {
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    music.src = `music/${song.name}.mp3`;
    image.src = `img/${song.name}.jpg`;
}

//Current song - variable to set song index
let songIndex = 0;

//Next song - when you press 'nextBtn' function below runs. songIndex is incremented, loads songs with higher index, playSong();, if song index is more than the length of the array then set the index to 0.
function nextSong() {
    songIndex++;
    if(songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
};
//Same functionality as above, but plays previous song.
function prevSong() {
    songIndex--;
    if(songIndex < 0) {
        songIndex = songs.length -1;
    }
    loadSong(songs[songIndex]);
    playSong();
};

//On Load - Select first song
loadSong(songs[songIndex]);

//Update progress bar & time. "Destructuring" an object to access 'currentTime' and 'duration' of each song
function updateProgressBar(e) {                                 // e = event
    if(isPlaying) {
        const { duration, currentTime } = e.srcElement;         //duration and currentTime are elements that are given to us when playing an audio. You can see it when you inspect the web
        //Update progress bar width
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        //Calculate display for duration - total length of a song
        const durationMinutes = Math.floor(duration / 60);      //duration is shown in seconds - dividing it by 60 shows us minutes.
        let durationSeconds = Math.floor(duration % 60);        //% is the reminder method - more info online. This and line above gives us minutes and seconds.
        if (durationSeconds < 10) {
            durationSeconds = `0${durationSeconds}`;            //this if statement adds 0 in front of seconds if the value is below 10sec
        }
        if(durationSeconds) {
            durationElement.textContent = `${durationMinutes}:${durationSeconds}`;  //Changes the element to show songs duration. If 'durationSeconds' meaning that when our maths is done - it will show the value on screen to avoid showing NaN(not a number - this can somethimes show whem maths hasn't been calculated on time so we are delaying it).
        }
        //Calculate display for currentTime - time we are at when listening     - Same function as the one above
        const currentMinutes = Math.floor(currentTime / 60);      
        let currentSeconds = Math.floor(currentTime % 60);        
        if (currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`;                
        }
        currentTimeElement.textContent = `${currentMinutes}:${currentSeconds}`;
    }
}

//Set progress bar - being able to jump anywhere you want on the progress bar. Width and offset are values of the element.
function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const {duration} = music;
    music.currentTime = (clickX / width) * duration;
}

//Event Listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('ended', nextSong);  //Event ended is fired up when the song finishes. Automatically plays next track.
music.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgressBar);
