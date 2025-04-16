document.addEventListener("DOMContentLoaded", function () {
    var songArray = [
        './musics/Ali_Zafar _ Jhoom (R_B mix) _ Lyrical Video(MP3_160K).mp3',
        './musics/ButtaBomma_Video_Song_4K_Telugu_AlaVaikunthapurramuloo_Allu_Arjun.mp3',
        './musics/Jashn_E_Bahaaraa(MP3_160K).mp3',
        './musics/KABHI_JO_BAADAL_BARSE(MP3_160K).mp3',
        './musics/Sau_Tarah_Ke(MP3_160K).mp3',
        './musics/Subha_Hone_Na_De(MP3_160K).mp3',
        './musics/Tareefan_Veere_Di_Wedding_QARAN_Ft_Badshah_Kareena_Kapoor_Khan_Sonam.mp3',
        './musics/Tum_Hi_Ho_Bandhu(MP3_160K).mp3',
        './musics/Tere_Liye(MP3_160K).mp3',
        './musics/Shubh_You_and_Me_(Official Audio)(MP3_160K).mp3',
        './musics/_AlaVaikunthapurramuloo_Ramuloo_Ramulaa_Video_SongTelugu_songs_Allu.mp3',
        './musics/Shape_of_You(MP3_160K).mp3',
        './musics/Ghungroo_Song_WAR_Hrithik_Roshan_Vaani_Kapoor_Arijit_Singh_Shilpa.mp3',
        './musics/Arabic_Kuthu _Halamithi_Habibo_(From _Beast_)(MP3_160K).mp3',
        './musics/Let_Her_Go_X_Husn(MP3_160K).mp3',
        './musics/Makhna_Drive_Sushant_Singh_Rajput_Jacqueline_Fernandez_Tanishk_Bagchi.mp3'
    ];

    var songsData = [];
    var totalSongs = songArray.length;
    var count = 0;
    var speed = 50;
    setInterval(() => {
        if (count < totalSongs) {
            count++;
            document.getElementById("totalSongs").textContent = count;
        } else {
            clearInterval();
            totalSongCount = document.getElementById("totalSongs").textContent = totalSongs;
        }
    }, speed);
    var songIndex = 0;
    var audio = document.getElementById("audio");
    var songListContainer = document.querySelector(".song-list");

    var playPauseButton = document.getElementById("play-pause-button");
    var songImage = document.getElementById("song-image");
    var songTitle = document.getElementById("song-title");
    var songArtist = document.getElementById("song-artist");
    var seekbar = document.getElementById("seekbar");
    var currentTimeElement = document.getElementById("current-time");
    var totalTimeElement = document.getElementById("total-time");

    var songModalTitle = document.getElementById('song-modal-title');
    var songModalArtist = document.getElementById('song-modal-artist');
    var songModalImage =  document.getElementById('song-modal-image');
    var songModalSeekbar = document.getElementById('song-modal-seekbar');
    var songModalPlayPauseButton = document.getElementById('song-modal-playPause-btn');
    var songModalDuration = document.getElementById('song-modal-duration');
    var songModalCurrentTime = document.getElementById('song-modal-current-time');

    function updateHomeScreen(filteredSongs = songsData) {
        songListContainer.innerHTML = "";
        filteredSongs.forEach((song, index) => {
            let songItem = document.createElement("div");
            songItem.classList.add("song", "d-flex", "justify-content-between", "align-items-center", "p-2", "mt-2");
            songItem.innerHTML = `
                <div class="song-left-side d-flex gap-3">
                    <img class="song-img" src="${song.image}" alt="Song Image" width="50" height="50">
                    <div>
                        <div class="song-title text-truncate " style="width: 200px;">${song.title}</div>
                        <div class="song-artist text-truncate" style="width: 200px;">${song.artist}</div>
                    </div>
                </div>
                <div class="song-right-side d-flex align-items-center gap-2">
                    <div class="song-duration">${song.duration}</div>
                    <button class="bi bi-three-dots-vertical btn border-0 text-white"></button>
                </div>
            `;
            songListContainer.appendChild(songItem);
            songItem.addEventListener("click", function () {
                playSong(songsData.indexOf(song));
                toggleSongbar();
            });
        });
    }
    

    function playSong(index) {
        songIndex = index;
        let song = songsData[songIndex];

        audio.src = song.file;
        songImage.src = song.image;
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;

        songModalTitle.textContent = song.title;
        songModalArtist.textContent = song.artist;
        songModalImage.src = song.image;

        audio.load();
        audio.play();
        playPauseButton.innerHTML = '<i class="bi bi-pause"></i>';

        audio.addEventListener("loadedmetadata", function () {
            totalTimeElement.textContent = formatTime(audio.duration);
        });

        audio.addEventListener("timeupdate", function () {
            currentTimeElement.textContent = formatTime(audio.currentTime);
            seekbar.value = (audio.currentTime / audio.duration) * 100;
            songModalSeekbar.value = (audio.currentTime / audio.duration) * 100;
        });

        playPauseButton.onclick = function () {
            if (audio.paused) {
                audio.play();
                playPauseButton.innerHTML = '<i class="bi bi-pause"></i>';
                songModalPlayPauseButton.innerHTML = '<i class="fs-1 bi bi-pause text-dark p-1"></i>';
            } else {
                audio.pause();
                playPauseButton.innerHTML = '<i class="bi bi-play"></i>';
                songModalPlayPauseButton.innerHTML = '<i class="fs-1 bi bi-play text-dark p-1 ps-1"></i>';
            }
        };

        songModalPlayPauseButton.onclick = function () {
            if (audio.paused) {
                audio.play();
                songModalPlayPauseButton.innerHTML = '<i class="fs-1 bi bi-pause text-dark p-1"></i>';
                playPauseButton.innerHTML = '<i class="bi bi-pause"></i>';
            } else {
                audio.pause();
                songModalPlayPauseButton.innerHTML = '<i class="fs-1 bi bi-play text-dark p-1 ps-1"></i>';
                playPauseButton.innerHTML = '<i class="bi bi-play"></i>';
            }
        }

        seekbar.oninput = function () {
            audio.currentTime = (seekbar.value / 100) * audio.duration;
        };

        songModalSeekbar.oninput = function () {
            audio.currentTime = (songModalSeekbar.value / 100) * audio.duration;
        }

        audio.onended = function () {
            nextSong();
        };
    }

    document.getElementById("next-button").onclick = nextSong;
    document.getElementById("song-modal-next-btn").onclick = nextSong;
    function nextSong() {
        songIndex++;
        if (songIndex >= songsData.length) {
            songIndex = 0;
        }
        playSong(songIndex);
    }

    document.getElementById("prev-button").onclick = previousSong;
    document.getElementById("song-modal-prev-btn").onclick = previousSong;
    function previousSong() {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songsData.length - 1;
        }
        playSong(songIndex);
    }

    document.getElementById("shuffle-button").onclick = shuffleSongs;
    function shuffleSongs() {
        if (songsData.length === 0) return;
        for (let i = songArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // Get a random index
            [songsData[i], songsData[j]] = [songsData[j], songsData[i]]; // Swap elements
        }
        updateHomeScreen(); // Refresh UI with shuffled list
    }

    document.getElementById("sort-button").onclick = sortSongs;
    function sortSongs() {
        songsData.sort((a, b) => a.title.localeCompare(b.title));
        updateHomeScreen();
    }

    document.getElementById("play-first-btn").addEventListener("click", function () {
        let songbtn = document.getElementById("play-first-btn");
        
        playSong(0);
        toggleSongbar();
    });
    function formatTime(seconds) {
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }

    async function processSongs() {
        songsData = [];

        for (let songPath of songArray) {
            let songInfo = {
                title: "Unknown Title",
                artist: "Unknown Artist",
                file: songPath,
                image: "default.jpg",
                duration: "0:00"
            };

            try {
                const response = await fetch(songPath);
                if (!response.ok) throw new Error("File not found");
                const blob = await response.blob();
                const file = new File([blob], songPath, { type: blob.type });

                if (window.jsmediatags) {
                    await new Promise((resolve) => {
                        jsmediatags.read(file, {
                            onSuccess: function (tag) {
                                songInfo.title = tag.tags.title || songInfo.title;
                                songInfo.artist = tag.tags.artist || songInfo.artist;

                                if (tag.tags.picture) {
                                    let base64String = "";
                                    let data = tag.tags.picture.data;
                                    let format = tag.tags.picture.format;

                                    for (let byte of data) {
                                        base64String += String.fromCharCode(byte);
                                    }

                                    songInfo.image = `data:${format};base64,${btoa(base64String)}`;
                                }
                                resolve();
                            },
                            onError: function () {
                                resolve();
                            }
                        });
                    });
                }

                let audio = new Audio(URL.createObjectURL(blob));
                await new Promise((resolve) => {
                    audio.addEventListener("loadedmetadata", function () {
                        songInfo.duration = formatTime(audio.duration);
                        resolve();
                    });

                    audio.addEventListener("error", function () {
                        resolve();
                    });
                });

                songsData.push(songInfo);
            } catch (error) {
                console.error("Failed to load file:", songPath, error);
            }
        }

        updateHomeScreen();
    }

    function toggleSongbar() {
        let songPlaySection = document.getElementById("songplaysection");
        
        if (!songPlaySection) return;
    
        songPlaySection.style.transition = "0.5s";
    
        if (songPlaySection.classList.contains("d-none")) {
            songPlaySection.classList.remove("d-none");
        } else {
            songPlaySection.classList.add("d-none"); // Hide the player
        }
    }
    
    document.getElementById("music-player").addEventListener("scroll", topNav);
    function topNav() {
        let nav = document.getElementById("main-navs");
        let musicPlayer = document.getElementById("music-player");
    
        if (musicPlayer.scrollTop > 25) {
            
            nav.style.transition = '0.5s';
            nav.style.padding = '15px 10px ';
            nav.style.borderRadius = '10px';
            nav.style.boxShadow = '0 0 10px rgba(60, 60, 60, 0.3)';
            nav.style.transform = 'scaleX(1.04)';
        } else {
            
            nav.style.padding = '0';
            nav.style.boxShadow = 'none';
            nav.style.transform = 'scaleY(1)';
        }

        if (musicPlayer.scrollHeight - musicPlayer.scrollTop <= musicPlayer.clientHeight + 550) {
            animateTextColor();
        }
        
    }

    function animateTextColor() {
        const element = document.getElementById("logo");
        let position = 0;
    
        // Apply initial styling for gradient text effect
        element.style.backgroundImage = "linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet)";
        element.style.backgroundSize = "200% 100%"; // Extend gradient for movement
        element.style.webkitBackgroundClip = "text"; // Mask text with background
        element.style.color = "transparent"; // Hide actual text color
        element.style.transition = "background-position 0.2s ease-in-out";
    
        let interval = setInterval(() => {
            position += 10; // Move gradient
            element.style.backgroundPosition = `${position}% 50%`; // Shift from left to right
    
            if (position >= 200) { // Reset after one full cycle
                clearInterval(interval);
                setTimeout(() => {
                    element.style.color = ""; // Reset to default color
                    element.style.backgroundImage = "";
                    element.style.webkitBackgroundClip = "";
                    element.style.backgroundSize = "";
                    element.style.backgroundPosition = "";
                }, 500);
            }
        }, 100); // Speed of transition
    }
    animateTextColor();

    function createSpotifyWaveform() {
        const container = document.querySelector(".waveform");
        const barsCount = 10; // Number of bars
        let bars = [];
    
        // Create bars dynamically
        for (let i = 0; i < barsCount; i++) {
            let bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.animationDelay = `${i * 0.1}s`; // Staggered animation
            container.appendChild(bar);
            bars.push(bar);
        }
    
        // Dynamic height change effect
        function animateBars() {
            bars.forEach((bar, index) => {
                let height = Math.random() * 20 + 10; // Random height between 10px to 30px
                bar.style.height = `${height}px`;
            });
            setTimeout(animateBars, 200); // Update every 200ms
        }
    
        animateBars();
    }
    
    createSpotifyWaveform();

    document.getElementById("opensearchinput").addEventListener('click', openSearchBar);
    function openSearchBar() {
        let searchInput = document.getElementById("searchinput");
        let searchNav = document.getElementById("search-nav");
        let openSearchNAv = document.getElementById("open-search-nav");
        let profileBtn = document.getElementById('profile-icon');
        openSearchNAv.classList.remove("d-none");
        searchInput.classList.remove("d-none");
        searchNav.classList.add("d-none");
        profileBtn.classList.add('d-none');
        
        searchInput.focus();
    }
    
    document.getElementById("open-search-nav").addEventListener('click', closeSearchBar);
    function closeSearchBar() {
        let openSearchNAv = document.getElementById("open-search-nav");
        let searchInput = document.getElementById("searchinput");
        let searchNav = document.getElementById("search-nav");
        let profileBtn = document.getElementById('profile-icon');
        searchInput.classList.add("d-none");
        searchNav.classList.remove("d-none");
        openSearchNAv.classList.add("d-none");
        profileBtn.classList.remove('d-none');
    }

    document.getElementById("searchinput").addEventListener('input', searchSongs);
    function searchSongs() {
        let searchInput = document.getElementById("searchinput");
        let searchQuery = searchInput.value.toLowerCase();
        let filteredSongs = songsData.filter((song) => {
            return song.title.toLowerCase().includes(searchQuery) || song.artist.toLowerCase().includes(searchQuery);
        });
        updateHomeScreen(filteredSongs);
    }
    
    document.querySelectorAll(".themes").forEach((theme) => {
        theme.addEventListener("click", addTheme);
        theme.style.position = 'relative';
        var rightbtn = document.createElement('div');
        rightbtn.classList.add('theme-right-btn','invisible')
        rightbtn.innerHTML = '<i class="bi bi-check-lg fs-4 bg-warning text-white rounded rounded-circle ps-1  pe-1"></i>'
        theme.appendChild(rightbtn);

    });
    
    function addTheme(event) {
        let themes = document.querySelectorAll(".themes");
    
        // Remove "active-theme" class from all themes~
        themes.forEach((theme) => {
            theme.classList.remove("active-theme");
            theme.querySelector('.theme-right-btn').classList.add('invisible');
        });
        // Add "active-theme" class to clicked element
        event.currentTarget.classList.add("active-theme");
    
        // Select the element whose background you want to retrieve
        let element = event.currentTarget;  // Get the clicked theme element
        let rightBtn = event.currentTarget.querySelector('.theme-right-btn');

        if(rightBtn){
            rightBtn.classList.remove('invisible');
        }
        let bgColor = window.getComputedStyle(element).background; // Get background color
    
        let elements = ['theme-modal', 'music-player','main-navs','songplaysection','song-Modal'];

        elements.forEach(id => {
            let element = document.getElementById(id);
            if (element) element.style.background = bgColor;
        });
    }

    var themeModal = document.getElementById('theme-modal');
    var musicPlayer = document.getElementById('music-player');
    var themeOpemBtn =  document.getElementById("theme-button-open");
    var themeclosebtn = document.getElementById("theme-button-close");
    var songSection =  document.getElementById("songplaysection");
    var songModal = document.getElementById('song-Modal');
    var songModalCloseBtn = document.getElementById("songmodalclosebtn");
    var songBtnSection = document.getElementById('song-buttons-section');

    themeOpemBtn.addEventListener('click', openThemeModal);
    function openThemeModal(){
        themeModal.classList.remove('d-none');
        musicPlayer.classList.add('d-none');
    }

    themeclosebtn.addEventListener('click', closethemeModal);
    function closethemeModal(){
        themeModal.classList.add('d-none');
        musicPlayer.classList.remove('d-none');
    }

    songSection.addEventListener('dblclick', openSongModal);
    function openSongModal(){
        songModal.classList.remove('d-none');
        musicPlayer.classList.add('d-none');
    }

    songModalCloseBtn.addEventListener('click', closeSongModal);
    function closeSongModal(){
        songModal.classList.add('d-none');
        musicPlayer.classList.remove('d-none');
    }

    songSection.addEventListener('mouseenter', showButtons);
    songSection.addEventListener('mouseleave', hideButtons);
    
    function showButtons() {
        songBtnSection.classList.remove('d-none');
        
    }
    
    function hideButtons() {
        songBtnSection.classList.add('d-none');
        
    }
    
    
    processSongs();
});
