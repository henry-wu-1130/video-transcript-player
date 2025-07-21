import { mockTranscriptSections } from '../mocks/transcriptData';
import type { VideoProcessResponse } from './apis';

/**
 * 生成模擬的影片處理回應，與 MSW handler 保持一致
 */
export const generateMockVideoResponse = (): VideoProcessResponse => {
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

  return {
    success: true,
    data: {
      videoUrl:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      fullTranscript,
      sections: mockTranscriptSections,
      highlights,
    },
  };
};
