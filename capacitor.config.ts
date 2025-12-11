import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'ai.xuavanay.app',
  appName: 'Xưa và Nay',
  webDir: 'www',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    CapacitorHttp:{
      enabled:false
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
		Keyboard: {
			resize: KeyboardResize.Native,
      resizeOnFullScreen: false
		},
		StatusBar: {
			style: 'Light',
			backgroundColor: '#ffffff',
			overlaysWebView: false
		},
		EdgeToEdge: {
			backgroundColor: "#ffffff"
		},
  },
  server: {
    androidScheme: 'https',
    cleartext: true,
  }
};

export default config;
