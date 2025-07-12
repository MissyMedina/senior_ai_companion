import { useState, useCallback, useEffect } from 'react';
import { speechService } from '@/lib/speech';

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  error: string | null;
  transcript: string;
}

export function useVoice() {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isSupported: speechService.isSupported(),
    error: null,
    transcript: '',
  });

  const updateState = useCallback((updates: Partial<VoiceState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const startListening = useCallback(async () => {
    if (!speechService.isSupported()) {
      updateState({ error: 'Speech recognition not supported in this browser' });
      throw new Error('Speech recognition not supported in this browser');
    }

    try {
      updateState({ isListening: true, error: null });
      const transcript = await speechService.startListening();
      updateState({ transcript, isListening: false });
      return transcript;
    } catch (error) {
      console.error('Speech recognition error:', error);
      updateState({ 
        error: error instanceof Error ? error.message : 'Speech recognition failed',
        isListening: false 
      });
      throw error;
    }
  }, [updateState]);

  const stopListening = useCallback(() => {
    speechService.stopListening();
    updateState({ isListening: false });
  }, [updateState]);

  const speak = useCallback(async (text: string, agentType?: 'grace' | 'alex') => {
    if (!speechService.isSupported()) {
      updateState({ error: 'Speech synthesis not supported in this browser' });
      return;
    }

    try {
      updateState({ isSpeaking: true, error: null });
      
      const voice = agentType ? await speechService.getPreferredVoice(agentType) : null;
      const options = {
        rate: agentType === 'grace' ? 0.8 : 1.0,
        pitch: agentType === 'grace' ? 1.1 : 1.0,
        volume: 1.0,
        voice: voice || undefined
      };

      await speechService.speak(text, options);
      updateState({ isSpeaking: false });
    } catch (error) {
      console.error('Speech synthesis error:', error);
      updateState({ 
        error: error instanceof Error ? error.message : 'Speech synthesis failed',
        isSpeaking: false 
      });
      // Don't re-throw speech synthesis errors as they're not critical
    }
  }, [updateState]);

  const cancelSpeech = useCallback(() => {
    speechService.cancelSpeech();
    updateState({ isSpeaking: false });
  }, [updateState]);

  // Update state based on speech service status
  useEffect(() => {
    const interval = setInterval(() => {
      updateState({
        isListening: speechService.isCurrentlyListening(),
        isSpeaking: speechService.isCurrentlySpeaking(),
      });
    }, 100);

    return () => clearInterval(interval);
  }, [updateState]);

  return {
    ...state,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
  };
}
