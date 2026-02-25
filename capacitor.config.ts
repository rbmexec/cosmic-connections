import type { CapacitorConfig } from '@capacitor/cli';

const isProduction = process.env.CAPACITOR_ENV === 'production';
const productionUrl = 'https://cosmic-connections-nine.vercel.app';

const config: CapacitorConfig = {
  appId: 'com.astr.app',
  appName: 'astr',
  webDir: 'out',
  server: {
    url: isProduction ? productionUrl : 'http://localhost:3000',
    cleartext: !isProduction,
  },
  backgroundColor: '#020617',
  ios: {
    scheme: 'astr',
    contentInset: 'always',
    backgroundColor: '#020617',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#000000',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
