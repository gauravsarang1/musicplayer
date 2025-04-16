document.addEventListener("DOMContentLoaded", function () {
    // Song data storage
    var songsData = [];
    var songIndex = 0;
    var audio = document.getElementById("audio");
    var songListContainer = document.querySelector(".song-list");

    // UI Elements
    var playPauseButton = document.getElementById("play-pause-button");
    var songImage = document.getElementById("song-image");
    var songTitle = document.getElementById("song-title");
    var songArtist = document.getElementById("song-artist");
    var seekbar = document.getElementById("seekbar");
    var currentTimeElement = document.getElementById("current-time");
    var totalTimeElement = document.getElementById("total-time");

    // Modal Elements
    var songModalTitle = document.getElementById('song-modal-title');
    var songModalArtist = document.getElementById('song-modal-artist');
    var songModalImage = document.getElementById('song-modal-image');
    var songModalSeekbar = document.getElementById('song-modal-seekbar');
    var songModalPlayPauseButton = document.getElementById('song-modal-playPause-btn');
    var songModalDuration = document.getElementById('song-modal-duration');
    var songModalCurrentTime = document.getElementById('song-modal-current-time');

    // File input for selecting multiple audio files
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'audio/*';
    fileInput.style.display = 'none';
    fileInput.id = 'audio-file-input';
    document.body.appendChild(fileInput);

    // Add a button to select audio files
    var selectAudioBtn = document.createElement('button');
    selectAudioBtn.innerText = 'Select Audio Files';
    selectAudioBtn.className = 'btn btn-primary w-100 mb-3';
    selectAudioBtn.onclick = function() {
        fileInput.click();
    };
    songListContainer.parentNode.insertBefore(selectAudioBtn, songListContainer);

    // Counter for loaded songs
    var totalSongs = 0;
    var loadedSongs = 0;
    
    // Update song counter
    function updateSongCounter() {
        document.getElementById("totalSongs").textContent = loadedSongs;
    }

    // Update the home screen with song list
    function updateHomeScreen(filteredSongs = songsData) {
        songListContainer.innerHTML = "";
        filteredSongs.forEach((song, index) => {
            let songItem = document.createElement("div");
            songItem.classList.add("song", "d-flex", "justify-content-between", "align-items-center", "p-2", "mt-2");
            songItem.innerHTML = `
                <div class="song-left-side d-flex gap-3">
                    <img class="song-img" src="${song.image}" alt="Song Image" width="50" height="50">
                    <div>
                        <div class="song-title text-truncate" style="width: 200px;">${song.title}</div>
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

    // Play selected song
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
        songModalPlayPauseButton.innerHTML = '<i class="fs-1 bi bi-pause text-dark p-1"></i>';

        audio.addEventListener("loadedmetadata", function () {
            totalTimeElement.textContent = formatTime(audio.duration);
            songModalDuration.textContent = formatTime(audio.duration);
        });

        audio.addEventListener("timeupdate", function () {
            currentTimeElement.textContent = formatTime(audio.currentTime);
            songModalCurrentTime.textContent = formatTime(audio.currentTime);
            seekbar.value = (audio.currentTime / audio.duration) * 100;
            songModalSeekbar.value = (audio.currentTime / audio.duration) * 100;
        });

        audio.onended = function () {
            nextSong();
        };
    }

    // Play/Pause functionality
    playPauseButton.onclick = function () {
        togglePlayPause();
    };

    songModalPlayPauseButton.onclick = function () {
        togglePlayPause();
    };

    function togglePlayPause() {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = '<i class="bi bi-pause"></i>';
            songModalPlayPauseButton.innerHTML = '<i class="fs-1 bi bi-pause text-dark p-1"></i>';
        } else {
            audio.pause();
            playPauseButton.innerHTML = '<i class="bi bi-play"></i>';
            songModalPlayPauseButton.innerHTML = '<i class="fs-1 bi bi-play text-dark p-1 ps-1"></i>';
        }
    }

    // Seekbar functionality
    seekbar.oninput = function () {
        audio.currentTime = (seekbar.value / 100) * audio.duration;
    };

    songModalSeekbar.oninput = function () {
        audio.currentTime = (songModalSeekbar.value / 100) * audio.duration;
    };

    // Next/Previous song buttons
    document.getElementById("next-button").onclick = nextSong;
    document.getElementById("song-modal-next-btn").onclick = nextSong;
    
    function nextSong() {
        if (songsData.length === 0) return;
        songIndex++;
        if (songIndex >= songsData.length) {
            songIndex = 0;
        }
        playSong(songIndex);
    }

    document.getElementById("prev-button").onclick = previousSong;
    document.getElementById("song-modal-prev-btn").onclick = previousSong;
    
    function previousSong() {
        if (songsData.length === 0) return;
        songIndex--;
        if (songIndex < 0) {
            songIndex = songsData.length - 1;
        }
        playSong(songIndex);
    }

    // Shuffle functionality
    document.getElementById("shuffle-button").onclick = shuffleSongs;
    
    function shuffleSongs() {
        if (songsData.length === 0) return;
        for (let i = songsData.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [songsData[i], songsData[j]] = [songsData[j], songsData[i]];
        }
        updateHomeScreen();
    }

    // Sort functionality
    document.getElementById("sort-button").onclick = sortSongs;
    
    function sortSongs() {
        if (songsData.length === 0) return;
        songsData.sort((a, b) => a.title.localeCompare(b.title));
        updateHomeScreen();
    }

    // Play first song button
    document.getElementById("play-first-btn").addEventListener("click", function () {
        if (songsData.length === 0) {
            alert("Please select audio files first");
            return;
        }
        playSong(0);
        toggleSongbar();
    });

    // Format time in mm:ss
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }

    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        if (this.files.length === 0) return;
        
        songsData = [];
        loadedSongs = 0;
        totalSongs = this.files.length;
        
        // Update UI to show loading progress
        let loadingMessage = document.createElement('div');
        loadingMessage.id = 'loading-message';
        loadingMessage.className = 'alert alert-info mt-3';
        loadingMessage.textContent = `Loading 0/${totalSongs} songs...`;
        songListContainer.parentNode.insertBefore(loadingMessage, songListContainer);
        
        // Process each file
        Array.from(this.files).forEach((file, index) => {
            processAudioFile(file, index);
        });
    });

    // Process audio file metadata and create song entry
    async function processAudioFile(file, index) {
        let songInfo = {
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            artist: "Unknown Artist",
            file: URL.createObjectURL(file),
            image: "default.jpg", // Default image path
            duration: "0:00"
        };

        try {
            // Get metadata using jsmediatags if available
            if (window.jsmediatags) {
                await new Promise((resolve) => {
                    jsmediatags.read(file, {
                        onSuccess: function(tag) {
                            if (tag.tags) {
                                songInfo.title = tag.tags.title || songInfo.title;
                                songInfo.artist = tag.tags.artist || songInfo.artist;

                                // Extract album art if available
                                if (tag.tags.picture) {
                                    let base64String = "";
                                    let data = tag.tags.picture.data;
                                    let format = tag.tags.picture.format;

                                    for (let byte of data) {
                                        base64String += String.fromCharCode(byte);
                                    }

                                    songInfo.image = `data:${format};base64,${btoa(base64String)}`;
                                }
                            }
                            resolve();
                        },
                        onError: function() {
                            resolve();
                        }
                    });
                });
            }

            // Get duration
            let tempAudio = new Audio();
            tempAudio.src = songInfo.file;
            
            await new Promise((resolve) => {
                tempAudio.addEventListener("loadedmetadata", function() {
                    songInfo.duration = formatTime(tempAudio.duration);
                    resolve();
                });
                
                tempAudio.addEventListener("error", function() {
                    resolve();
                });
            });

            // Add to songsData array
            songsData.push(songInfo);
            
            // Update loading progress
            loadedSongs++;
            let loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.textContent = `Loading ${loadedSongs}/${totalSongs} songs...`;
                
                if (loadedSongs === totalSongs) {
                    loadingMessage.remove();
                    updateSongCounter();
                    updateHomeScreen();
                }
            }
        } catch (error) {
            console.error("Failed to process file:", file.name, error);
            loadedSongs++;
        }
    }

    // Toggle song player bar
    function toggleSongbar() {
        let songPlaySection = document.getElementById("songplaysection");
        
        if (!songPlaySection) return;
    
        songPlaySection.style.transition = "0.5s";
    
        if (songPlaySection.classList.contains("d-none")) {
            songPlaySection.classList.remove("d-none");
        } else {
            songPlaySection.classList.add("d-none");
        }
    }
    
    // Navbar animation on scroll
    document.getElementById("music-player").addEventListener("scroll", topNav);
    function topNav() {
        let nav = document.getElementById("main-navs");
        let musicPlayer = document.getElementById("music-player");
    
        if (musicPlayer.scrollTop > 25) {
            nav.style.transition = '0.5s';
            nav.style.padding = '15px 10px';
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

    // Text color animation
    function animateTextColor() {
        const element = document.getElementById("logo");
        let position = 0;
    
        element.style.backgroundImage = "linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet)";
        element.style.backgroundSize = "200% 100%";
        element.style.webkitBackgroundClip = "text";
        element.style.color = "transparent";
        element.style.transition = "background-position 0.2s ease-in-out";
    
        let interval = setInterval(() => {
            position += 10;
            element.style.backgroundPosition = `${position}% 50%`;
    
            if (position >= 200) {
                clearInterval(interval);
                setTimeout(() => {
                    element.style.color = "";
                    element.style.backgroundImage = "";
                    element.style.webkitBackgroundClip = "";
                    element.style.backgroundSize = "";
                    element.style.backgroundPosition = "";
                }, 500);
            }
        }, 100);
    }
    
    // Create waveform animation
    function createSpotifyWaveform() {
        const container = document.querySelector(".waveform");
        if (!container) return;
        
        const barsCount = 10;
        let bars = [];
    
        for (let i = 0; i < barsCount; i++) {
            let bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.animationDelay = `${i * 0.1}s`;
            container.appendChild(bar);
            bars.push(bar);
        }
    
        function animateBars() {
            bars.forEach((bar) => {
                let height = Math.random() * 20 + 10;
                bar.style.height = `${height}px`;
            });
            setTimeout(animateBars, 200);
        }
    
        animateBars();
    }
    
    // Search functionality
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
            return song.title.toLowerCase().includes(searchQuery) || 
                   song.artist.toLowerCase().includes(searchQuery);
        });
        
        updateHomeScreen(filteredSongs);
    }
    
    // Theme selection
    document.querySelectorAll(".themes").forEach((theme) => {
        theme.addEventListener("click", addTheme);
        theme.style.position = 'relative';
        
        var rightbtn = document.createElement('div');
        rightbtn.classList.add('theme-right-btn', 'invisible');
        rightbtn.innerHTML = '<i class="bi bi-check-lg fs-4 bg-warning text-white rounded rounded-circle ps-1 pe-1"></i>';
        theme.appendChild(rightbtn);
    });
    
    function addTheme(event) {
        let themes = document.querySelectorAll(".themes");
    
        themes.forEach((theme) => {
            theme.classList.remove("active-theme");
            theme.querySelector('.theme-right-btn').classList.add('invisible');
        });
        
        event.currentTarget.classList.add("active-theme");
        let rightBtn = event.currentTarget.querySelector('.theme-right-btn');

        if (rightBtn) {
            rightBtn.classList.remove('invisible');
        }
        
        let bgColor = window.getComputedStyle(event.currentTarget).background;
        let elements = ['theme-modal', 'music-player', 'main-navs', 'songplaysection', 'song-Modal'];

        elements.forEach(id => {
            let element = document.getElementById(id);
            if (element) element.style.background = bgColor;
        });
    }

    // Modal controls
    var themeModal = document.getElementById('theme-modal');
    var musicPlayer = document.getElementById('music-player');
    var themeOpenBtn = document.getElementById("theme-button-open");
    var themeCloseBtn = document.getElementById("theme-button-close");
    var songSection = document.getElementById("songplaysection");
    var songModal = document.getElementById('song-Modal');
    var songModalCloseBtn = document.getElementById("songmodalclosebtn");
    var songBtnSection = document.getElementById('song-buttons-section');

    themeOpenBtn.addEventListener('click', openThemeModal);
    function openThemeModal() {
        themeModal.classList.remove('d-none');
        musicPlayer.classList.add('d-none');
    }

    themeCloseBtn.addEventListener('click', closeThemeModal);
    function closeThemeModal() {
        themeModal.classList.add('d-none');
        musicPlayer.classList.remove('d-none');
    }

    songSection.addEventListener('dblclick', openSongModal);
    function openSongModal() {
        songModal.classList.remove('d-none');
        musicPlayer.classList.add('d-none');
    }

    songModalCloseBtn.addEventListener('click', closeSongModal);
    function closeSongModal() {
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
    
    // Initialize
    createSpotifyWaveform();
    animateTextColor();
});
