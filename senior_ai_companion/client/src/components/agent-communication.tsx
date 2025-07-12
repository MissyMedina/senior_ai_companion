import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Calendar, 
  Heart, 
  ArrowRight, 
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

interface AgentCommunicationProps {
  communications: any[];
  currentAgentId: string;
  className?: string;
}

export function AgentCommunication({ 
  communications, 
  currentAgentId,
  className = ""
}: AgentCommunicationProps) {
  const [sortedCommunications, setSortedCommunications] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'to-me' | 'from-me'>('all');

  useEffect(() => {
    if (!communications) return;

    let filtered = [...communications];

    switch (filter) {
      case 'to-me':
        filtered = filtered.filter(comm => comm.toAgent === currentAgentId);
        break;
      case 'from-me':
        filtered = filtered.filter(comm => comm.fromAgent === currentAgentId);
        break;
      // 'all' case doesn't need filtering
    }

    // Sort by timestamp (most recent first)
    filtered.sort((a, b) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    });

    setSortedCommunications(filtered);
  }, [communications, filter, currentAgentId]);

  const getAgentConfig = (agentId: string) => {
    const configs = {
      grace: {
        name: 'Grace',
        icon: Heart,
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        borderColor: 'border-secondary/20'
      },
      alex: {
        name: 'Alex',
        icon: Calendar,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/20'
      }
    };
    return configs[agentId as keyof typeof configs] || configs.grace;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      high: {
        color: 'destructive',
        icon: AlertTriangle,
        label: 'High Priority'
      },
      medium: {
        color: 'default',
        icon: Info,
        label: 'Medium Priority'
      },
      low: {
        color: 'secondary',
        icon: CheckCircle2,
        label: 'Low Priority'
      }
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Agent Communications
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg border p-1">
              <Button
                size="sm"
                variant={filter === 'all' ? 'default' : 'ghost'}
                onClick={() => setFilter('all')}
                className="h-7 px-2 text-xs"
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filter === 'to-me' ? 'default' : 'ghost'}
                onClick={() => setFilter('to-me')}
                className="h-7 px-2 text-xs"
              >
                To Me
              </Button>
              <Button
                size="sm"
                variant={filter === 'from-me' ? 'default' : 'ghost'}
                onClick={() => setFilter('from-me')}
                className="h-7 px-2 text-xs"
              >
                From Me
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          {sortedCommunications.length > 0 ? (
            <div className="space-y-4">
              {sortedCommunications.map((comm, index) => {
                const fromConfig = getAgentConfig(comm.fromAgent);
                const toConfig = getAgentConfig(comm.toAgent);
                const priorityConfig = getPriorityConfig(comm.context?.priority || 'medium');
                const FromIcon = fromConfig.icon;
                const ToIcon = toConfig.icon;
                const PriorityIcon = priorityConfig.icon;

                return (
                  <div
                    key={comm.id || index}
                    className={`
                      border rounded-lg p-4 transition-all duration-200 hover:shadow-md
                      ${comm.toAgent === currentAgentId ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}
                    `}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${fromConfig.bgColor}`}>
                            <FromIcon className={`h-4 w-4 ${fromConfig.color}`} />
                          </div>
                          <span className="text-sm font-medium">{fromConfig.name}</span>
                        </div>
                        
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${toConfig.bgColor}`}>
                            <ToIcon className={`h-4 w-4 ${toConfig.color}`} />
                          </div>
                          <span className="text-sm font-medium">{toConfig.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={priorityConfig.color as any} className="flex items-center">
                          <PriorityIcon className="h-3 w-3 mr-1" />
                          {priorityConfig.label}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeAgo(comm.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="mb-3">
                      <p className="text-sm text-foreground leading-relaxed">
                        {comm.message}
                      </p>
                    </div>

                    {/* Context and Actions */}
                    {comm.context && (
                      <div className="space-y-2">
                        <Separator />
                        <div className="pt-2">
                          {comm.context.originalUserMessage && (
                            <div className="bg-muted rounded-lg p-2 mb-2">
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                Original User Message:
                              </p>
                              <p className="text-xs text-foreground">
                                "{comm.context.originalUserMessage}"
                              </p>
                            </div>
                          )}
                          
                          {comm.context.emotionalState && (
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                Emotional State: {comm.context.emotionalState}
                              </Badge>
                            </div>
                          )}
                          
                          {comm.context.suggestedActions && comm.context.suggestedActions.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground">
                                Suggested Actions:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {comm.context.suggestedActions.map((action: string, actionIndex: number) => (
                                  <Badge key={actionIndex} variant="outline" className="text-xs">
                                    {action}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No agent communications yet</p>
              <p className="text-xs mt-1">
                Agent communications will appear here when Grace and Alex share insights
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
