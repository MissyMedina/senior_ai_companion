import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Users, AlertCircle, CheckCircle2, Phone } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CareNotification {
  id: number;
  elderlyUserId: number | null;
  notificationType: string;
  title: string;
  description: string;
  scheduledTime: string | null;
  careProvider: string | null;
  familyInvited: boolean | null;
  assistanceNeeded: boolean | null;
  urgencyLevel: string | null;
  metadata: any;
  notifiedFamilyMembers: string[] | null;
  createdAt: string | null;
}

interface CareNotificationsProps {
  notifications: CareNotification[];
  userId: number;
  showActions?: boolean;
  className?: string;
}

export function CareNotifications({ 
  notifications, 
  userId, 
  showActions = true,
  className 
}: CareNotificationsProps) {
  if (!notifications || notifications.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Care Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No care notifications at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyColor = (urgencyLevel: string | null) => {
    switch (urgencyLevel) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Clock className="h-4 w-4" />;
      case 'medication': return <AlertCircle className="h-4 w-4" />;
      case 'emergency': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          Care Notifications
          {notifications.length > 0 && (
            <Badge variant="secondary">{notifications.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification, index) => (
          <div key={notification.id}>
            <div className="flex flex-col space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getNotificationTypeIcon(notification.notificationType)}
                  <div>
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getUrgencyColor(notification.urgencyLevel))}
                >
                  {notification.urgencyLevel || 'normal'}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {notification.scheduledTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(new Date(notification.scheduledTime), 'MMM d, h:mm a')}
                    </span>
                  </div>
                )}
                
                {notification.careProvider && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{notification.careProvider}</span>
                  </div>
                )}

                {notification.assistanceNeeded && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>Family help needed</span>
                  </div>
                )}

                {notification.familyInvited && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>Family notified</span>
                  </div>
                )}
              </div>

              {notification.metadata && (
                <div className="text-xs text-muted-foreground space-y-1">
                  {notification.metadata.therapistName && (
                    <div>Therapist: {notification.metadata.therapistName}</div>
                  )}
                  {notification.metadata.duration && (
                    <div>Duration: {notification.metadata.duration}</div>
                  )}
                  {notification.metadata.location && (
                    <div>Location: {notification.metadata.location}</div>
                  )}
                  {notification.metadata.transportationNeeded && (
                    <div className="text-orange-600">Transportation assistance needed</div>
                  )}
                </div>
              )}

              {showActions && notification.assistanceNeeded && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call to Help
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Coordinate Care
                  </Button>
                </div>
              )}
            </div>
            {index < notifications.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}