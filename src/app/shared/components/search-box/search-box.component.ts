import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import {
  IonCard,
  IonItem,
  IonIcon,
  IonInput,
  IonModal,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { micOffOutline, micOutline, sendOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { SpeechService } from 'src/app/core/services/speech.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonItem,
    IonIcon,
    IonInput,
    IonModal,
    CommonModule,
    FormsModule,
  ],
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input() placeholder: any = 'Bạn cần hỏi về vấn đề gì ?';
  @Input() hasBtnOutSide: any = false;
  @Input() hideBtnSent: any = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() sendMessage = new EventEmitter<string>();

  searchText: string = '';
  isRecording: boolean = false;
  private recognition: any;
  svgId: string = `send-gradient-${Math.random().toString(36).substr(2, 9)}`;
  finalText:any = '';
  previewText:any = '';
  isListening:any = false;
  constructor(
    private speech: SpeechService,
    private changeDetectorRef:ChangeDetectorRef

  ) {
    addIcons({
      micOutline,
      micOffOutline,
      sendOutline,
    });
  }

  ngOnInit() {
    //this.initializeSpeechRecognition();
  }

  ngOnDestroy() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
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
    const value = event.target.value;
    this.searchText = value;
    this.valueChange.emit(value);
    this.changeDetectorRef.detectChanges();
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

  openModalVoice() {
    this.isRecording = true;
    this.changeDetectorRef.detectChanges();
  }

  cancelModalVoice(){
    this.isRecording = false;
    this.changeDetectorRef.detectChanges();
  }

  onSend() {
    if (this.searchText.trim()) {
      this.sendMessage.emit(this.searchText);
      this.searchText = '';
    }
  }

  cancel() {
    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    } else {
      this.recognition.start();
      this.isRecording = true;
    }
  }

  async startVoice() {
    try {
      SpeechRecognition.addListener('listeningState', (state) => {
        switch(state.status) {
          case 'started':
            this.isListening = true;
            break;
          case 'stopped':
            if(this.isListening){
              this.isListening = false;
              this.searchText = this.previewText;
              this.previewText = '';
              this.cancelModalVoice();
              this.changeDetectorRef.detectChanges();
            }
            break;
        }
        this.changeDetectorRef.detectChanges();
      });

      SpeechRecognition.addListener('partialResults', (data) => {
        this.previewText = data.matches[0];
        this.changeDetectorRef.detectChanges();
      });
      this.previewText = '';
      await this.speech.startListening();
      this.speech.stopListening();
    } catch (err) {
      console.error(err);
    }
  }
}
