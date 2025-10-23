export class SpeechRecognition4Web {
	private recognition: any;
	private isListening: boolean = false;
	private listeners: { [key: string]: Function[] } = {
		partialResults: [],
		listeningState: [],
	};

	constructor() {
		const win = window as any;
		const SpeechRecognition =
			win.SpeechRecognition || win.webkitSpeechRecognition;
		if (SpeechRecognition) {
			this.recognition = new SpeechRecognition();
		}
	}

	private emit(eventName: string, data: any) {
		if (this.listeners[eventName]) {
			this.listeners[eventName].forEach((callback) => callback(data));
		}
	}

	available(): Promise<{ available: boolean }> {
		return Promise.resolve({ available: !!this.recognition });
	}

	start(options?: {
		language?: string;
		maxResults?: number;
		partialResults?: boolean;
		popup?: boolean;
	}): Promise<void> {
		if (!this.recognition) {
			this.emit('listeningState', { status: 'stoped' });
			return Promise.reject('Speech recognition not available');
		}

		if (this.isListening) {
			return Promise.resolve();
		}

		this.recognition.lang = options?.language || 'en-US';
		this.recognition.interimResults = options?.partialResults || false;
		this.recognition.maxAlternatives = options?.maxResults || 1;
		this.recognition.continuous = options?.partialResults || false;

		this.recognition.onstart = () => {
			this.isListening = true;
			this.emit('listeningState', { status: 'listening' });
		};

		this.recognition.onresult = (event: any) => {
			let transcript = '';
			for (let i = event.resultIndex; i < event.results.length; ++i) {
				transcript += event.results[i][0].transcript;
			}

			if (transcript) {
				this.emit('partialResults', { matches: [transcript] });
			}
		};

		this.recognition.onend = () => {
			this.isListening = false;
			this.emit('listeningState', { status: 'stoped' });
		};

		this.recognition.onerror = (event: any) => {
			console.error('Speech recognition error', event.error);
			this.isListening = false;
			this.emit('listeningState', { status: 'stoped' });
		};

		this.recognition.start();
		return Promise.resolve();
	}

	stop(): Promise<void> {
		if (this.recognition && this.isListening) {
			this.recognition.stop();
		}
		this.isListening = false;
		return Promise.resolve();
	}

	checkPermissions(): Promise<{
		speechRecognition: 'granted' | 'denied' | 'prompt';
	}> {
		return Promise.resolve({ speechRecognition: 'granted' }); // Web doesn't have this concept in the same way
	}

	requestPermissions(): Promise<{
		speechRecognition: 'granted' | 'denied' | 'prompt';
	}> {
		return Promise.resolve({ speechRecognition: 'granted' });
	}

	addListener(
		eventName: 'partialResults' | 'listeningState',
		callback: (data: any) => void
	) {
		if (this.listeners[eventName]) {
			this.listeners[eventName].push(callback);
		}
	}

	removeAllListeners(): Promise<void> {
		this.listeners = {
			partialResults: [],
			listeningState: [],
		};
		return Promise.resolve();
	}
}
