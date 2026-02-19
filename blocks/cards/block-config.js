import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Base cards decoration — restructures rows into a <ul> card grid.
 * Reads `flags.showImage` to optionally strip card images.
 */
function decorateCards(block, blockConfig) {
  const { showImage = true } = blockConfig?.flags || {};

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        if (showImage) {
          div.className = 'cards-card-image';
        } else {
          div.remove();
        }
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);
}

/**
 * "horizontal" variation — switches card layout to side-by-side image + body.
 * Activated when the block has the class "horizontal" (e.g. Cards (horizontal)).
 */
function decorateHorizontal(block) {
  block.querySelectorAll('li').forEach((li) => {
    li.classList.add('cards-card-horizontal');
  });
}

export default async function getBlockConfigs() {
  return {
    flags: {
      showImage: true,
      cardStyle: 'default',
    },
    variations: [
      { variation: 'horizontal', method: decorateHorizontal },
    ],
    decorations: {
      decorate: decorateCards,
    },
  };
}
