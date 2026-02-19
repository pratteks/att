/**
 * "detailed" variation — loaded as a separate module via the config's
 * `variations: [{ variation: 'detailed', module: 'pricing-detailed.js' }]`
 *
 * Adds expandable feature descriptions to each plan.
 */
export default function decorate(block) {
  block.querySelectorAll('.pricing-plan-features li').forEach((li) => {
    li.classList.add('pricing-feature-detailed');
  });

  block.classList.add('pricing-detailed-view');
}
