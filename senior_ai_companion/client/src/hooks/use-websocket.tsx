import { useState, useEffect, useCallback, useRef } from 'react';

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface WebSocketState {
  connected: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
}

export function useWebSocket(url?: string) {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    error: null,
    lastMessage: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageHandlersRef = useRef<Map<string, (data: any) => void>>(new Map());

  // Construct WebSocket URL
  const wsUrl = url || (() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/ws`;
  })();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setState(prev => ({ ...prev, connected: true, error: null }));
        
        // Clear reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }

        // Send ping to keep connection alive
        const pingInterval = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            try {
              wsRef.current.send(JSON.stringify({ type: 'ping' }));
            } catch (error) {
              console.error('Failed to send ping:', error);
              clearInterval(pingInterval);
            }
          } else {
            clearInterval(pingInterval);
          }
        }, 30000);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setState(prev => ({ ...prev, lastMessage: message }));
          
          // Call specific handler if registered
          const handler = messageHandlersRef.current.get(message.type);
          if (handler) {
            handler(message);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        setState(prev => ({ ...prev, connected: false }));
        
        // Only attempt to reconnect if it wasn't a clean close
        if (event.code !== 1000 && !reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({ ...prev, error: 'WebSocket connection failed' }));
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to connect' 
      }));
    }
  }, [wsUrl]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setState(prev => ({ ...prev, connected: false }));
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const onMessage = useCallback((type: string, handler: (data: any) => void) => {
    messageHandlersRef.current.set(type, handler);
    
    return () => {
      messageHandlersRef.current.delete(type);
    };
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    onMessage,
  };
}
