export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  grammars: any;
  start(): void;
  stop(): void;
  abort(): void;
  addEventListener(type: 'result', listener: (event: SpeechRecognitionEvent) => void): void;
  addEventListener(type: 'error', listener: (event: Event) => void): void;
  addEventListener(type: 'end', listener: (event: Event) => void): void;
  addEventListener(type: 'start', listener: (event: Event) => void): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
    }
  }

  public isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  public startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported in this browser. Please try Chrome or Edge.'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.isListening = true;

      // Clear any previous event listeners
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.resultIndex];
        if (result.isFinal) {
          const transcript = result[0].transcript;
          this.isListening = false;
          resolve(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        let errorMessage = 'Speech recognition failed';
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please speak clearly and try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Please check your microphone connection.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your internet connection.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech service not allowed. Please try a different browser.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        reject(new Error(errorMessage));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(new Error('Failed to start speech recognition. Please try again.'));
      }
    });
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (options) {
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;
        if (options.voice) {
          utterance.voice = options.voice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  public async getPreferredVoice(agentType: 'grace' | 'alex'): Promise<SpeechSynthesisVoice | null> {
    const voices = this.getVoices();
    
    if (agentType === 'grace') {
      // Prefer female voices for Grace
      const femaleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria')
      );
      
      return femaleVoices[0] || voices.find(voice => voice.lang.startsWith('en')) || voices[0] || null;
    } else {
      // Prefer male voices for Alex
      const maleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('male') || 
        voice.name.toLowerCase().includes('man') ||
        voice.name.toLowerCase().includes('alex') ||
        voice.name.toLowerCase().includes('tom')
      );
      
      return maleVoices[0] || voices.find(voice => voice.lang.startsWith('en')) || voices[0] || null;
    }
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public isCurrentlySpeaking(): boolean {
    return this.synthesis.speaking;
  }

  public cancelSpeech(): void {
    this.synthesis.cancel();
  }
}

export const speechService = new SpeechService();
