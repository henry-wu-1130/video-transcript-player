import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/video/process', async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('video') as File

    // 模擬處理影片並回傳轉錄結果
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模擬 2 秒的處理時間

    return HttpResponse.json({
      success: true,
      data: {
        videoUrl: URL.createObjectURL(file),
        fullTranscript: '大家好，歡迎收看這個影片。今天我們要討論一個重要的主題...',
        sections: [
          {
            id: 'section-1',
            title: '開場介紹',
            summary: '影片開場及主題介紹',
            items: [
              { time: 0, text: '大家好，歡迎收看這個影片。', isHighlight: true },
              { time: 5, text: '今天我們要討論一個重要的主題。', isHighlight: false }
            ]
          },
          {
            id: 'section-2',
            title: '核心概念',
            summary: '說明基本概念及其重要性',
            items: [
              { time: 10, text: '首先，讓我們了解基本概念。', isHighlight: false },
              { time: 15, text: '這個概念非常重要。', isHighlight: true },
              { time: 20, text: '接下來是實際的應用示例。', isHighlight: false }
            ]
          }
        ],
        highlights: [
          { time: 0, text: '大家好，歡迎收看這個影片。', sectionId: 'section-1' },
          { time: 15, text: '這個概念非常重要。', sectionId: 'section-2' }
        ]
      }
    })
  })
]
