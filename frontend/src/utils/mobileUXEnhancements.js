
/**
 * 📱 Mobile UX Enhancements
 * Utilities pour améliorer l'expérience mobile
 */

/**
 * Détecte si l'utilisateur est sur mobile
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Détecte si l'appareil supporte le touch
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Empêche le zoom sur double-tap (iOS)
 */
export const preventDoubleTapZoom = (element) => {
  let lastTap = 0;
  element.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
    }
    lastTap = currentTime;
  });
};

/**
 * Optimise les animations pour mobile
 */
export const getMobileAnimationDuration = () => {
  return isMobileDevice() ? 200 : 300;
};

/**
 * Taille minimale des boutons tactiles (44x44px recommandé)
 */
export const TOUCH_TARGET_SIZE = {
  minWidth: '44px',
  minHeight: '44px',
  padding: '12px'
};

/**
 * Breakpoints responsive
 */
export const MOBILE_BREAKPOINTS = {
  xs: 0,      // 0-600px
  sm: 600,    // 600-960px
  md: 960,    // 960-1280px
  lg: 1280,   // 1280-1920px
  xl: 1920    // 1920px+
};

/**
 * Gestion du clavier virtuel (iOS/Android)
 */
export const handleVirtualKeyboard = () => {
  if (isMobileDevice()) {
    // Scroll vers le champ en focus
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        setTimeout(() => {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      });
    });
  }
};

/**
 * Optimise les images pour mobile
 */
export const getMobileImageQuality = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === '4g') return 'high';
    if (effectiveType === '3g') return 'medium';
    return 'low';
  }
  return 'medium';
};

/**
 * Debounce pour les interactions tactiles
 */
export const touchDebounce = (func, wait = 150) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default {
  isMobileDevice,
  isTouchDevice,
  preventDoubleTapZoom,
  getMobileAnimationDuration,
  TOUCH_TARGET_SIZE,
  MOBILE_BREAKPOINTS,
  handleVirtualKeyboard,
  getMobileImageQuality,
  touchDebounce
};
