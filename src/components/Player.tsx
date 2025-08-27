import { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { useUIStore } from '../store/ui';

interface PlayerProps {
  src?: string;
  fileName: string;
}

export const Player = ({ src, fileName }: PlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const { currentTime, setCurrentTime, isPlaying, setIsPlaying } = useUIStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setCurrentTime, setIsPlaying]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isVideo = fileName.match(/\.(mp4|mov|avi|mkv)$/i);

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-2 bg-gradient-brand rounded-lg">
          {isVideo ? (
            <div className="h-5 w-5 flex items-center justify-center text-white text-xs font-bold">
              MP4
            </div>
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold truncate">{fileName}</h3>
          <p className="text-sm text-muted-foreground">
            {isVideo ? 'Video' : 'Audio'} • {formatTime(duration)}
          </p>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src || "/audio-sample.mp3"} // Fallback to demo file
        preload="metadata"
      />

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSkip(-5)}
            className="h-8 w-8 p-0"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={handlePlayPause}
            className="h-10 w-10 p-0"
            variant="brand"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSkip(5)}
            className="h-8 w-8 p-0"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Shortcuts:</span> Space (play/pause) • ←/→ (seek ±5s) • / (search) • ESC (clear)
        </p>
      </div>
    </div>
  );
};