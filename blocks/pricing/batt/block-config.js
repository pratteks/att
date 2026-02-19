/**
 * BATT brand pricing — overrides bestValueIndex and adds brand afterDecorate.
 *
 * Merge result:
 *   flags.highlightBestValue  → true (from global, not overridden)
 *   flags.bestValueIndex      → 0 (brand overrides global's 1)
 *   decorations.beforeDecorate → from global (brand doesn't replace it)
 *   decorations.decorate       → from global (brand doesn't replace it)
 *   decorations.afterDecorate  → from BRAND (replaces global's afterDecorate)
 *   variations                 → global [compact, detailed] + brand [enterprise]
 */

function afterDecorate(block) {
  block.querySelectorAll('.pricing-plan-cta a').forEach((a) => {
    a.dataset.brand = 'batt';
    const planName = a.closest('.pricing-plan')
      ?.querySelector('.pricing-plan-name')?.textContent || '';
    a.dataset.analyticsLabel = `batt-pricing-${planName.toLowerCase().replace(/\s+/g, '-')}`;
  });
}

function decorateEnterprise(block) {
  block.querySelectorAll('.pricing-plan').forEach((plan) => {
    plan.classList.add('pricing-plan-enterprise');
  });
}

export default async function getBlockConfigs() {
  return {
    flags: {
      bestValueIndex: 0,
    },
    decorations: {
      afterDecorate,
    },
    variations: [
      { variation: 'enterprise', method: decorateEnterprise },
    ],
  };
}
