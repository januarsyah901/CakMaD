/**
 * Lightweight, privacy-first anonymous product telemetry.
 * Tracks only workflow event names without markdown or document content.
 */

const ANALYTICS_ENABLED_KEY = 'cakmad_analytics_enabled';

class AnalyticsTracker {
  constructor() {
    this.enabled = typeof window !== 'undefined' ? localStorage.getItem(ANALYTICS_ENABLED_KEY) !== 'false' : true;
  }

  /**
   * Track an event anonymously.
   * @param {string} eventName - Name of the event
   * @param {object} [metadata={}] - Non-sensitive metadata (counts, template ID, format)
   */
  track(eventName, metadata = {}) {
    if (!this.enabled) return;

    const payload = {
      event: eventName,
      timestamp: Date.now(),
      meta: {
        ...metadata,
        screen: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown'
      }
    };

    // Safe dev logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[CakMaD Analytics] ${eventName}`, payload.meta);
    }

    // Future hook for Plausible / Umami / PostHog custom dispatch
    try {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(eventName, { props: payload.meta });
      }
    } catch {
      // Fail silently to never break user flow
    }
  }

  setEnabled(value) {
    this.enabled = !!value;
    if (typeof window !== 'undefined') {
      localStorage.setItem(ANALYTICS_ENABLED_KEY, this.enabled.toString());
    }
  }

  isEnabled() {
    return this.enabled;
  }
}

export const analytics = new AnalyticsTracker();
