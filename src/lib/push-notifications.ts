import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

/**
 * Initialize push notifications on native platforms.
 * Call after the user is authenticated.
 * No-ops on web — push is only available on iOS/Android.
 */
export async function initPushNotifications() {
  if (!Capacitor.isNativePlatform()) return;

  const permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    const result = await PushNotifications.requestPermissions();
    if (result.receive !== 'granted') return;
  } else if (permStatus.receive !== 'granted') {
    return;
  }

  await PushNotifications.register();

  PushNotifications.addListener('registration', (token) => {
    // TODO: Send token.value to backend for storage
    console.log('[Push] Registration token:', token.value);
  });

  PushNotifications.addListener('registrationError', (error) => {
    console.error('[Push] Registration error:', error);
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('[Push] Notification received:', notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('[Push] Action performed:', action);
  });
}
