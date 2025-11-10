import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.xuavanay.app',
  appName: 'Xưa và Nay',
  webDir: 'www',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    CapacitorHttp:{
      enabled:true
    },
    SplashScreen:{
      launchAutoHide:true,
      launchShowDuration:2000,
      splashFullScreen:true,
      splashImmersive:true,
    },
    Badge: {
      persist: false,
      autoClear: false,
    },
  },
  server: {
    androidScheme: 'https',
    cleartext: true,
  }
};

export default config;
