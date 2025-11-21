document.addEventListener('DOMContentLoaded', () => {
    // Check if running in standalone mode (iOS PWA)
    const isStandalone = window.navigator.standalone === true;

    // For testing/debugging purposes, you can uncomment the line below to force the button to appear
    // const isStandalone = true;

    if (isStandalone) {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            // Determine language based on HTML lang attribute
            const lang = document.documentElement.lang || 'en';
            const isThai = lang === 'th';

            const buttonText = isThai ? 'ฟังบน Apple Podcasts' : 'Listen on Apple Podcasts';
            const linkUrl = 'https://podcasts.apple.com/th/channel/stnet-radio/id6442482179?hasPaidContent=true';

            const pwaButton = document.createElement('a');
            pwaButton.href = linkUrl;
            pwaButton.className = 'btn-solid pwa-btn';
            pwaButton.textContent = buttonText;
            pwaButton.style.marginTop = '1rem';
            pwaButton.style.backgroundColor = '#872ec4'; // Apple Podcasts purple-ish or brand color
            pwaButton.style.color = 'white';
            pwaButton.style.display = 'inline-block';

            // Add an icon if possible, or just text for now. 
            // Simple styling to make it stand out.

            // Append to hero content
            // We want it after the description
            const heroDesc = heroContent.querySelector('.hero-desc');
            if (heroDesc) {
                heroDesc.insertAdjacentElement('afterend', pwaButton);
            } else {
                heroContent.appendChild(pwaButton);
            }
        }
    }
});
