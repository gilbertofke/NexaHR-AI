import { create } from 'zustand';
import { Tag } from '../types/interview';

interface UIStore {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  
  currentTime: number;
  setCurrentTime: (time: number) => void;
  
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  
  tags: Tag[];
  addTag: (tag: Omit<Tag, 'id'>) => void;
  removeTag: (id: string) => void;
  clearTags: () => void;
  
  selectedText: string;
  setSelectedText: (text: string) => void;
  
  selectedTimeRange: { start: number; end: number } | null;
  setSelectedTimeRange: (range: { start: number; end: number } | null) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: time }),
  
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  tags: [],
  addTag: (tag) => {
    const newTag = {
      ...tag,
      id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    set({ tags: [...get().tags, newTag] });
  },
  removeTag: (id) => set({ tags: get().tags.filter(tag => tag.id !== id) }),
  clearTags: () => set({ tags: [] }),
  
  selectedText: '',
  setSelectedText: (text) => set({ selectedText: text }),
  
  selectedTimeRange: null,
  setSelectedTimeRange: (range) => set({ selectedTimeRange: range }),
}));