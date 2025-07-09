import { http, HttpResponse } from 'msw';
import { mockTranscriptSections } from './transcriptData';

export const handlers = [
  // 處理影片上傳與轉錄
  http.post('/api/video/process', async () => {
    // 模擬處理影片並回傳轉錄結果
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 模擬 2 秒的處理時間

    // 生成完整的文字稿
    const fullTranscript = mockTranscriptSections
      .flatMap((section) => section.items.map((item) => item.text))
      .join('\n');

    // 生成重點摘要
    const highlights = mockTranscriptSections.flatMap((section) =>
      section.items
        .filter((item) => item.isHighlight)
        .map((item) => ({
          time: item.time,
          text: item.text,
          sectionId: section.id,
        }))
    );

    return HttpResponse.json(
      {
        success: true,
        data: {
          videoUrl: '../../cypress/fixtures/test.mp4', // TODO: replace with actual video URL
          fullTranscript,
          sections: mockTranscriptSections,
          highlights,
        },
      },
      {
        status: 200,
      }
    );
  }),
];
