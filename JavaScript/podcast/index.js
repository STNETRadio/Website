document.addEventListener("DOMContentLoaded", () => {
    const podcastList = document.getElementById("podcastList");
    const isStandalone = window.navigator.standalone === true;
    // const isStandalone = true; // For testing

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
        podcastList.innerHTML = podcasts.map(podcast => {
            const targetUrl = (isStandalone && podcast.rss) ? `/player.html?feed=${encodeURIComponent(podcast.rss)}` : podcast.link;

            return `
            <a href="${targetUrl}" class="podcast-card">
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

    renderPodcasts();
});
