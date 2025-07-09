import { http } from './http';
import { type AxiosResponse } from 'axios';

export interface VideoProcessResponse {
  success: boolean;
  data: {
    videoUrl: string;
    fullTranscript: string;
    sections: Array<{
      id: string;
      title: string;
      summary: string;
      items: Array<{
        time: number;
        text: string;
        isHighlight: boolean;
      }>;
    }>;
    highlights: Array<{
      time: number;
      text: string;
      sectionId: string;
    }>;
  };
}

export const processVideo = async (
  file: File
): Promise<AxiosResponse<VideoProcessResponse>> => {
  const formData = new FormData();
  formData.append('video', file);
  return http.post<VideoProcessResponse>('/api/video/process', formData);
};
