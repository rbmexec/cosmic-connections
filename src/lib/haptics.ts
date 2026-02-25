import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

const isNative = Capacitor.isNativePlatform();

export async function hapticImpact(style: ImpactStyle = ImpactStyle.Medium) {
  if (!isNative) return;
  await Haptics.impact({ style });
}

export async function hapticNotification(type: NotificationType = NotificationType.Success) {
  if (!isNative) return;
  await Haptics.notification({ type });
}

export async function hapticSelection() {
  if (!isNative) return;
  await Haptics.selectionStart();
  await Haptics.selectionEnd();
}

export { ImpactStyle, NotificationType };
