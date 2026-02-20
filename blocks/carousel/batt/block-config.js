import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * BATT Carousel — brand-specific decoration.
 *
 * AEM 6.5 Component Mapping:
 *   carousel (sling:resourceType = att/components/content/carousel)
 *     → slide items: image, title, description, ctaLink, ctaText
 *   Equivalent AEM 6.5 dialog fields:
 *     - image       → ./fileReference (pathfield, dam asset)
 *     - title       → ./jcr:title (textfield)
 *     - description → ./jcr:description (richtext)
 *     - ctaLink     → ./linkURL (pathfield)
 *     - ctaText     → ./linkText (textfield)
 *     - autoplay    → ./autoplay (checkbox)
 *     - interval    → ./interval (numberfield, ms)
 */
function decorateBattCarousel(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const track = document.createElement('div');
  track.className = 'carousel-track';

  rows.forEach((row, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    if (index === 0) slide.classList.add('active');
    moveInstrumentation(row, slide);

    const cells = [...row.children];
    cells.forEach((cell) => {
      if (cell.querySelector('picture')) {
        cell.className = 'carousel-slide-image';
      } else {
        cell.className = 'carousel-slide-body';

        // Classify text elements
        cell.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
          h.classList.add('carousel-slide-heading');
        });

        cell.querySelectorAll('p').forEach((p) => {
          const link = p.querySelector('a');
          if (link) {
            link.classList.add('button');
            p.classList.add('button-container', 'carousel-slide-cta');
          } else {
            p.classList.add('carousel-slide-description');
          }
        });
      }
      slide.appendChild(cell);
    });

    track.appendChild(slide);
  });

  block.textContent = '';
  block.appendChild(track);

  // Navigation arrows
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-arrow carousel-arrow-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '&#8249;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-arrow carousel-arrow-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '&#8250;';

  block.appendChild(prevBtn);
  block.appendChild(nextBtn);

  // Dot navigation
  const slides = track.querySelectorAll('.carousel-slide');

  // Carousel logic
  let currentSlide = 0;
  const isSingle = block.classList.contains('single-slide');
  const slideCount = slides.length;

  function goToSlide(index) {
    currentSlide = index;
    const offset = isSingle ? index * 100 : index * 33.333;
    track.style.transform = `translateX(-${offset}%)`;

    block.querySelectorAll('.carousel-nav button').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
  }

  if (slides.length > 1) {
    const nav = document.createElement('div');
    nav.className = 'carousel-nav';

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      nav.appendChild(dot);
    });

    block.appendChild(nav);
  }

  prevBtn.addEventListener('click', () => {
    const maxSlide = isSingle ? slideCount - 1 : Math.max(0, slideCount - 3);
    goToSlide(currentSlide > 0 ? currentSlide - 1 : maxSlide);
  });

  nextBtn.addEventListener('click', () => {
    const maxSlide = isSingle ? slideCount - 1 : Math.max(0, slideCount - 3);
    goToSlide(currentSlide < maxSlide ? currentSlide + 1 : 0);
  });

  // Auto-play
  if (block.classList.contains('auto-play')) {
    setInterval(() => {
      const maxSlide = isSingle ? slideCount - 1 : Math.max(0, slideCount - 3);
      goToSlide(currentSlide < maxSlide ? currentSlide + 1 : 0);
    }, 5000);
  }
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattCarousel,
    },
  };
}
