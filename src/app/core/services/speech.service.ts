import { Injectable } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  /** Kiểm tra thiết bị có hỗ trợ mic + speech */
  async isSupported(): Promise<any> {
    return await SpeechRecognition.available();
  }

  /** Kiểm tra quyền */
  async hasPermission(): Promise<boolean> {
    const perm = await SpeechRecognition.checkPermissions();
    return perm.speechRecognition === 'granted';
  }

  /** Request quyền */
  async requestPermission(): Promise<boolean> {
    const perm = await SpeechRecognition.requestPermissions();
    return perm.speechRecognition === 'granted';
  }

  /** Flow chuẩn: từ kiểm tra → nghe */
  async startListening(): Promise<string> {

    // 1️⃣ Hỗ trợ?
    const supported = await this.isSupported();
    if (!supported) {
      throw 'Thiết bị không hỗ trợ Speech Recognition';
    }

    // 2️⃣ Có quyền chưa?
    let granted = await this.hasPermission();

    // 3️⃣ Nếu chưa → xin quyền
    if (!granted) {
      granted = await this.requestPermission();
      if (!granted) {
        throw 'Người dùng từ chối quyền microphone';
      }
    }

    // 4️⃣ Bắt đầu nghe
    const result = await SpeechRecognition.start({
      language: 'vi-VN',
      partialResults: true,
      popup: false
    });

    // 👉 Chỉ chạy khi đã NGỪNG nghe
    return result.matches?.[0] || '';
  }

  stopListening(){
    SpeechRecognition.stop();
    SpeechRecognition.removeAllListeners();
  }
}
