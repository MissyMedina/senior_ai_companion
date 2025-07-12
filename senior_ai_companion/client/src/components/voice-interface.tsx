import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";

interface VoiceInterfaceProps {
  onVoiceInput: () => Promise<void>;
  onTextInput: (message: string) => void;
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  currentMessage: string;
  agentType: 'grace' | 'alex';
  className?: string;
}

export function VoiceInterface({
  onVoiceInput,
  onTextInput,
  isListening,
  isSpeaking,
  isSupported,
  currentMessage,
  agentType,
  className = ""
}: VoiceInterfaceProps) {
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const agentConfig = {
    grace: {
      name: 'Grace',
      color: 'bg-secondary',
      hoverColor: 'hover:bg-secondary/90',
      textColor: 'text-secondary',
      activationPhrase: 'Hey Grace',
      description: 'Your caring companion is listening'
    },
    alex: {
      name: 'Alex',
      color: 'bg-primary',
      hoverColor: 'hover:bg-primary/90',
      textColor: 'text-primary',
      activationPhrase: 'Hey Alex',
      description: 'Your family planner is ready'
    }
  };

  const config = agentConfig[agentType];

  const handleVoiceClick = async () => {
    if (isListening) {
      return; // Already listening
    }

    try {
      setIsProcessing(true);
      await onVoiceInput();
    } catch (error) {
      console.error('Voice input failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onTextInput(textInput.trim());
      setTextInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  // Update text input when voice input is received
  useEffect(() => {
    if (currentMessage) {
      setTextInput(currentMessage);
    }
  }, [currentMessage]);

  return (
    <Card className={`${className} shadow-lg`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Mic className={`mr-2 h-5 w-5 ${config.textColor}`} />
            Talk to {config.name}
          </span>
          <div className="flex items-center space-x-2">
            {isSupported ? (
              <Badge variant="secondary" className="flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Voice Ready
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Voice Not Supported
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="default" className="flex items-center speaking-indicator">
                <Volume2 className="h-3 w-3 mr-1" />
                {config.name} Speaking
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Activation */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleVoiceClick}
            disabled={!isSupported || isProcessing}
            className={`
              w-32 h-32 rounded-full ${config.color} ${config.hoverColor} text-white
              transition-all duration-300 transform hover:scale-105
              ${isListening ? (agentType === 'grace' ? 'grace-pulse' : 'alex-pulse') : ''}
              ${isProcessing ? 'opacity-50' : ''}
              ${isListening ? 'voice-listening' : ''}
            `}
          >
            {isProcessing ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : isListening ? (
              <div className="flex flex-col items-center">
                <Mic className="h-8 w-8 mb-2" />
                <div className="voice-waveform">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs mt-1">Listening...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Mic className="h-8 w-8 mb-1" />
                <span className="text-xs">Tap to Talk</span>
              </div>
            )}
          </Button>
          
          <div className="mt-4 space-y-2">
            <p className="text-lg font-medium">
              Say "{config.activationPhrase}" to start
            </p>
            <p className="text-sm text-muted-foreground">
              {isListening ? 'Listening for your voice...' : config.description}
            </p>
          </div>
        </div>

        <Separator />

        {/* Quick Voice Test */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Quick Voice Test (No microphone needed):
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTextInput("How are my family members doing?")}
            >
              Test Family Status
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTextInput("Tell me about my appointments")}
            >
              Test Appointments
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTextInput("I'd like to call my daughter")}
            >
              Test Family Call
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTextInput("Show me family photos")}
            >
              Test Photo Frame
            </Button>
          </div>
        </div>

        <Separator />

        {/* Text Input Alternative */}
        <div className="space-y-3">
          <Label htmlFor="text-input" className="text-sm font-medium">
            Or type your message:
          </Label>
          <div className="space-y-3">
            <Textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Type your message for ${config.name}...`}
              className="resize-none"
              rows={3}
            />
            <Button 
              onClick={handleTextSubmit}
              disabled={!textInput.trim()}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>

        {/* Voice Commands Help */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-3 text-sm">Try saying:</h4>
          <div className="grid gap-2">
            {agentType === 'grace' ? (
              <>
                <p className="text-sm text-muted-foreground">• "How are my family members doing?"</p>
                <p className="text-sm text-muted-foreground">• "Tell me about my appointments"</p>
                <p className="text-sm text-muted-foreground">• "I'd like to call my daughter"</p>
                <p className="text-sm text-muted-foreground">• "Set up my sleep schedule"</p>
                <p className="text-sm text-muted-foreground">• "Show me family photos"</p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">• "How is my elderly family member doing?"</p>
                <p className="text-sm text-muted-foreground">• "Schedule a family call"</p>
                <p className="text-sm text-muted-foreground">• "Create a care reminder"</p>
                <p className="text-sm text-muted-foreground">• "Send a photo to the picture frame"</p>
                <p className="text-sm text-muted-foreground">• "What's the family wellbeing score?"</p>
              </>
            )}
          </div>
        </div>

        {/* Voice Status */}
        {!isSupported && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">
                  Voice Recognition Not Available
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Your browser doesn't support voice recognition. Please use the text input instead.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Status */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {isListening ? 'Listening...' : 'Ready to listen'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {isSpeaking ? (
                <Volume2 className="h-4 w-4 text-blue-500" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {isSpeaking ? `${config.name} is speaking` : 'Audio ready'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
