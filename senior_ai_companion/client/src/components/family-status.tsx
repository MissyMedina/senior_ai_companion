import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Phone, 
  MessageSquare, 
  Calendar,
  Heart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User
} from "lucide-react";

interface FamilyStatusProps {
  familyConnections: any[];
  userId: number;
  showControls?: boolean;
  className?: string;
}

export function FamilyStatus({ 
  familyConnections, 
  userId, 
  showControls = false,
  className = ""
}: FamilyStatusProps) {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  // Get family member IDs first
  const familyMemberIds = familyConnections?.map(connection => {
    return connection.elderlyUserId === userId ? 
      connection.caregiverUserId : connection.elderlyUserId;
  }) || [];

  // Fetch user details for each family member - using a fixed number of queries to avoid hooks issues
  const familyMemberQueries = [
    useQuery({
      queryKey: ['/api/users', familyMemberIds[0]],
      select: (data) => data,
      enabled: !!familyMemberIds[0],
    }),
    useQuery({
      queryKey: ['/api/users', familyMemberIds[1]],
      select: (data) => data,
      enabled: !!familyMemberIds[1],
    }),
    useQuery({
      queryKey: ['/api/users', familyMemberIds[2]],
      select: (data) => data,
      enabled: !!familyMemberIds[2],
    }),
  ].slice(0, familyMemberIds.length);

  // Calculate activity status
  const getActivityStatus = (lastContactDate: string) => {
    if (!lastContactDate) return { status: 'unknown', color: 'gray', label: 'Unknown' };
    
    const now = new Date();
    const lastContact = new Date(lastContactDate);
    const diffHours = (now.getTime() - lastContact.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return { status: 'active', color: 'green', label: 'Active today' };
    } else if (diffHours < 48) {
      return { status: 'recent', color: 'yellow', label: 'Active yesterday' };
    } else if (diffHours < 168) { // 7 days
      return { status: 'moderate', color: 'orange', label: 'Active this week' };
    } else {
      return { status: 'inactive', color: 'red', label: 'Inactive' };
    }
  };

  // Get contact frequency display
  const getContactFrequencyDisplay = (frequency: string) => {
    const frequencies = {
      daily: { label: 'Daily', color: 'green' },
      weekly: { label: 'Weekly', color: 'blue' },
      monthly: { label: 'Monthly', color: 'purple' },
      occasional: { label: 'Occasional', color: 'gray' }
    };
    return frequencies[frequency as keyof typeof frequencies] || frequencies.weekly;
  };

  // Format relationship type
  const formatRelationship = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return time.toLocaleDateString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Family Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {familyConnections && familyConnections.length > 0 ? (
          <div className="space-y-4">
            {familyConnections.map((connection, index) => {
              const familyMemberId = connection.elderlyUserId === userId ? 
                connection.caregiverUserId : connection.elderlyUserId;
              
              const memberQuery = familyMemberQueries[index];
              const memberData = memberQuery?.data;
              
              if (!memberData) {
                return (
                  <div key={connection.id} className="animate-pulse">
                    <div className="h-16 bg-muted rounded-lg"></div>
                  </div>
                );
              }

              const activityStatus = getActivityStatus(connection.lastContactDate);
              const frequencyDisplay = getContactFrequencyDisplay(connection.contactFrequency);
              const isExpanded = expandedMember === connection.id;

              return (
                <div 
                  key={connection.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  {/* Main Status Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(memberData.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{memberData.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {formatRelationship(connection.relationshipType)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 rounded-full bg-${activityStatus.color}-500`}></div>
                          <span className="text-xs text-muted-foreground">
                            {activityStatus.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs bg-${frequencyDisplay.color}-50 text-${frequencyDisplay.color}-700`}
                      >
                        {frequencyDisplay.label}
                      </Badge>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedMember(isExpanded ? null : connection.id)}
                      >
                        {isExpanded ? '−' : '+'}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Last Contact
                          </p>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {connection.lastContactDate ? 
                                formatTimeAgo(connection.lastContactDate) : 
                                'No recent contact'
                              }
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Preferred Agent
                          </p>
                          <div className="flex items-center space-x-2">
                            {memberData.preferredAgent === 'grace' ? (
                              <Heart className="h-4 w-4 text-secondary" />
                            ) : (
                              <Calendar className="h-4 w-4 text-primary" />
                            )}
                            <span className="text-sm capitalize">
                              {memberData.preferredAgent || 'None'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Communication Preferences
                        </p>
                        <div className="flex items-center space-x-2">
                          {memberData.voiceEnabled ? (
                            <Badge variant="secondary" className="text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Voice Enabled
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Text Only
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {memberData.role === 'elderly' ? 'Care Recipient' : 'Caregiver'}
                          </Badge>
                        </div>
                      </div>

                      {showControls && (
                        <div className="pt-2">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              Schedule Call
                            </Button>
                            <Button size="sm" variant="outline" className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Send Message
                            </Button>
                            <Button size="sm" variant="outline" className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              View Calendar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No family connections found</p>
            <p className="text-xs mt-1">
              Family connections will appear here once they're established
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
