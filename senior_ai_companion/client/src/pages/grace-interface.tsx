import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useVoice } from "@/hooks/use-voice";
import { useWebSocket } from "@/hooks/use-websocket";
import { VoiceInterface } from "@/components/voice-interface";
import { FamilyStatus } from "@/components/family-status";
import { CareNotifications } from "@/components/care-notifications";
import { SleepSchedule } from "@/components/sleep-schedule";
import { DigitalPictureFrame } from "@/components/digital-picture-frame";
import { apiRequest } from "@/lib/queryClient";
import { 
  Heart, 
  Home, 
  Phone, 
  BookOpen, 
  Calendar,
  MessageSquare,
  Users,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

// Mock user ID - in a real app, this would come from authentication
const GRACE_USER_ID = 1;

export default function GraceInterface() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const voice = useVoice();
  const websocket = useWebSocket();
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGreeting, setIsGreeting] = useState(true);

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/users', GRACE_USER_ID],
    select: (data) => data,
  });

  // Fetch conversations
  const { data: conversations, isLoading: loadingConversations } = useQuery({
    queryKey: ['/api/conversations', GRACE_USER_ID],
    select: (data) => data,
  });

  // Fetch family connections
  const { data: familyConnections } = useQuery({
    queryKey: ['/api/family', GRACE_USER_ID],
    select: (data) => data,
  });

  // Fetch reminders
  const { data: reminders } = useQuery({
    queryKey: ['/api/reminders', GRACE_USER_ID],
    select: (data) => data,
  });

  // Fetch pending reminders
  const { data: pendingReminders } = useQuery({
    queryKey: ['/api/reminders', GRACE_USER_ID, 'pending'],
    select: (data) => data,
  });

  // Fetch care notifications
  const { data: careNotifications } = useQuery({
    queryKey: ['/api/care-notifications', GRACE_USER_ID],
    select: (data) => data,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/agents/message', {
        userId: GRACE_USER_ID,
        agentId: 'grace',
        message
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate conversations to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', GRACE_USER_ID] });
      
      // Speak the response
      if (data.message) {
        voice.speak(data.message, 'grace');
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle WebSocket messages
  useEffect(() => {
    const unsubscribe = websocket.onMessage('agent_response', (data) => {
      if (data.response?.message) {
        voice.speak(data.response.message, 'grace');
      }
    });

    return unsubscribe;
  }, [websocket, voice]);

  // Handle voice input
  const handleVoiceInput = async () => {
    if (!voice.isSupported) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    try {
      const transcript = await voice.startListening();
      setCurrentMessage(transcript);
      
      // Send message and get response
      const response = await apiRequest('POST', '/api/agents/message', {
        userId: GRACE_USER_ID,
        agentId: 'grace',
        message: transcript
      });
      
      const data = await response.json();
      
      // Speak the response
      if (data.message) {
        await voice.speak(data.message, 'grace');
      }
      
      // Update conversations
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', GRACE_USER_ID] });
      
      toast({
        title: "Message sent",
        description: "Grace is responding to your message.",
      });
    } catch (error) {
      console.error('Voice input error:', error);
      toast({
        title: "Voice Recognition Error",
        description: "Could not understand your voice. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle text input
  const handleTextInput = (message: string) => {
    setCurrentMessage(message);
    sendMessageMutation.mutate(message);
  };

  // Initial greeting
  useEffect(() => {
    if (isGreeting && user && voice.isSupported) {
      const greeting = `Hello ${user.name}! I'm Grace, your caring companion. How are you feeling today?`;
      voice.speak(greeting, 'grace');
      setIsGreeting(false);
    }
  }, [user, voice, isGreeting]);

  // Quick actions
  const quickActions = [
    {
      icon: Phone,
      label: "Call Family",
      action: () => handleTextInput("I'd like to call my family")
    },
    {
      icon: BookOpen,
      label: "Story Time",
      action: () => handleTextInput("Tell me a story about our family")
    },
    {
      icon: Calendar,
      label: "My Schedule",
      action: () => handleTextInput("What do I have scheduled today?")
    },
    {
      icon: MessageSquare,
      label: "Chat",
      action: () => handleTextInput("Let's have a conversation")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="mr-4">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-secondary mr-3" />
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">Grace</h1>
                  <p className="text-sm text-muted-foreground">Your Caring Companion</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {websocket.connected ? (
                <Badge variant="secondary" className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Connecting...
                </Badge>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/alex">
                  <Users className="h-4 w-4 mr-2" />
                  Family Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Interface */}
          <div className="lg:col-span-2">
            {/* Welcome Message */}
            <Card className="mb-8 bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Heart className="mr-3 h-6 w-6" />
                  Welcome back, {user?.name || 'there'}!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-100 text-lg">
                  I'm here to help you stay connected with your family and remember what matters most. 
                  You can speak to me naturally or use the buttons below.
                </p>
              </CardContent>
            </Card>

            {/* Voice Interface */}
            <VoiceInterface
              onVoiceInput={handleVoiceInput}
              onTextInput={handleTextInput}
              isListening={voice.isListening}
              isSpeaking={voice.isSpeaking}
              isSupported={voice.isSupported}
              currentMessage={currentMessage}
              agentType="grace"
            />

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="lg"
                      onClick={action.action}
                      className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-secondary/10 hover:border-secondary"
                    >
                      <action.icon className="h-6 w-6 text-secondary" />
                      <span>{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Recent Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingConversations ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : conversations && conversations.length > 0 ? (
                  <div className="space-y-4">
                    {conversations.slice(0, 5).map((conversation: any) => (
                      <div key={conversation.id} className="border-l-4 border-secondary pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {conversation.message}
                            </p>
                            {conversation.response && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Grace: {conversation.response}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {conversation.emotionalState && (
                              <Badge variant="secondary" className="text-xs">
                                {conversation.emotionalState}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {conversation.timestamp ? 
                                new Date(conversation.timestamp).toLocaleTimeString() : 
                                'Just now'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No conversations yet. Start by saying "Hey Grace" or clicking the microphone!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Care Notifications */}
            <CareNotifications 
              notifications={careNotifications || []} 
              userId={GRACE_USER_ID}
              showActions={false}
            />

            {/* Family Status */}
            <FamilyStatus 
              familyConnections={familyConnections} 
              userId={GRACE_USER_ID}
            />

            {/* Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingReminders && pendingReminders.length > 0 ? (
                  <div className="space-y-3">
                    {pendingReminders.slice(0, 3).map((reminder: any) => (
                      <div key={reminder.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{reminder.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {reminder.scheduledTime ? 
                                new Date(reminder.scheduledTime).toLocaleString() : 
                                'No time set'
                              }
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {reminder.reminderType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No reminders for now</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Digital Picture Frame */}
            <DigitalPictureFrame elderlyUserId={GRACE_USER_ID} />

            {/* Sleep Schedule */}
            <SleepSchedule userId={GRACE_USER_ID} />

            {/* Daily Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Daily Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900">
                      Stay Hydrated
                    </p>
                    <p className="text-xs text-blue-700">
                      Remember to drink water throughout the day
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-900">
                      Family Time
                    </p>
                    <p className="text-xs text-green-700">
                      Consider calling Sarah today - she loves hearing from you
                    </p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-purple-900">
                      Sleep Schedule
                    </p>
                    <p className="text-xs text-purple-700">
                      Try the new sleep schedule with calming music and brain-stimulating sounds
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
