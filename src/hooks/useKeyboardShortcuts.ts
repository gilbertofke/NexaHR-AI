import { useEffect } from 'react';
import { useUIStore } from '../store/ui';

interface UseKeyboardShortcutsProps {
  audioRef?: React.RefObject<HTMLAudioElement | HTMLVideoElement>;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export const useKeyboardShortcuts = ({ audioRef, searchInputRef }: UseKeyboardShortcutsProps) => {
  const { isPlaying, setIsPlaying, setSearchTerm, setSelectedText } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (event.key === 'Escape') {
          target.blur();
        }
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          if (audioRef?.current) {
            if (isPlaying) {
              audioRef.current.pause();
            } else {
              audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (audioRef?.current) {
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (audioRef?.current) {
            audioRef.current.currentTime = audioRef.current.currentTime + 5;
          }
          break;

        case '/':
          event.preventDefault();
          searchInputRef?.current?.focus();
          break;

        case 'Escape':
          setSearchTerm('');
          setSelectedText('');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [audioRef, searchInputRef, isPlaying, setIsPlaying, setSearchTerm, setSelectedText]);
};