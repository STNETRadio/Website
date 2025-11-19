# STNET Radio Website

Welcome to the source code repository for **STNET Radio**, a web platform dedicated to podcasts, storytelling, and audio content. This project supports a dual-language interface (English and Thai) and features a responsive design tailored for listeners.

## 📖 Project Overview

STNET Radio is built to be "A Home for Podcasts," offering curated listening experiences, original series, and a premium subscription service known as **SNR+**.

### Key Features
* **Multi-language Support**: 
    * **English**: Default experience located at the root.
    * **Thai**: Localized experience located in the `/th/` directory.
* **Dynamic Podcast Listing**: A dedicated section to browse and filter podcasts (Originals, History, Documentary).
* **Responsive Design**: Optimized for mobile and desktop with custom breakpoints and touch-friendly navigation.
* **Premium Integration**: Informational pages for **STNET Radio+** (Ad-free listening, bonus content).
* **Custom Typography**: Utilizes *Chillax* for branding and *IBM Plex Sans Thai / Poppins / Source Sans 3* for UI text.

## 📂 Directory Structure

The project is organized as follows:

```text
stnetradio/
├── CSS/                 # Global and specific stylesheets
│   ├── brand.css        # Global branding variables (colors, fonts)
│   ├── index.css        # Homepage specific styles
│   ├── podcast/         # Styles for podcast listing pages
│   └── ...
├── JavaScript/          # Client-side logic
│   └── podcast/         # Scripts for rendering podcast lists and filtering
├── fonts/               # Self-hosted font files (Chillax, etc.)
├── img/                 # Static assets (Logos, icons, banners)
├── th/                  # Thai language localization
│   ├── index.html       # Thai Homepage
│   ├── plus/            # Thai SNR+ pages
│   └── podcast/         # Thai Podcast pages
├── plus/                # English SNR+ (Premium) section
├── podcast/             # English Podcast listing section
├── index.html           # Main Entry Point (English Homepage)
├── Privacy-Policy.html  # Legal documentation
└── Terms-of-Service.html# Legal documentation
````

## 🛠️ Tech Stack

  * **HTML5**: Semantic markup for accessibility and SEO.
  * **CSS3**:
      * Uses **CSS Variables** (`var(--red)`, `var(--bg)`) for consistent theming.
      * **Flexbox & Grid** layout systems.
      * Animations (Fade-in, Slide-in) for visual engagement.
  * **JavaScript (Vanilla)**: Used for dynamic content rendering (Podcast grid), mobile navigation toggles, and sticky header logic.

## 🚀 Getting Started

To view the website locally:

1.  **Clone or Download** this repository.
2.  Open `index.html` in your preferred web browser.
3.  Navigate through the links to explore different sections (Podcasts, SNR+, Thai version).

> **Note**: Some font files are served locally from the `/fonts/` directory. Ensure this folder is present for correct typography rendering.

## 🎨 Customization

### Branding

Global styles are defined in `CSS/brand.css`. You can adjust the following variables to change the look and feel:

  * `--red`: Primary brand accent color.
  * `--bg`: Background color.
  * `--text`: Main text color.

### Adding Podcasts

Podcast data is handled via the JavaScript files located in `JavaScript/podcast/`. To update the list, verify the data source referenced in `index.js`.

## 📜 License & Copyright

**© 2025 STNET Radio.** All rights reserved.

  * Privacy Policy: `/Privacy-Policy.html`
  * Terms of Service: `/Terms-of-Service.html`