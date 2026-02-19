/**
 * Pricing block — Global config demonstrating ALL block-config.js features:
 *
 *  1. flags          — feature toggles consumed by decoration functions
 *  2. decorations    — lifecycle hooks: beforeDecorate → decorate → afterDecorate
 *  3. variations     — class-based dispatch (inline method AND module import)
 *  4. cacheResetHandlers — restore state after bfcache navigation
 *
 * Expected authored structure (each row = one pricing plan):
 *   Row N:
 *     Cell 0: Plan name (text)
 *     Cell 1: Price      (text, e.g. "$29.99")
 *     Cell 2: Period     (text, e.g. "/month")
 *     Cell 3: Features   (paragraph per feature)
 *     Cell 4: CTA link   (<a>)
 */

/* ── 1. FLAGS ───────────────────────────────────────────────────────── */

const DEFAULT_FLAGS = {
  highlightBestValue: true,
  bestValueIndex: 1,
  showPeriod: true,
  currency: 'USD',
};

/* ── 2. DECORATIONS ─────────────────────────────────────────────────── */

function beforeDecorate(block, blockConfig) {
  const planCount = block.children.length;
  block.dataset.planCount = planCount;
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label',
    `Pricing plans — ${planCount} option${planCount !== 1 ? 's' : ''}`);

  if (blockConfig.flags.currency) {
    block.dataset.currency = blockConfig.flags.currency;
  }
}

function decoratePricing(block, blockConfig) {
  const { highlightBestValue, bestValueIndex, showPeriod } = blockConfig.flags;

  const grid = document.createElement('ul');
  grid.className = 'pricing-grid';

  [...block.children].forEach((row, index) => {
    const cells = [...row.children];
    const plan = document.createElement('li');
    plan.className = 'pricing-plan';

    if (highlightBestValue && index === bestValueIndex) {
      plan.classList.add('pricing-plan-best-value');
    }

    const name = document.createElement('div');
    name.className = 'pricing-plan-name';
    name.textContent = cells[0]?.textContent?.trim() || '';
    plan.append(name);

    const price = document.createElement('div');
    price.className = 'pricing-plan-price';
    price.textContent = cells[1]?.textContent?.trim() || '';
    plan.append(price);

    if (showPeriod && cells[2]) {
      const period = document.createElement('div');
      period.className = 'pricing-plan-period';
      period.textContent = cells[2].textContent.trim();
      plan.append(period);
    }

    if (cells[3]) {
      const features = document.createElement('ul');
      features.className = 'pricing-plan-features';
      const items = cells[3].querySelectorAll('p');
      items.forEach((p) => {
        const li = document.createElement('li');
        li.textContent = p.textContent.trim();
        features.append(li);
      });
      plan.append(features);
    }

    const ctaSource = cells[4] || cells[3];
    const ctaLink = ctaSource?.querySelector('a');
    if (ctaLink) {
      const cta = document.createElement('div');
      cta.className = 'pricing-plan-cta';
      cta.append(ctaLink.cloneNode(true));
      plan.append(cta);
    }

    grid.append(plan);
  });

  block.replaceChildren(grid);
}

function afterDecorate(block) {
  block.querySelectorAll('.pricing-plan-cta a').forEach((a) => {
    const planName = a.closest('.pricing-plan')
      ?.querySelector('.pricing-plan-name')?.textContent || '';
    a.dataset.analyticsLabel = `pricing-cta-${planName.toLowerCase().replace(/\s+/g, '-')}`;
  });
}

/* ── 3. VARIATIONS ──────────────────────────────────────────────────── */

function decorateCompact(block) {
  block.querySelectorAll('.pricing-plan').forEach((plan) => {
    plan.classList.add('pricing-plan-compact');
  });
}

/* ── 4. CACHE RESET HANDLERS ────────────────────────────────────────── */

function resetPricingState(block) {
  block.querySelectorAll('.pricing-plan-cta a').forEach((a) => {
    a.classList.remove('clicked');
  });
}

/* ── EXPORT ──────────────────────────────────────────────────────────── */

export default async function getBlockConfigs() {
  return {
    flags: { ...DEFAULT_FLAGS },

    decorations: {
      beforeDecorate,
      decorate: decoratePricing,
      afterDecorate,
    },

    variations: [
      { variation: 'compact', method: decorateCompact },
      { variation: 'detailed', module: 'pricing-detailed.js' },
    ],

    cacheResetHandlers: [resetPricingState],
  };
}
