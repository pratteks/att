/**
 * FirstNet brand pricing — disables best-value highlighting.
 *
 * Merge result:
 *   flags.highlightBestValue  → false (brand overrides global's true)
 *   flags.showPeriod          → false (brand overrides global's true)
 *   decorations               → all from global (brand adds none)
 *   variations                → global [compact, detailed] only (brand adds none)
 */

export default async function getBlockConfigs() {
  return {
    flags: {
      highlightBestValue: false,
      showPeriod: false,
    },
    decorations: {},
    variations: [],
  };
}
