/**
 * BATT brand — adds rounded card style and a "featured" variation.
 *
 * Merged with the global config via mergeConfig():
 *   flags:       global { showImage, cardStyle } + brand { cardStyle } → cardStyle overridden
 *   variations:  global [ horizontal ] + brand [ featured ] → both available
 *   decorations: global { decorate } + brand { afterDecorate } → both run
 */

function afterDecorate(block, blockConfig) {
  const { cardStyle } = blockConfig.flags;
  if (cardStyle === 'rounded') {
    block.querySelectorAll('li').forEach((li) => {
      li.classList.add('cards-card-rounded');
    });
  }
}

function decorateFeatured(block) {
  const firstCard = block.querySelector('li');
  if (firstCard) {
    firstCard.classList.add('cards-card-featured');
  }
}

export default async function getBlockConfigs() {
  return {
    flags: {
      cardStyle: 'rounded',
    },
    variations: [
      { variation: 'featured', method: decorateFeatured },
    ],
    decorations: {
      afterDecorate,
    },
  };
}
