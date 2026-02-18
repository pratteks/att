import { moveInstrumentation } from '../../../scripts/scripts.js';

/* --- Core carousel helpers --- */

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  block.querySelectorAll('.carousel-slide').forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  });

  block.querySelectorAll('.carousel-slide-indicator').forEach((indicator, idx) => {
    if (idx !== slideIndex) indicator.querySelector('button').removeAttribute('disabled');
    else indicator.querySelector('button').setAttribute('disabled', 'true');
  });
}

function showSlide(block, slideIndex = 0, behavior = 'smooth') {
  const slides = block.querySelectorAll('.carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior,
  });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev')?.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next')?.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

/* --- Story variant: vertical stack on desktop --- */

function decorateStoryVariant(block) {
  const storyLayout = document.createElement('div');
  storyLayout.classList.add('story-layout');

  const imagePanel = document.createElement('div');
  imagePanel.classList.add('story-image-panel');

  const itemsPanel = document.createElement('div');
  itemsPanel.classList.add('story-items-panel');

  const slides = block.querySelectorAll('.carousel-slide');
  slides.forEach((slide, idx) => {
    const img = slide.querySelector('.carousel-slide-image picture');
    if (img) {
      const storyImage = document.createElement('div');
      storyImage.classList.add('story-image');
      if (idx === 0) storyImage.classList.add('active');
      storyImage.append(img.cloneNode(true));
      imagePanel.append(storyImage);
    }

    const item = document.createElement('div');
    item.classList.add('story-item');
    if (idx === 0) item.classList.add('active');

    const content = slide.querySelector('.carousel-slide-content');
    if (content) item.append(content.cloneNode(true));

    const arrow = document.createElement('div');
    arrow.classList.add('story-item-arrow');
    item.append(arrow);

    item.addEventListener('click', () => {
      itemsPanel.querySelectorAll('.story-item').forEach((i) => i.classList.remove('active'));
      imagePanel.querySelectorAll('.story-image').forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      imagePanel.children[idx]?.classList.add('active');
    });

    itemsPanel.append(item);
  });

  storyLayout.append(imagePanel, itemsPanel);
  block.append(storyLayout);
}

/* --- Main decoration --- */

let carouselId = 0;

async function decorateCarousel(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
      <button type="button" class="slide-next" aria-label="Next Slide"></button>
    `;
    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="Show Slide ${idx + 1} of ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) bindEvents(block);

  /* Story variant: build desktop vertical layout */
  if (block.classList.contains('story')) {
    decorateStoryVariant(block);
  }
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: async ({ block }) => decorateCarousel(block),
    },
  };
}
