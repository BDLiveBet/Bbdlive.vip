/**
 * Button Interaction Physics & Visual Feedback Engine
 * BDLiveBet.vip - Clean Multi-Color Outer Border Edge Light & Tactile 3D Press
 *
 * Requirements:
 * 1. Disabled surface overlay & smoke effect (button face stays 100% clean & readable)
 * 2. Multi-color border edge light matched to categories:
 *    - Gold / Yellow: JILI slots & default
 *    - Cyan: PG soft, live casino
 *    - Emerald Green: Deposit, cashout, withdraw
 *    - Purple: Promo, reward, VIP, bonuses
 * 3. Crisp outline: strictly along outer border without spreading over button face
 */

export type EdgeColorCategory = 'gold' | 'cyan' | 'emerald' | 'purple';

// Soft satisfying vibration pulse (18ms) on mobile devices
export function triggerHaptic(duration = 18): void {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Safe fallback for environments where vibration is restricted
    }
  }
}

/**
 * Detects the category of an interactive button based on data attributes,
 * element id, class names, and button label context.
 */
export function detectButtonCategory(btn: HTMLElement): EdgeColorCategory {
  // 1. Explicit data-edge or data-category attribute
  const explicitEdge = (
    btn.getAttribute('data-edge') ||
    btn.getAttribute('data-category') ||
    ''
  ).toLowerCase();

  if (['emerald', 'green', 'deposit', 'withdraw', 'cashout'].includes(explicitEdge)) return 'emerald';
  if (['cyan', 'blue', 'pg'].includes(explicitEdge)) return 'cyan';
  if (['purple', 'promo', 'reward', 'vip', 'bonus'].includes(explicitEdge)) return 'purple';
  if (['gold', 'yellow', 'jili'].includes(explicitEdge)) return 'gold';

  // 2. Check closest container with data attributes
  const providerParent = btn.closest('[data-provider]');
  if (providerParent) {
    const prov = (providerParent.getAttribute('data-provider') || '').toUpperCase();
    if (prov === 'PG') return 'cyan';
    if (prov === 'JILI') return 'gold';
  }

  // 3. Inspect id, classes, text, and aria-labels
  const idStr = (btn.id || '').toLowerCase();
  const clsStr = (btn.className || '').toLowerCase();
  const ariaStr = (btn.getAttribute('aria-label') || '').toLowerCase();
  const textStr = (btn.textContent || '').toLowerCase();
  const combined = `${idStr} ${clsStr} ${ariaStr} ${textStr}`;

  // Deposit / Cashout / Withdraw / Money / Banking
  if (
    combined.includes('deposit') ||
    combined.includes('withdraw') ||
    combined.includes('cashout') ||
    combined.includes('ডিপোজিট') ||
    combined.includes('উত্তোলন') ||
    combined.includes('bank') ||
    combined.includes('ব্যাংক') ||
    combined.includes('payment') ||
    combined.includes('পেমেন্ট') ||
    combined.includes('টাকা') ||
    combined.includes('wallet') ||
    btn.closest('#deposit-modal, #withdraw-modal, [data-modal="deposit"], [data-modal="withdraw"]')
  ) {
    return 'emerald';
  }

  // PG / Live Casino / Cyan / Blue
  if (
    combined.includes('pg-') ||
    combined.includes('pg ') ||
    combined.includes('pgsoft') ||
    combined.includes('live casino') ||
    combined.includes('লাইভ') ||
    combined.includes('casino') ||
    combined.includes('cyan') ||
    combined.includes('support') ||
    combined.includes('সাপোর্ট')
  ) {
    return 'cyan';
  }

  // Promo / Reward / VIP / Bonus / Gift / Agent
  if (
    combined.includes('promo') ||
    combined.includes('reward') ||
    combined.includes('bonus') ||
    combined.includes('vip') ||
    combined.includes('agent') ||
    combined.includes('gift') ||
    combined.includes('claim') ||
    combined.includes('দাবি') ||
    combined.includes('প্রমোশন') ||
    combined.includes('রিওয়ার্ড') ||
    combined.includes('বোনাস') ||
    combined.includes('share') ||
    combined.includes('invite') ||
    btn.closest('#promotions-modal, #reward-center-modal, [data-modal="promo"]')
  ) {
    return 'purple';
  }

  // JILI / Slots / Gold / Default
  return 'gold';
}

const ALL_EDGE_CLASSES = [
  'edge-pressed-gold',
  'edge-pressed-cyan',
  'edge-pressed-emerald',
  'edge-pressed-purple'
];

/**
 * Global Interceptor: automatically manages 3D tactile push, mobile haptics,
 * and category-based crisp outer border edge glow.
 */
export function initGlobalButtonEffects(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  // Find closest interactive button or button-like element
  const getButton = (target: EventTarget | null): HTMLElement | null => {
    if (!target || !(target instanceof Element)) return null;
    return target.closest<HTMLElement>(
      'button, [role="button"], input[type="button"], input[type="submit"], .btn-tactile, .btn-3d'
    );
  };

  // Pointerdown handler for instant 3D tactile push and crisp outer edge light
  const handlePointerDown = (e: PointerEvent) => {
    const btn = getButton(e.target);
    if (!btn || btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true') {
      return;
    }

    // Trigger subtle 18ms haptic vibration pulse immediately on mobile touch
    triggerHaptic(18);

    // Remove any previous edge classes
    btn.classList.remove(...ALL_EDGE_CLASSES);

    // Detect dynamic category (gold, cyan, emerald, purple)
    const category = detectButtonCategory(btn);
    btn.classList.add('btn-3d-pressed', `edge-pressed-${category}`);
  };

  const handlePointerUpOrLeave = (e: PointerEvent) => {
    const btn = getButton(e.target);
    if (btn) {
      setTimeout(() => {
        btn.classList.remove('btn-3d-pressed', ...ALL_EDGE_CLASSES);
      }, 100);
    }
  };

  // Keyboard navigation support (Space / Enter)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const btn = getButton(e.target);
      if (btn && !btn.hasAttribute('disabled') && btn.getAttribute('aria-disabled') !== 'true') {
        triggerHaptic(18);
        const category = detectButtonCategory(btn);
        btn.classList.add('btn-3d-pressed', `edge-pressed-${category}`);
        setTimeout(() => {
          btn.classList.remove('btn-3d-pressed', ...ALL_EDGE_CLASSES);
        }, 180);
      }
    }
  };

  document.addEventListener('pointerdown', handlePointerDown, { passive: true, capture: true });
  document.addEventListener('pointerup', handlePointerUpOrLeave, { passive: true, capture: true });
  document.addEventListener('pointercancel', handlePointerUpOrLeave, { passive: true, capture: true });
  document.addEventListener('keydown', handleKeyDown, { passive: true, capture: true });

  return () => {
    document.removeEventListener('pointerdown', handlePointerDown, { capture: true });
    document.removeEventListener('pointerup', handlePointerUpOrLeave, { capture: true });
    document.removeEventListener('pointercancel', handlePointerUpOrLeave, { capture: true });
    document.removeEventListener('keydown', handleKeyDown, { capture: true });
  };
}
