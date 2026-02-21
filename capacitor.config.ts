import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.astr.app',
  appName: 'astr',
  webDir: 'out',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://your-deployed-url.vercel.app',
    cleartext: false,
  },
  ios: {
    scheme: 'astr',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#000000',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000',
    },
  },
};

export default config;
