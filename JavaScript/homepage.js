document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('latestEpisodes');
  if (!container) return;

  const feeds = [
    {
      show: 'เล่าเรื่องเก่ง',
      image: '/img/podcast/TMSA.png',
      rss: 'https://s3.ap-southeast-1.amazonaws.com/rss.stnetradio.com/STNETRadioEnt/TMSA/RSS.xml'
    },
    {
      show: 'Talking with LITALK',
      image: '/img/podcast/LITALK.png',
      rss: 'https://s3.ap-southeast-1.amazonaws.com/rss.stnetradio.com/SoaqerStudio/LITALKPodcast/RSS.xml'
    },
    {
      show: 'ติดกับเรื่องราว',
      image: '/img/podcast/TIDKAB.png',
      rss: 'https://anchor.fm/s/5b844008/podcast/rss'
    }
  ];

  const feedSources = [
    url => url,
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
  ];

  const cleanText = value => (value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  function getText(parent, selector) {
    const node = parent.querySelector(selector);
    return node ? node.textContent.trim() : '';
  }

  async function fetchFeed(url) {
    let lastError;
    for (const makeUrl of feedSources) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);
      try {
        const response = await fetch(makeUrl(url), {
          signal: controller.signal,
          headers: { Accept: 'application/rss+xml, application/xml, text/xml, */*' }
        });
        clearTimeout(timeout);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        const xml = new DOMParser().parseFromString(text, 'text/xml');
        if (xml.querySelector('parsererror') || !xml.querySelector('channel')) throw new Error('Invalid RSS response');
        return xml;
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;
      }
    }
    throw lastError || new Error('Feed unavailable');
  }

  function parseLatest(feed, xml) {
    const item = xml.querySelector('item');
    if (!item) return null;

    const title = cleanText(getText(item, 'title')) || 'Latest episode';
    const description = cleanText(getText(item, 'description'));
    const dateValue = getText(item, 'pubDate');
    const link = getText(item, 'link') || '/podcast/';
    const date = dateValue ? new Date(dateValue) : null;

    return {
      ...feed,
      title,
      description: description.length > 135 ? `${description.slice(0, 135).trim()}…` : description,
      link,
      timestamp: date && !Number.isNaN(date.getTime()) ? date.getTime() : 0,
      dateLabel: date && !Number.isNaN(date.getTime())
        ? new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
        : 'Latest release'
    };
  }

  function createEpisodeCard(episode) {
    const article = document.createElement('article');
    article.className = 'episode-card';

    const top = document.createElement('div');
    top.className = 'episode-top';

    const image = document.createElement('img');
    image.src = episode.image;
    image.alt = `${episode.show} artwork`;
    image.loading = 'lazy';

    const meta = document.createElement('div');
    const show = document.createElement('div');
    show.className = 'episode-show';
    show.textContent = episode.show;
    const date = document.createElement('div');
    date.className = 'episode-date';
    date.textContent = episode.dateLabel;
    meta.append(show, date);
    top.append(image, meta);

    const title = document.createElement('h3');
    title.textContent = episode.title;
    article.append(top, title);

    if (episode.description) {
      const description = document.createElement('p');
      description.textContent = episode.description;
      article.appendChild(description);
    }

    const link = document.createElement('a');
    link.href = episode.link;
    link.textContent = 'Listen to episode →';
    if (/^https?:\/\//.test(episode.link)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    article.appendChild(link);
    return article;
  }

  async function renderLatestEpisodes() {
    const results = await Promise.allSettled(
      feeds.map(async feed => parseLatest(feed, await fetchFeed(feed.rss)))
    );

    const episodes = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value)
      .sort((a, b) => b.timestamp - a.timestamp);

    container.replaceChildren();

    if (!episodes.length) {
      const fallback = document.createElement('div');
      fallback.className = 'episode-error';
      fallback.innerHTML = 'Latest episodes are temporarily unavailable. <a href="/podcast/">Open the podcast library →</a>';
      container.appendChild(fallback);
      return;
    }

    episodes.forEach(episode => container.appendChild(createEpisodeCard(episode)));
  }

  renderLatestEpisodes().catch(() => {
    container.innerHTML = '<div class="episode-error">Latest episodes are temporarily unavailable. <a href="/podcast/">Open the podcast library →</a></div>';
  });
});
