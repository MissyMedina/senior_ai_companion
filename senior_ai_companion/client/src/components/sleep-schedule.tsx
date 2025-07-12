import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Moon, Play, Pause, Volume2, Music, Brain, Clock } from 'lucide-react';

interface SleepScheduleProps {
  userId: number;
  className?: string;
}

interface SleepSchedule {
  id: number;
  userId: number;
  bedtime: string;
  duration: number;
  musicType: string;
  binauralFrequency: number;
  volume: number;
  isActive: boolean;
  musicPreferences: any;
  sleepGoals: string[];
}

// Audio context for binaural beats generation
class BinauralBeatsGenerator {
  private audioContext: AudioContext | null = null;
  private leftOscillator: OscillatorNode | null = null;
  private rightOscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  async start(baseFrequency: number, binauralFrequency: number, volume: number) {
    if (!this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.stop(); // Stop any existing tones

    // Create gain node for volume control
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = volume / 100;
    this.gainNode.connect(this.audioContext.destination);

    // Create stereo panner for left and right channels
    const leftPanner = this.audioContext.createStereoPanner();
    leftPanner.pan.value = -1; // Full left
    const rightPanner = this.audioContext.createStereoPanner();
    rightPanner.pan.value = 1; // Full right

    // Create oscillators
    this.leftOscillator = this.audioContext.createOscillator();
    this.rightOscillator = this.audioContext.createOscillator();

    // Set frequencies (left ear gets base, right ear gets base + binaural)
    this.leftOscillator.frequency.value = baseFrequency;
    this.rightOscillator.frequency.value = baseFrequency + binauralFrequency;

    // Use sine waves for cleaner sound
    this.leftOscillator.type = 'sine';
    this.rightOscillator.type = 'sine';

    // Connect oscillators through panners to gain node
    this.leftOscillator.connect(leftPanner);
    this.rightOscillator.connect(rightPanner);
    leftPanner.connect(this.gainNode);
    rightPanner.connect(this.gainNode);

    // Start oscillators
    this.leftOscillator.start();
    this.rightOscillator.start();
    this.isPlaying = true;
  }

  stop() {
    if (this.leftOscillator) {
      this.leftOscillator.stop();
      this.leftOscillator.disconnect();
      this.leftOscillator = null;
    }
    if (this.rightOscillator) {
      this.rightOscillator.stop();
      this.rightOscillator.disconnect();
      this.rightOscillator = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    this.isPlaying = false;
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume / 100;
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export function SleepSchedule({ userId, className }: SleepScheduleProps) {
  const [schedule, setSchedule] = useState<SleepSchedule | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(50);
  const [editForm, setEditForm] = useState({
    bedtime: '22:00',
    duration: 480, // 8 hours in minutes
    musicType: 'nature',
    binauralFrequency: 10, // Alpha waves
    volume: 50,
    sleepGoals: ['deep_sleep', 'relaxation']
  });

  const binauralGeneratorRef = useRef<BinauralBeatsGenerator | null>(null);

  useEffect(() => {
    binauralGeneratorRef.current = new BinauralBeatsGenerator();
    return () => {
      if (binauralGeneratorRef.current) {
        binauralGeneratorRef.current.stop();
      }
    };
  }, []);

  const musicTypes = [
    { value: 'nature', label: 'Nature Sounds', description: 'Rain, ocean waves, forest sounds' },
    { value: 'classical', label: 'Classical Music', description: 'Bach, Mozart, peaceful compositions' },
    { value: 'instrumental', label: 'Instrumental', description: 'Piano, guitar, ambient music' },
    { value: 'custom', label: 'Custom Playlist', description: 'Your familiar favorites' }
  ];

  const binauralFrequencies = [
    { value: 4, label: 'Delta (4 Hz)', description: 'Deep sleep, healing' },
    { value: 8, label: 'Theta (8 Hz)', description: 'REM sleep, dreams' },
    { value: 10, label: 'Alpha (10 Hz)', description: 'Relaxation, calm' },
    { value: 14, label: 'Beta (14 Hz)', description: 'Light relaxation' },
    { value: 40, label: 'Gamma (40 Hz)', description: 'Cognitive enhancement' }
  ];

  const sleepGoalOptions = [
    { value: 'deep_sleep', label: 'Deep Sleep' },
    { value: 'memory_consolidation', label: 'Memory Enhancement' },
    { value: 'relaxation', label: 'Stress Relief' },
    { value: 'pain_relief', label: 'Pain Management' },
    { value: 'anxiety_relief', label: 'Anxiety Reduction' }
  ];

  const handlePlayPause = async () => {
    if (!binauralGeneratorRef.current) return;

    if (isPlaying) {
      binauralGeneratorRef.current.stop();
      setIsPlaying(false);
    } else {
      const baseFrequency = 200; // Base carrier frequency
      const binauralFreq = schedule?.binauralFrequency || editForm.binauralFrequency;
      const volume = schedule?.volume || currentVolume;
      
      await binauralGeneratorRef.current.start(baseFrequency, binauralFreq, volume);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setCurrentVolume(newVolume);
    if (binauralGeneratorRef.current && isPlaying) {
      binauralGeneratorRef.current.setVolume(newVolume);
    }
  };

  const handleSave = async () => {
    try {
      const scheduleData = {
        userId,
        bedtime: editForm.bedtime,
        duration: editForm.duration,
        musicType: editForm.musicType,
        binauralFrequency: editForm.binauralFrequency,
        volume: editForm.volume,
        sleepGoals: editForm.sleepGoals,
        musicPreferences: {
          genres: editForm.musicType === 'custom' ? ['familiar songs'] : [editForm.musicType],
          volume: editForm.volume
        }
      };

      const response = await fetch('/api/sleep-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData)
      });

      if (response.ok) {
        const newSchedule = await response.json();
        setSchedule(newSchedule);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save sleep schedule:', error);
    }
  };

  const handleActivate = async () => {
    if (!schedule) return;
    
    try {
      const response = await fetch(`/api/sleep-schedule/${userId}/activate`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const updatedSchedule = await response.json();
        setSchedule(updatedSchedule);
      }
    } catch (error) {
      console.error('Failed to activate sleep schedule:', error);
    }
  };

  const getNextSleepTime = () => {
    if (!schedule) return null;
    
    const now = new Date();
    const [hours, minutes] = schedule.bedtime.split(':').map(Number);
    const bedtime = new Date();
    bedtime.setHours(hours, minutes, 0, 0);
    
    if (bedtime < now) {
      bedtime.setDate(bedtime.getDate() + 1);
    }
    
    return bedtime;
  };

  const currentFrequency = binauralFrequencies.find(f => 
    f.value === (schedule?.binauralFrequency || editForm.binauralFrequency)
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Moon className="mr-2 h-5 w-5 text-purple-600" />
          Sleep Schedule & Brain Stimulation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {schedule && !isEditing ? (
          <div className="space-y-4">
            {/* Schedule Overview */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-purple-900">Your Sleep Schedule</h3>
                <Badge variant={schedule.isActive ? "default" : "secondary"}>
                  {schedule.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Clock className="inline h-4 w-4 mr-1 text-purple-600" />
                  Bedtime: {schedule.bedtime}
                </div>
                <div>
                  <Clock className="inline h-4 w-4 mr-1 text-purple-600" />
                  Duration: {Math.floor(schedule.duration / 60)}h {schedule.duration % 60}m
                </div>
              </div>
              {getNextSleepTime() && (
                <p className="text-sm text-purple-700 mt-2">
                  Next session: {getNextSleepTime()?.toLocaleString()}
                </p>
              )}
            </div>

            {/* Music & Binaural Settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <Music className="mr-2 h-4 w-4" />
                  Music Settings
                </h4>
                <div className="text-sm space-y-1">
                  <div>Type: {musicTypes.find(m => m.value === schedule.musicType)?.label}</div>
                  <div>Volume: {schedule.volume}%</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <Brain className="mr-2 h-4 w-4" />
                  Brain Stimulation
                </h4>
                <div className="text-sm space-y-1">
                  <div>Frequency: {currentFrequency?.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {currentFrequency?.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Test Audio</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  className="flex items-center"
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? 'Stop' : 'Play'} Binaural Beats
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={[currentVolume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm w-12">{currentVolume}%</span>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                Use headphones for best binaural beat experience
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Schedule
              </Button>
              {!schedule.isActive && (
                <Button onClick={handleActivate}>
                  Activate Schedule
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Edit Form */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="bedtime">Bedtime</Label>
                <input
                  id="bedtime"
                  type="time"
                  value={editForm.bedtime}
                  onChange={(e) => setEditForm({...editForm, bedtime: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Slider
                  value={[editForm.duration / 60]}
                  onValueChange={(value) => setEditForm({...editForm, duration: value[0] * 60})}
                  min={1}
                  max={12}
                  step={0.5}
                  className="mt-2"
                />
                <span className="text-sm text-muted-foreground">
                  {Math.floor(editForm.duration / 60)}h {editForm.duration % 60}m
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Music Type</Label>
              <Select value={editForm.musicType} onValueChange={(value) => setEditForm({...editForm, musicType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select music type" />
                </SelectTrigger>
                <SelectContent>
                  {musicTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Binaural Beat Frequency</Label>
              <Select 
                value={editForm.binauralFrequency.toString()} 
                onValueChange={(value) => setEditForm({...editForm, binauralFrequency: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {binauralFrequencies.map(freq => (
                    <SelectItem key={freq.value} value={freq.value.toString()}>
                      <div>
                        <div className="font-medium">{freq.label}</div>
                        <div className="text-xs text-muted-foreground">{freq.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Volume</Label>
              <Slider
                value={[editForm.volume]}
                onValueChange={(value) => setEditForm({...editForm, volume: value[0]})}
                max={100}
                step={1}
              />
              <span className="text-sm text-muted-foreground">{editForm.volume}%</span>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave}>
                Save Schedule
              </Button>
              {schedule && (
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}