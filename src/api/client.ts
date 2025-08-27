import { Interview } from '../types/interview';

const BASE_URL = 'http://localhost:8000/api';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getInterviews(): Promise<Interview[]> {
    try {
      return await this.request<Interview[]>('/interviews');
    } catch {
      console.info('Using mock data for interviews');
      const mockInterviews = await import('../mocks/localInterviews.json');
      return mockInterviews.default as Interview[];
    }
  }

  async getInterview(id: string): Promise<Interview> {
    try {
      return await this.request<Interview>(`/interviews/${id}`);
    } catch {
      console.info(`Using mock data for interview ${id}`);
      const mockInterviews = await import('../mocks/localInterviews.json');
      const mockTranscript = await import('../mocks/sample_transcript.json');
      const mockAnalysis = await import('../mocks/sample_analysis.json');
      
      const interview = mockInterviews.default.find(i => i.id === id);
      if (!interview) {
        throw new Error('Interview not found');
      }

      return {
        ...interview,
        transcript: mockTranscript.default,
        analysis: mockAnalysis.default,
      } as Interview;
    }
  }

  async uploadInterview(file: File): Promise<{ id: string; filename: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BASE_URL}/interviews/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.info('Using mock upload response');
      // Simulate upload with mock data
      return {
        id: `mock-${Date.now()}`,
        filename: file.name,
      };
    }
  }

  async transcribeInterview(id: string): Promise<{ status: string }> {
    try {
      return await this.request<{ status: string }>(`/interviews/${id}/transcribe`, {
        method: 'POST',
      });
    } catch {
      console.info(`Mock transcription started for interview ${id}`);
      return { status: 'processing' };
    }
  }
}

export const apiClient = new ApiClient();