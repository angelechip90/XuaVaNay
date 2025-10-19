import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { IonCard, IonItem, IonIcon, IonInput, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { micOffOutline, micOutline, sendOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-input-chat',
  templateUrl: './input-chat.component.html',
  styleUrls: ['./input-chat.component.scss'],
  standalone: true,
  imports: [IonCard, IonIcon, IonInput, IonButton, CommonModule, FormsModule]
})
export class InputChatComponent implements OnInit {
  @Input() placeholder: any = 'Câu hỏi của bạn...';
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() sendMessage = new EventEmitter<string>();

  searchText: string = '';
  isRecording: boolean = false;
  private recognition: any;

  constructor() {
    addIcons({
      micOutline,
      micOffOutline,
      sendOutline
    });
  }

  ngOnInit() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'vi-VN';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.searchText = transcript;
        this.valueChange.emit(transcript);
        this.isRecording = false;
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isRecording = false;
      };

      this.recognition.onend = () => {
        this.isRecording = false;
      };
    }
  }

  onValueChange(event: any) {
    const value = event.detail?.value || event.target?.value || '';
    this.searchText = value;
    this.valueChange.emit(value);
  }

  toggleVoiceInput() {
    if (!this.recognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    } else {
      this.recognition.start();
      this.isRecording = true;
    }
  }

  onSend() {
    if (this.searchText.trim()) {
      this.sendMessage.emit(this.searchText);
      this.searchText = '';
    }
  }
}
