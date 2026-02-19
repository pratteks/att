/**
 * FirstNet brand — bordered card style, hides images by default.
 *
 * Merged with the global config via mergeConfig():
 *   flags:       global { showImage, cardStyle } + brand { showImage, cardStyle } → both overridden
 *   variations:  global [ horizontal ] + brand [ compact ] → both available
 *   decorations: global { decorate } + brand { beforeDecorate } → both run
 */

function beforeDecorate(block) {
  block.classList.add('cards-firstnet');
}

function decorateCompact(block) {
  block.querySelectorAll('li').forEach((li) => {
    li.classList.add('cards-card-compact');
  });
}

export default async function getBlockConfigs() {
  return {
    flags: {
      showImage: false,
      cardStyle: 'bordered',
    },
    variations: [
      { variation: 'compact', method: decorateCompact },
    ],
    decorations: {
      beforeDecorate,
    },
  };
}
