import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, SkipForward, SkipBack, Settings, Heart, Clock, Camera } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { PictureFrame, FamilyPhoto } from '@shared/schema';

interface DigitalPictureFrameProps {
  elderlyUserId: number;
  className?: string;
}

export function DigitalPictureFrame({ elderlyUserId, className }: DigitalPictureFrameProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Get picture frame data
  const { data: pictureFrame, isLoading: frameLoading } = useQuery({
    queryKey: [`/api/picture-frame/${elderlyUserId}`],
    enabled: !!elderlyUserId,
  });

  // Get family photos
  const { data: photos = [], isLoading: photosLoading } = useQuery({
    queryKey: [`/api/family-photos/${pictureFrame?.id}`],
    enabled: !!pictureFrame?.id,
  });

  // Update picture frame settings
  const updateFrameMutation = useMutation({
    mutationFn: async (updates: Partial<PictureFrame>) => {
      const response = await fetch(`/api/picture-frame/${pictureFrame?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update picture frame');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/picture-frame/${elderlyUserId}`] });
      toast({
        title: "Settings updated",
        description: "Picture frame settings have been saved.",
      });
    },
  });

  // Mark photo as viewed
  const markViewedMutation = useMutation({
    mutationFn: async (photoId: number) => {
      const response = await fetch(`/api/family-photos/${photoId}/viewed`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to mark photo as viewed');
      return response.json();
    },
  });

  // Auto-advance photos
  useEffect(() => {
    if (isPlaying && photos.length > 0 && pictureFrame) {
      intervalRef.current = setInterval(() => {
        setCurrentPhotoIndex((prev) => {
          const nextIndex = (prev + 1) % photos.length;
          // Mark current photo as viewed when we move to the next one
          if (photos[prev] && !photos[prev].viewedAt) {
            markViewedMutation.mutate(photos[prev].id);
          }
          return nextIndex;
        });
      }, (pictureFrame.displayDuration || 30) * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, photos, pictureFrame]);

  // Navigate photos
  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Update frame settings
  const updateDisplayDuration = (value: number[]) => {
    updateFrameMutation.mutate({ displayDuration: value[0] });
  };

  const updateBrightness = (value: number[]) => {
    updateFrameMutation.mutate({ brightness: value[0] });
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (frameLoading || photosLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Loading Picture Frame...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pictureFrame) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Digital Picture Frame
          </CardTitle>
          <CardDescription>
            No picture frame connected. Ask your family to set one up for you.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentPhoto = photos[currentPhotoIndex];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Family Photos
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {photos.length} photos
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          {pictureFrame.deviceName} - Photos from your family
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Display */}
        <div className="relative">
          <div 
            className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shadow-lg"
            style={{ filter: `brightness(${(pictureFrame.brightness || 80) / 100})` }}
          >
            {currentPhoto ? (
              <img
                src={currentPhoto.photoUrl}
                alt={currentPhoto.caption || 'Family photo'}
                className="w-full h-full object-cover transition-opacity duration-1000"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No photos yet</p>
                  <p className="text-sm">Ask your family to send some photos!</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Photo Caption */}
          {currentPhoto?.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 rounded-b-lg">
              <p className="text-sm">{currentPhoto.caption}</p>
              <div className="flex items-center mt-1 text-xs text-gray-300">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(currentPhoto.sentAt || '').toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevPhoto} disabled={photos.length <= 1}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={toggleAutoPlay} disabled={photos.length <= 1}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button variant="outline" size="sm" onClick={nextPhoto} disabled={photos.length <= 1}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Photo Counter */}
        {photos.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            {currentPhotoIndex + 1} of {photos.length}
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <>
            <Separator />
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Display Duration</label>
                <div className="flex items-center space-x-4 mt-2">
                  <Slider
                    value={[pictureFrame.displayDuration || 30]}
                    onValueChange={updateDisplayDuration}
                    max={120}
                    min={5}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[60px]">
                    {pictureFrame.displayDuration || 30}s
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Brightness</label>
                <div className="flex items-center space-x-4 mt-2">
                  <Slider
                    value={[pictureFrame.brightness || 80]}
                    onValueChange={updateBrightness}
                    max={100}
                    min={20}
                    step={10}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[60px]">
                    {pictureFrame.brightness || 80}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-play</label>
                <Switch
                  checked={isPlaying}
                  onCheckedChange={toggleAutoPlay}
                />
              </div>
            </div>
          </>
        )}

        {/* Recent Photos Preview */}
        {photos.length > 1 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Recent Photos</h4>
              <div className="grid grid-cols-4 gap-2">
                {photos.slice(0, 4).map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      index === currentPhotoIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={photo.photoUrl}
                      alt={photo.caption || 'Family photo'}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}