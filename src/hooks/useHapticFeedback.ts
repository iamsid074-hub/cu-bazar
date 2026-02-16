/**
 * useHapticFeedback Hook
 * Apple-style haptic feedback for touch interactions
 * Works on iOS Safari and Android devices with Vibration API
 */

export const useHapticFeedback = () => {
  // Check if vibrate API is available
  const isVibrationSupported = () => {
    return !!(navigator && 'vibrate' in navigator);
  };

  /**
   * Light haptic - subtle tap feeling
   * Great for button clicks
   */
  const light = () => {
    if (isVibrationSupported()) {
      navigator.vibrate(10);
    }
  };

  /**
   * Medium haptic - noticeable tap
   * For important actions
   */
  const medium = () => {
    if (isVibrationSupported()) {
      navigator.vibrate(30);
    }
  };

  /**
   * Heavy haptic - strong tap
   * For critical actions or errors
   */
  const heavy = () => {
    if (isVibrationSupported()) {
      navigator.vibrate(50);
    }
  };

  /**
   * Selection haptic - pattern for selection changes
   * iOS style: [30, 10, 30]
   */
  const selection = () => {
    if (isVibrationSupported()) {
      navigator.vibrate([30, 10, 30]);
    }
  };

  /**
   * Success haptic - three quick taps
   * For successful actions
   */
  const success = () => {
    if (isVibrationSupported()) {
      navigator.vibrate([10, 20, 10, 20, 10]);
    }
  };

  /**
   * Error haptic - strong double tap
   * For errors or warnings
   */
  const error = () => {
    if (isVibrationSupported()) {
      navigator.vibrate([50, 50, 50]);
    }
  };

  return { light, medium, heavy, selection, success, error };
};