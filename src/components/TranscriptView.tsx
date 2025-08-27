import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { TranscriptItem } from '../types/interview';
import { useUIStore } from '../store/ui';

interface TranscriptViewProps {
  transcript: TranscriptItem[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export const TranscriptView = ({ transcript, currentTime, onSeek }: TranscriptViewProps) => {
  const { searchTerm, selectedText, setSelectedText, setSelectedTimeRange, tags, addTag } = useUIStore();
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [tagLabel, setTagLabel] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active transcript item
  useEffect(() => {
    if (activeItemRef.current && scrollAreaRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime]);

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-nexa-orange/30 text-nexa-orange font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      setSelectedText(selectedText);
      
      // Find the time range for the selected text
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer.parentElement;
      const transcriptItem = container?.closest('[data-transcript-item]');
      
      if (transcriptItem) {
        const start = parseFloat(transcriptItem.getAttribute('data-start') || '0');
        const end = parseFloat(transcriptItem.getAttribute('data-end') || '0');
        setSelectedTimeRange({ start, end });
        setShowTagDialog(true);
      }
    }
  };

  const handleAddTag = () => {
    if (selectedText && tagLabel) {
      const timeRange = useUIStore.getState().selectedTimeRange;
      if (timeRange) {
        addTag({
          text: selectedText,
          startTime: timeRange.start,
          endTime: timeRange.end,
          label: tagLabel,
          color: '#ff6348',
        });
        
        setSelectedText('');
        setTagLabel('');
        setShowTagDialog(false);
        setSelectedTimeRange(null);
        window.getSelection()?.removeAllRanges();
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Transcript</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {transcript.length} segments
            </span>
            {tags.length > 0 && (
              <Badge variant="outline" className="text-nexa-purple">
                {tags.length} tags
              </Badge>
            )}
          </div>
        </div>
        {searchTerm && (
          <div className="mt-2">
            <Badge variant="secondary">
              Searching: "{searchTerm}"
            </Badge>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {transcript.map((item, index) => {
            const isActive = currentTime >= item.start && currentTime <= item.end;
            const hasSearchMatch = searchTerm && 
              item.text.toLowerCase().includes(searchTerm.toLowerCase());

            return (
              <div
                key={index}
                ref={isActive ? activeItemRef : undefined}
                data-transcript-item
                data-start={item.start}
                data-end={item.end}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-accent/10 border border-primary/30 shadow-md' 
                    : 'bg-card hover:bg-muted/50'
                  }
                  ${hasSearchMatch ? 'ring-2 ring-nexa-orange/50' : ''}
                `}
                onClick={() => onSeek(item.start)}
                onMouseUp={handleTextSelection}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    {Math.floor(item.start / 60)}:
                    {(item.start % 60).toFixed(1).padStart(4, '0')} - {Math.floor(item.end / 60)}:
                    {(item.end % 60).toFixed(1).padStart(4, '0')}
                  </span>
                  {isActive && (
                    <Badge className="bg-gradient-brand text-white">
                      Playing
                    </Badge>
                  )}
                </div>
                
                <p className={`text-sm leading-relaxed ${isActive ? 'font-medium' : ''}`}>
                  {highlightSearchTerm(item.text, searchTerm)}
                </p>

                {/* Show tags for this segment */}
                {tags.filter(tag => 
                  tag.startTime >= item.start && tag.endTime <= item.end
                ).map(tag => (
                  <Badge 
                    key={tag.id} 
                    variant="outline" 
                    className="mt-2 mr-2 text-nexa-purple bg-nexa-purple/10"
                  >
                    {tag.label}: {tag.text.substring(0, 30)}...
                  </Badge>
                ))}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Tag Creation Dialog */}
      {showTagDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg border shadow-lg max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold mb-4">Add Tag</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Selected Text:</label>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded mt-1">
                  "{selectedText}"
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tag Label:</label>
                <input
                  type="text"
                  value={tagLabel}
                  onChange={(e) => setTagLabel(e.target.value)}
                  placeholder="e.g., Important Point, Question, Concern"
                  className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md"
                  autoFocus
                />
              </div>
              
              <div className="flex space-x-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowTagDialog(false);
                    setSelectedText('');
                    setTagLabel('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddTag}
                  disabled={!tagLabel.trim()}
                  variant="brand"
                >
                  Add Tag
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};