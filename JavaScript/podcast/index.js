document.addEventListener("DOMContentLoaded", () => {
    const podcastList = document.getElementById("podcastList");
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    // const isStandalone = true; // For testing: Force true so we can test in browser

    console.log("Podcast Index Loaded. Standalone Mode:", isStandalone);

    // --- Elements ---
    const playerOverlay = document.getElementById('playerOverlay');
    const miniPlayerBar = document.getElementById('miniPlayerBar');
    const closeOverlayBtn = document.getElementById('closeOverlayBtn');

    // Overlay Elements
    const loadingScreen = document.getElementById('loadingScreen');
    const podcastHeader = document.getElementById('podcastHeader');
    const episodeListContainer = document.getElementById('episodeListContainer');
    const stickyPlayer = document.getElementById('stickyPlayer');
    const mainAudio = document.getElementById('mainAudio');
    const playerCover = document.getElementById('playerCover');
    const playerTitle = document.getElementById('playerTitle');
    const headerBg = document.getElementById('headerBg');
    const navTitle = document.getElementById('navTitle');
    const episodeCount = document.getElementById('episodeCount');

    // Mini Player Elements
    const miniCover = document.getElementById('miniCover');
    const miniTitle = document.getElementById('miniTitle');
    const miniSubtitle = document.getElementById('miniSubtitle');
    const miniPlayBtn = document.getElementById('miniPlayBtn');

    // --- State ---
    let currentFeed = null;
    let isPlaying = false;
    let currentEpisode = null;

    const podcasts = [
        {
            title: "เล่าเรื่องเก่ง",
            creator: "sorasukt",
            image: "https://s3.ap-southeast-1.amazonaws.com/files.stnetradio.com/podcast/เล่าเรื่องเก่ง.png",
            rating: "4.8",
            listeners: "1.6K",
            link: "https://podcasts.apple.com/th/podcast/%E0%B9%80%E0%B8%A5-%E0%B8%B2%E0%B9%80%E0%B8%A3-%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%81-%E0%B8%87/id1486563415",
            rss: "https://s3.ap-southeast-1.amazonaws.com/rss.stnetradio.com/STNETRadioEnt/TMSA/RSS.xml"
        },
        {
            title: "Talking with LITALK",
            creator: "LITALK Education",
            image: "https://s3.ap-southeast-1.amazonaws.com/files.stnetradio.com/podcast/talkingwithlitalk.png",
            rating: "Coming Soon Show",
            listeners: "1K",
            link: "https://podcasts.apple.com/th/podcast/talking-with-litalk/id1786381161",
            rss: "https://s3.ap-southeast-1.amazonaws.com/rss.stnetradio.com/SoaqerStudio/LITALKPodcast/RSS.xml"
        },
        {
            title: "ติดกับเรื่องราว",
            creator: "sorasukt",
            image: "https://s3.ap-southeast-1.amazonaws.com/files.stnetradio.com/podcast/tidkab.png",
            rating: "3.2",
            listeners: "317",
            link: "https://podcasts.apple.com/th/podcast/%E0%B8%95-%E0%B8%94%E0%B8%81-%E0%B8%9A%E0%B9%80%E0%B8%A3-%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%A7/id1564119401",
            rss: "https://anchor.fm/s/5b844008/podcast/rss"
        },
    ];

    function isThaiText(text) {
        return /[\u0E00-\u0E7F]/.test(text); // ตรวจจับตัวอักษรไทย
    }

    function renderPodcasts() {
        podcastList.innerHTML = podcasts.map((podcast, index) => {
            // If PWA, use onclick handler. If not, use normal link.
            const href = isStandalone && podcast.rss ? '#' : podcast.link;
            const clickHandler = isStandalone && podcast.rss ? `onclick="openPodcast('${podcast.rss}', event)"` : '';

            return `
            <a href="${href}" class="podcast-card" ${clickHandler} data-rss="${podcast.rss}">
            <div class="podcast-card">
                <div class="podcast-image">
                    <img src="${podcast.image}" alt="${podcast.title}">
                </div>
                <div class="podcast-content">
                    <div class="podcast-title ${isThaiText(podcast.title) ? 'thai-font' : 'english-font'}">
                        ${podcast.title}
                    </div>
                    <div class="podcast-creator ${isThaiText(podcast.creator) ? 'thai-font-p' : 'english-font-p'}">
                        by ${podcast.creator}
                    </div>
                    <div class="podcast-stats">
                        <span>★ ${podcast.rating}</span> 
                        <span>|</span>
                        <span>${podcast.listeners} listeners</span>
                    </div>
                </div>
            </div>
            </a>
        `}).join('');
    }

    // --- SPA Navigation Logic ---

    window.openPodcast = (rssUrl, event) => {
        console.log("Opening Podcast:", rssUrl);
        if (event) event.preventDefault();

        // Push State
        history.pushState({ view: 'player', rss: rssUrl }, '', '#player');

        // Open Overlay
        playerOverlay.classList.add('visible');
        miniPlayerBar.classList.remove('visible'); // Hide mini player when overlay is open

        // Show Sticky Player if we have an active episode
        if (currentEpisode) {
            stickyPlayer.classList.add('visible');
        }

        // Load Feed if different
        if (currentFeed !== rssUrl) {
            loadFeed(rssUrl);
            currentFeed = rssUrl;
        }
    };

    function closeOverlay() {
        playerOverlay.classList.remove('visible');
        stickyPlayer.classList.remove('visible'); // Hide sticky player when overlay closes

        // Show Mini Player if playing or has episode
        if (currentEpisode) {
            miniPlayerBar.classList.add('visible');
        }
    }

    // Handle Back Button
    window.addEventListener('popstate', (event) => {
        if (playerOverlay.classList.contains('visible')) {
            closeOverlay();
        }
    });

    // Close Button Action
    closeOverlayBtn.addEventListener('click', () => {
        history.back(); // This triggers popstate
    });

    // Mini Player Click -> Open Overlay
    miniPlayerBar.addEventListener('click', (e) => {
        // Don't trigger if clicking play button
        if (e.target.closest('.mini-play-btn')) return;

        history.pushState({ view: 'player', rss: currentFeed }, '', '#player');
        playerOverlay.classList.add('visible');
        miniPlayerBar.classList.remove('visible');

        // Show Sticky Player
        if (currentEpisode) {
            stickyPlayer.classList.add('visible');
        }
    });

    // --- Player Logic (Merged from player.js) ---

    function loadFeed(feedUrl) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';

        // Use corsproxy.io
        const corsProxy = 'https://corsproxy.io/?';
        const proxiedUrl = corsProxy + encodeURIComponent(feedUrl);

        // Timeout logic
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        fetch(proxiedUrl, { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
            .then(data => {
                const channel = data.querySelector("channel");
                if (!channel) throw new Error("Invalid RSS feed");

                // --- Parse Podcast Info ---
                const podcastTitle = getTagValue(channel, "title");
                const podcastDesc = getTagValue(channel, "description").replace(/<[^>]*>?/gm, ''); // Strip HTML

                // Image fallback logic
                let podcastImage = '/img/STNET-App.png';
                const imageTag = channel.querySelector("image");
                if (imageTag && imageTag.querySelector("url")) {
                    podcastImage = imageTag.querySelector("url").textContent.trim();
                } else {
                    const itunesImage = channel.getElementsByTagNameNS("http://www.itunes.com/dtds/podcast-1.0.dtd", "image")[0];
                    if (itunesImage) podcastImage = itunesImage.getAttribute("href");
                }

                // --- Update UI ---
                headerBg.style.backgroundImage = `url('${podcastImage}')`;
                navTitle.textContent = podcastTitle;

                podcastHeader.innerHTML = `
                    <img src="${podcastImage}" alt="${podcastTitle}" class="podcast-cover">
                    <div class="podcast-title">${podcastTitle}</div>
                    <div class="podcast-desc">${podcastDesc}</div>
                `;

                // --- Parse Episodes ---
                const items = Array.from(data.querySelectorAll("item"));
                episodeCount.textContent = `${items.length} Episodes`;

                if (items.length === 0) {
                    episodeListContainer.innerHTML = '<div style="text-align:center; padding:2rem;">No episodes found.</div>';
                } else {
                    episodeListContainer.innerHTML = ''; // Clear
                    items.forEach((item, index) => {
                        const title = getTagValue(item, "title");
                        const pubDate = new Date(getTagValue(item, "pubDate")).toLocaleDateString('th-TH', {
                            year: 'numeric', month: 'short', day: 'numeric'
                        });
                        const desc = getTagValue(item, "description").replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';

                        const enclosure = item.querySelector("enclosure");
                        const audioUrl = enclosure ? enclosure.getAttribute("url") : null;

                        // Episode Image
                        let epImage = podcastImage;
                        const epItunesImage = item.getElementsByTagNameNS("http://www.itunes.com/dtds/podcast-1.0.dtd", "image")[0];
                        if (epItunesImage) epImage = epItunesImage.getAttribute("href");

                        if (audioUrl) {
                            const card = document.createElement('div');
                            card.className = 'episode-item';
                            // Check if this is the currently playing episode
                            if (currentEpisode && currentEpisode.url === audioUrl) {
                                card.classList.add('active');
                            }

                            card.innerHTML = `
                                <div class="ep-date">${pubDate}</div>
                                <div class="ep-title">${title}</div>
                                <div class="ep-desc">${desc}</div>
                                <div class="ep-meta">
                                    <div class="play-btn-small">
                                        ${(currentEpisode && currentEpisode.url === audioUrl && isPlaying) ? '<i class="fa-solid fa-pause"></i> Playing' : '<i class="fa-solid fa-play"></i> Play'}
                                    </div>
                                </div>
                            `;

                            card.addEventListener('click', () => {
                                playEpisode(title, audioUrl, epImage, card, podcastTitle);
                            });

                            episodeListContainer.appendChild(card);
                        }
                    });
                }

                // Hide loading
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);

            })
            .catch(err => {
                console.error(err);
                loadingScreen.innerHTML = `<div style="text-align:center; padding:20px;">Error loading feed:<br>${err.message}<br><br>Please try again later.</div>`;
            });
    }

    function getTagValue(parent, tagName) {
        const tag = parent.querySelector(tagName);
        return tag ? tag.textContent.trim() : '';
    }

    function playEpisode(title, url, image, cardElement, podcastTitle) {
        // Update State
        currentEpisode = { title, url, image, podcastTitle };
        isPlaying = true;

        // Update Full Player UI
        playerTitle.textContent = title;
        playerCover.src = image;
        mainAudio.src = url;

        // Update Mini Player UI
        miniTitle.textContent = title;
        miniSubtitle.textContent = podcastTitle;
        miniCover.src = image;

        // Update Icons
        updatePlayIcons(true);

        // Play
        mainAudio.play().catch(e => console.log("Autoplay prevented", e));

        // Show Sticky Player
        stickyPlayer.classList.add('visible');

        // Update Active State in List
        document.querySelectorAll('.episode-item').forEach(el => {
            el.classList.remove('active');
            const btn = el.querySelector('.play-btn-small');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
        });

        if (cardElement) {
            cardElement.classList.add('active');
            const btn = cardElement.querySelector('.play-btn-small');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i> Playing';
        }

        // --- Media Session API (iOS Control Center / Lock Screen) ---
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: title,
                artist: podcastTitle,
                album: podcastTitle,
                artwork: [
                    { src: image, sizes: '96x96', type: 'image/png' },
                    { src: image, sizes: '128x128', type: 'image/png' },
                    { src: image, sizes: '192x192', type: 'image/png' },
                    { src: image, sizes: '256x256', type: 'image/png' },
                    { src: image, sizes: '384x384', type: 'image/png' },
                    { src: image, sizes: '512x512', type: 'image/png' },
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => {
                mainAudio.play();
                updatePlayIcons(true);
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                mainAudio.pause();
                updatePlayIcons(false);
            });
            navigator.mediaSession.setActionHandler('seekbackward', (details) => {
                mainAudio.currentTime = Math.max(mainAudio.currentTime - (details.seekOffset || 10), 0);
            });
            navigator.mediaSession.setActionHandler('seekforward', (details) => {
                mainAudio.currentTime = Math.min(mainAudio.currentTime + (details.seekOffset || 10), mainAudio.duration);
            });
        }
    }

    function updatePlayIcons(isPlaying) {
        const iconClass = isPlaying ? 'fa-pause' : 'fa-play';
        const stickyBtn = document.getElementById('stickyPlayBtn');
        const miniBtn = document.getElementById('miniPlayBtn');

        if (stickyBtn) stickyBtn.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
        if (miniBtn) miniBtn.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    }

    // Audio Events
    mainAudio.addEventListener('play', () => {
        console.log("Audio Playing");
        isPlaying = true;
        updatePlayIcons(true);
    });

    mainAudio.addEventListener('pause', () => {
        console.log("Audio Paused");
        isPlaying = false;
        updatePlayIcons(false);
    });

    mainAudio.addEventListener('error', (e) => {
        console.error("Audio Error:", mainAudio.error);
        alert("Unable to play this episode. The audio source might be unavailable.");
        isPlaying = false;
        updatePlayIcons(false);
    });

    // Mini Player Controls
    miniPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    // Sticky Player Controls
    const stickyPlayBtn = document.getElementById('stickyPlayBtn');
    stickyPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    function togglePlay() {
        if (mainAudio.paused) {
            mainAudio.play();
        } else {
            mainAudio.pause();
        }
    }

    // --- Init ---
    renderPodcasts();
});
