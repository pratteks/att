/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AT&T Business (batt) cleanup.
 * Removes non-authorable content from the DOM.
 * Selectors from captured DOM at https://www.business.att.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie banners, consent dialogs, overlays
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '.gdpr-banner',
      '.chat-widget',
      '#att-chat',
    ]);

    // Remove hidden/spoken content that duplicates visible text
    WebImporter.DOMUtils.remove(element, [
      '.hidden-spoken',
      '.hide',
    ]);

    // Remove swiper navigation/pagination (non-authorable)
    WebImporter.DOMUtils.remove(element, [
      '.swiper-button-prev',
      '.swiper-button-next',
      '.swiper-pagination',
      '.swiper-notification',
    ]);

    // Remove timer/countdown elements (dynamic, non-authorable)
    WebImporter.DOMUtils.remove(element, [
      '.timer-container',
      '.timer-1',
      '.timer-2',
      '.timer:empty',
    ]);
  }

  if (hookName === H.after) {
    // Remove header/navigation (non-authorable global chrome)
    WebImporter.DOMUtils.remove(element, [
      '.global-navigation',
      '.main-header-wrapper',
      'header',
      'nav.main-nav',
      '.utility-nav',
      '.search-overlay',
    ]);

    // Remove footer (handled as fragment, not per-page content)
    WebImporter.DOMUtils.remove(element, [
      '.footer-page-css-includes',
      'footer',
    ]);

    // Remove iframes, noscript, link tags
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
    ]);

    // Remove empty decorative elements
    WebImporter.DOMUtils.remove(element, [
      '.max-width-background:empty',
      '.absolute-fill',
      '.price-comp-wrapper:not(:has(.price-amount-qty))',
    ]);

    // Remove tracking attributes
    element.querySelectorAll('.att-track').forEach((el) => {
      el.classList.remove('att-track');
    });
    element.querySelectorAll('[data-track]').forEach((el) => {
      el.removeAttribute('data-track');
    });
    element.querySelectorAll('.bs-modal-anchor').forEach((el) => {
      el.classList.remove('bs-modal-anchor');
      el.classList.remove('prevent-scroll');
    });
  }
}
