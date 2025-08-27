export type TranscriptItem = {
  start: number;
  end: number;
  text: string;
};

export type Analysis = {
  summary?: string;
  sentiment?: string;
  keywords?: string[];
  questions?: { question: string; answer: string }[];
  hrMetrics?: {
    overallScore: number; // 1-10
    communicationSkills: number; // 1-10
    technicalCompetency: number; // 1-10
    problemSolving: number; // 1-10
    culturalFit: number; // 1-10
    experience: number; // 1-10
  };
  redFlags?: string[];
  strengths?: string[];
  recommendations?: string;
  interviewQuality?: 'excellent' | 'good' | 'fair' | 'poor';
};

export type Interview = {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  file_path?: string;
  upload_date: string; // ISO
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  transcript?: TranscriptItem[];
  analysis?: Analysis;
  created_at?: string;
  updated_at?: string;
};

export type Tag = {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  label: string;
  color?: string;
};

export type UploadProgress = {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
};