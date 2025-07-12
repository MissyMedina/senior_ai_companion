import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, Camera, Send, Clock, Heart, Trash2 } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { PictureFrame, FamilyPhoto } from '@shared/schema';

interface PhotoSharingProps {
  elderlyUserId: number;
  currentUserId: number;
  className?: string;
}

export function PhotoSharing({ elderlyUserId, currentUserId, className }: PhotoSharingProps) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Get picture frame data
  const { data: pictureFrame } = useQuery({
    queryKey: [`/api/picture-frame/${elderlyUserId}`],
    enabled: !!elderlyUserId,
  });

  // Get family photos
  const { data: photos = [], isLoading: photosLoading } = useQuery({
    queryKey: [`/api/family-photos/${pictureFrame?.id}`],
    enabled: !!pictureFrame?.id,
  });

  // Send photo mutation
  const sendPhotoMutation = useMutation({
    mutationFn: async (photoData: { pictureFrameId: number; senderUserId: number; photoUrl: string; caption?: string }) => {
      const response = await fetch('/api/family-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photoData),
      });
      if (!response.ok) throw new Error('Failed to send photo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/family-photos/${pictureFrame?.id}`] });
      setPhotoUrl('');
      setCaption('');
      toast({
        title: "Photo sent!",
        description: "Your photo has been sent to the family picture frame.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to send photo",
        description: "There was an error sending your photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: number) => {
      const response = await fetch(`/api/family-photos/${photoId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete photo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/family-photos/${pictureFrame?.id}`] });
      toast({
        title: "Photo deleted",
        description: "The photo has been removed from the picture frame.",
      });
    },
  });

  // Create picture frame if it doesn't exist
  const createFrameMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/picture-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elderlyUserId,
          deviceId: `frame_${elderlyUserId}`,
          deviceName: 'Family Picture Frame',
        }),
      });
      if (!response.ok) throw new Error('Failed to create picture frame');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/picture-frame/${elderlyUserId}`] });
      toast({
        title: "Picture frame created",
        description: "A new picture frame has been set up for your family member.",
      });
    },
  });

  const handleSendPhoto = () => {
    if (!photoUrl.trim()) {
      toast({
        title: "Please enter a photo URL",
        description: "You need to provide a photo URL to send.",
        variant: "destructive",
      });
      return;
    }

    if (!pictureFrame) {
      createFrameMutation.mutate();
      return;
    }

    sendPhotoMutation.mutate({
      pictureFrameId: pictureFrame.id,
      senderUserId: currentUserId,
      photoUrl: photoUrl.trim(),
      caption: caption.trim() || undefined,
    });
  };

  const handleDeletePhoto = (photoId: number) => {
    deletePhotoMutation.mutate(photoId);
  };

  // Sample photo URLs for easy testing
  const samplePhotos = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop',
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="mr-2 h-5 w-5" />
          Send Photos to Family
        </CardTitle>
        <CardDescription>
          Share photos with your family member's digital picture frame
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Upload Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="photo-url">Photo URL</Label>
            <Input
              id="photo-url"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              placeholder="Add a message with your photo..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
            />
          </div>

          <Button
            onClick={handleSendPhoto}
            disabled={sendPhotoMutation.isPending || createFrameMutation.isPending}
            className="w-full"
          >
            <Send className="mr-2 h-4 w-4" />
            {sendPhotoMutation.isPending ? 'Sending...' : 'Send Photo'}
          </Button>
        </div>

        {/* Sample Photos for Testing */}
        <div>
          <Label className="text-sm font-medium">Quick Add Sample Photos</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {samplePhotos.map((url, index) => (
              <button
                key={index}
                onClick={() => setPhotoUrl(url)}
                className="aspect-square rounded-md overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
              >
                <img
                  src={url}
                  alt={`Sample photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Recent Photos */}
        <div>
          <h4 className="text-sm font-medium mb-2">Recent Photos Sent</h4>
          {photosLoading ? (
            <div className="text-center py-4 text-gray-500">Loading photos...</div>
          ) : photos.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No photos sent yet</p>
              <p className="text-sm">Be the first to send a photo!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {photos.slice(0, 5).map((photo) => (
                <div
                  key={photo.id}
                  className="flex items-center space-x-3 p-2 border rounded-lg"
                >
                  <img
                    src={photo.photoUrl}
                    alt={photo.caption || 'Family photo'}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {photo.caption || 'Untitled photo'}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(photo.sentAt || '').toLocaleDateString()}
                      {photo.viewedAt && (
                        <Badge variant="secondary" className="ml-2">
                          <Heart className="h-3 w-3 mr-1" />
                          Viewed
                        </Badge>
                      )}
                    </div>
                  </div>
                  {photo.senderUserId === currentUserId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePhoto(photo.id)}
                      disabled={deletePhotoMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              {photos.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  and {photos.length - 5} more photos
                </p>
              )}
            </div>
          )}
        </div>

        {/* Frame Status */}
        {pictureFrame && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">
                  {pictureFrame.deviceName}
                </p>
                <p className="text-xs text-green-700">
                  Active • {photos.length} photos
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100">
                Connected
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}