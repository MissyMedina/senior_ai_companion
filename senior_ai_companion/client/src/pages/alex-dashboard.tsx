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
import { PhotoSharing } from "@/components/photo-sharing";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, 
  Users, 
  ArrowLeft, 
  Heart,
  Phone,
  MessageSquare,
  Lightbulb,
  BarChart3,
  BookOpen
} from "lucide-react";
import { Link } from "wouter";

// Mock user ID - in a real app, this would come from authentication
const ALEX_USER_ID = 2;
const ELDERLY_USER_ID = 1;

export default function AlexDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const voice = useVoice();
  const websocket = useWebSocket();
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGreeting, setIsGreeting] = useState(true);

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/users', ALEX_USER_ID],
    select: (data) => data,
  });

  // Fetch elderly user data
  const { data: elderlyUser } = useQuery({
    queryKey: ['/api/users', ELDERLY_USER_ID],
    select: (data) => data,
  });

  // Fetch family connections
  const { data: familyConnections } = useQuery({
    queryKey: ['/api/family', ALEX_USER_ID],
    select: (data) => data,
  });

  // Fetch care notifications
  const { data: careNotifications } = useQuery({
    queryKey: ['/api/care-notifications', ELDERLY_USER_ID],
    select: (data) => data,
  });

  // Fetch agent communications
  const { data: agentCommunications } = useQuery({
    queryKey: ['/api/agents/communications'],
    select: (data) => data,
  });

  // Fetch reminders
  const { data: reminders } = useQuery({
    queryKey: ['/api/reminders', ELDERLY_USER_ID],
    select: (data) => data,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/agents/message', {
        userId: ALEX_USER_ID,
        agentId: 'alex',
        message
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents/communications'] });
      if (data.message) {
        voice.speak(data.message, 'alex');
      }
    },
  });

  // Create care appointment mutation
  const createCareAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      const response = await apiRequest('POST', '/api/care-coordination/appointment', appointmentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/care-notifications', ELDERLY_USER_ID] });
      toast({
        title: "Care Appointment Created",
        description: "Family members have been notified about the appointment.",
      });
    },
  });

  // Create reminder mutation
  const createReminderMutation = useMutation({
    mutationFn: async (reminderData: any) => {
      const response = await apiRequest('POST', '/api/reminders', reminderData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders', ELDERLY_USER_ID] });
      toast({
        title: "Reminder Created",
        description: "Successfully created a new reminder.",
      });
    },
  });

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
      sendMessageMutation.mutate(transcript);
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
  const handleTextInput = async (message: string) => {
    setCurrentMessage(message);
    sendMessageMutation.mutate(message);
  };

  const handleScheduleCall = () => {
    const reminderData = {
      userId: ELDERLY_USER_ID,
      title: "Call Sarah",
      description: "Scheduled call with family member",
      reminderType: "call",
      scheduledTime: new Date(Date.now() + 60 * 60 * 1000),
    };
    createReminderMutation.mutate(reminderData);
  };

  const handleCreateCareAppointment = () => {
    const appointmentData = {
      elderlyUserId: ELDERLY_USER_ID,
      title: "Cardiology Appointment",
      description: "Annual heart checkup with Dr. Johnson at City Medical Center. Transportation assistance may be needed.",
      scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      careProvider: "City Medical Center",
      assistanceNeeded: true
    };
    createCareAppointmentMutation.mutate(appointmentData);
  };

  const handleCreateReminder = (title: string, description: string, type: string) => {
    const reminderData = {
      userId: ELDERLY_USER_ID,
      title,
      description,
      reminderType: type,
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    createReminderMutation.mutate(reminderData);
  };

  // Initial greeting
  useEffect(() => {
    if (isGreeting && user) {
      const greeting = `Hello ${user.name || 'there'}! I'm Alex, your family planning assistant. How can I help you coordinate care today?`;
      voice.speak(greeting, 'alex');
      setIsGreeting(false);
    }
  }, [isGreeting, user, voice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
                <Calendar className="h-8 w-8 text-primary mr-3" />
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">Alex</h1>
                  <p className="text-sm text-muted-foreground">Family Planner Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {websocket.connected ? (
                <Badge variant="default" className="flex items-center">
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
                <Link href="/grace">
                  <Heart className="h-4 w-4 mr-2" />
                  Grace Interface
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Calendar className="mr-3 h-6 w-6" />
                Welcome back, {user?.name || 'there'}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 text-lg mb-4">
                I'm here to help you stay connected with your family and provide insights into their wellbeing.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-white/20 rounded-lg px-3 py-2">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="text-sm">Family Members: {familyConnections?.length || 0}</span>
                </div>
                <div className="flex items-center bg-white/20 rounded-lg px-3 py-2">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <span className="text-sm">Recent Communications: {agentCommunications?.length || 0}</span>
                </div>
                <div className="flex items-center bg-white/20 rounded-lg px-3 py-2">
                  <Heart className="h-5 w-5 mr-2" />
                  <span className="text-sm">Active Reminders: {reminders?.filter((r: any) => !r.completed).length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Interface */}
          <div className="lg:col-span-2">
            {/* Voice Interface */}
            <VoiceInterface
              onVoiceInput={handleVoiceInput}
              onTextInput={handleTextInput}
              isListening={voice.isListening}
              isSpeaking={voice.isSpeaking}
              isSupported={voice.isSupported}
              currentMessage={currentMessage}
              agentType="alex"
            />

            {/* Quick Actions */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={handleScheduleCall}
                  >
                    <Phone className="h-6 w-6" />
                    <span className="text-sm">Schedule Call</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={handleCreateCareAppointment}
                    disabled={createCareAppointmentMutation.isPending}
                  >
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Create Appointment</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => handleCreateReminder("Check-in Call", "Schedule a family check-in", "call")}
                  >
                    <MessageSquare className="h-6 w-6" />
                    <span className="text-sm">Create Reminder</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => handleTextInput("What's the family wellbeing status today?")}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">Family Insights</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Family Wellbeing Overview */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Family Wellbeing Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-muted-foreground">Wellbeing Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {familyConnections?.length || 1}
                    </div>
                    <div className="text-sm text-muted-foreground">Family Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {agentCommunications?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Today's Communications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {reminders?.filter((r: any) => !r.completed).length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Reminders</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Agent Communications */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Recent Agent Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {agentCommunications && agentCommunications.length > 0 ? (
                  <div className="space-y-4">
                    {agentCommunications.slice(0, 5).map((comm: any) => (
                      <div key={comm.id} className="border-l-4 border-primary pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              From: {comm.fromAgent === 'grace' ? 'Grace' : 'Alex'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {comm.message}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge variant={comm.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                              {comm.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {comm.timestamp ? 
                                new Date(comm.timestamp).toLocaleTimeString() : 
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
                    <p>No recent communications with Grace</p>
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
              userId={ALEX_USER_ID}
              showActions={true}
            />

            {/* Family Status */}
            <FamilyStatus 
              familyConnections={familyConnections || []} 
              userId={ALEX_USER_ID}
              showControls={true}
            />

            {/* Photo Sharing */}
            <PhotoSharing 
              elderlyUserId={ELDERLY_USER_ID}
              currentUserId={ALEX_USER_ID}
            />

            {/* Smart Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Smart Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900">
                      Optimal Contact Time
                    </p>
                    <p className="text-xs text-blue-700">
                      {elderlyUser?.name || 'Margaret'} is usually available around 3 PM on weekdays
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-900">
                      Family Engagement
                    </p>
                    <p className="text-xs text-green-700">
                      Consider sending new photos to the digital picture frame
                    </p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-purple-900">
                      Health & Wellness
                    </p>
                    <p className="text-xs text-purple-700">
                      Sleep schedule optimization is working well - 85% adherence
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