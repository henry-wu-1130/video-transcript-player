import { http } from './http';
import { type AxiosResponse } from 'axios';
import { generateMockVideoResponse } from './mockResponse';

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
  // 在 production 模式下使用模擬數據而不是實際 API 調用
  if (import.meta.env.PROD) {
    // 模擬處理時間
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // 返回模擬響應
    const mockResponse = generateMockVideoResponse();
    return {
      data: mockResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {}
      }
    } as AxiosResponse<VideoProcessResponse>;
  }
  
  // 開發模式下使用 MSW 模擬 API
  const formData = new FormData();
  formData.append('video', file);
  return http.post<VideoProcessResponse>('/api/video/process', formData);
};
