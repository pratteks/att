/**
 * BATT Video — brand-specific decoration.
 *
 * AEM 6.5 Component Mapping:
 *   video (sling:resourceType = att/components/content/video)
 *   Equivalent AEM 6.5 dialog fields:
 *     - videoURL       → ./videoURL (textfield, YouTube/Vimeo URL)
 *     - posterImage    → ./fileReference (pathfield, dam asset)
 *     - posterAlt      → ./alt (textfield)
 *     - caption        → ./caption (textfield)
 *     - autoplay       → ./autoplay (checkbox)
 *     - openInModal    → ./openInModal (checkbox)
 */

function convertToEmbedUrl(url, autoplay = false) {
  if (!url) return '';
  let embedUrl = url;

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
    if (autoplay) embedUrl += '&autoplay=1&mute=1';
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    if (autoplay) embedUrl += '?autoplay=1&muted=1';
  }

  return embedUrl;
}

function createVideoEmbed(embedUrl) {
  const embed = document.createElement('div');
  embed.className = 'video-embed';
  const iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
  iframe.setAttribute('loading', 'lazy');
  embed.appendChild(iframe);
  return embed;
}

function openVideoModal(embedUrl) {
  const overlay = document.createElement('div');
  overlay.className = 'video-modal-overlay';

  const content = document.createElement('div');
  content.className = 'video-modal-content';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'video-modal-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close video');
  closeBtn.addEventListener('click', () => overlay.remove());

  const autoplayUrl = embedUrl.includes('?') ? `${embedUrl}&autoplay=1` : `${embedUrl}?autoplay=1`;
  const iframe = document.createElement('iframe');
  iframe.src = autoplayUrl;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay; fullscreen');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  content.appendChild(closeBtn);
  content.appendChild(iframe);
  overlay.appendChild(content);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}

function decorateBattVideo(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  let videoUrl = '';
  let posterPicture = null;
  let caption = '';

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const picture = cell.querySelector('picture');
      const link = cell.querySelector('a');
      if (picture) {
        posterPicture = picture;
      } else if (link) {
        videoUrl = link.href;
      } else {
        const text = cell.textContent.trim();
        if (text && !videoUrl && (text.includes('youtube') || text.includes('vimeo') || text.includes('youtu.be'))) {
          videoUrl = text;
        } else if (text) {
          caption = text;
        }
      }
    });
  });

  block.textContent = '';

  const isModal = block.classList.contains('modal');
  const isAutoplay = block.classList.contains('autoplay');

  // Convert YouTube URLs to embed format
  const embedUrl = convertToEmbedUrl(videoUrl, isAutoplay);

  if (posterPicture && isModal) {
    // Modal mode: poster click opens video overlay
    const placeholder = document.createElement('div');
    placeholder.className = 'video-placeholder';
    placeholder.appendChild(posterPicture);

    const playBtn = document.createElement('button');
    playBtn.className = 'video-play-btn';
    playBtn.setAttribute('aria-label', 'Play video');
    placeholder.appendChild(playBtn);

    placeholder.addEventListener('click', () => openVideoModal(embedUrl));
    block.appendChild(placeholder);
  } else if (posterPicture) {
    // Inline mode: poster click replaces with iframe
    const placeholder = document.createElement('div');
    placeholder.className = 'video-placeholder';
    placeholder.appendChild(posterPicture);

    const playBtn = document.createElement('button');
    playBtn.className = 'video-play-btn';
    playBtn.setAttribute('aria-label', 'Play video');
    placeholder.appendChild(playBtn);

    placeholder.addEventListener('click', () => {
      const embed = createVideoEmbed(embedUrl);
      placeholder.replaceWith(embed);
    });

    block.appendChild(placeholder);
  } else if (embedUrl) {
    // No poster: embed directly
    block.appendChild(createVideoEmbed(embedUrl));
  }

  if (caption) {
    const captionEl = document.createElement('p');
    captionEl.className = 'video-caption';
    captionEl.textContent = caption;
    block.appendChild(captionEl);
  }
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattVideo,
    },
  };
}
