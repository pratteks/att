/**
 * BATT Countdown Timer — brand-specific decoration.
 *
 * AEM 6.5 Component Mapping:
 *   countdownTimer (sling:resourceType = att/components/content/countdownTimer)
 *   Equivalent AEM 6.5 dialog fields:
 *     - endDate     → ./endDate (datepicker, ISO date)
 *     - preText     → ./preText (textfield)
 *     - expiredText → ./expiredText (richtext)
 *     - showDays    → ./showDays (checkbox, default true)
 *     - showHours   → ./showHours (checkbox, default true)
 *     - showMinutes → ./showMinutes (checkbox, default true)
 *     - showSeconds → ./showSeconds (checkbox, default true)
 */

function updateCountdown(target, units, block, expiredContent) {
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    block.textContent = '';
    if (expiredContent) {
      block.appendChild(expiredContent);
    } else {
      block.textContent = 'Offer has ended';
    }
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const daysEl = units.querySelector('[data-unit="DAYS"]');
  const hrsEl = units.querySelector('[data-unit="HRS"]');
  const minEl = units.querySelector('[data-unit="MIN"]');
  const secEl = units.querySelector('[data-unit="SEC"]');

  if (daysEl) daysEl.textContent = days;
  if (hrsEl) hrsEl.textContent = hours;
  if (minEl) minEl.textContent = minutes;
  if (secEl) secEl.textContent = seconds;

  requestAnimationFrame(() => setTimeout(
    () => updateCountdown(target, units, block, expiredContent),
    1000,
  ));
}

function decorateBattCountdownTimer(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  let endDate = '';
  let preText = '';
  let expiredContent = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const [labelCell, valueCell] = cells;
      const label = labelCell.textContent.trim().toLowerCase();
      if (label === 'date' || label === 'end date' || label === 'end') {
        endDate = valueCell.textContent.trim();
      } else if (label === 'pre-text' || label === 'text' || label === 'label') {
        preText = valueCell.textContent.trim();
      } else if (label === 'expired' || label === 'expired text') {
        expiredContent = valueCell;
      }
    } else if (cells.length === 1) {
      // Single cell: try to parse as date or use as pre-text
      const [cell] = cells;
      const text = cell.textContent.trim();
      if (Date.parse(text)) {
        endDate = text;
      } else {
        preText = text;
      }
    }
  });

  block.textContent = '';

  if (preText) {
    const pre = document.createElement('div');
    pre.className = 'countdown-pre-text';
    pre.textContent = preText;
    block.appendChild(pre);
  }

  const units = document.createElement('div');
  units.className = 'countdown-units';

  const createUnit = (value, label) => {
    const unit = document.createElement('div');
    unit.className = 'countdown-unit';
    unit.innerHTML = `<span class="countdown-value" data-unit="${label}">${value}</span>
      <span class="countdown-label">${label}</span>`;
    return unit;
  };

  units.appendChild(createUnit('0', 'DAYS'));
  units.appendChild(createUnit('0', 'HRS'));
  units.appendChild(createUnit('0', 'MIN'));
  units.appendChild(createUnit('0', 'SEC'));

  block.appendChild(units);

  // Start countdown
  if (endDate) {
    const target = new Date(endDate).getTime();
    updateCountdown(target, units, block, expiredContent);
  }
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: decorateBattCountdownTimer,
    },
  };
}
