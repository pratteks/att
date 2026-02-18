import { renderBlock } from '../../scripts/multi-theme.js';

export default async function decorate(block) {
  await renderBlock(block);
}
