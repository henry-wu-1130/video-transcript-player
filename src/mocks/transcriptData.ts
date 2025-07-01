import type { TranscriptSection } from '../stores/videoStore';

export const mockTranscriptSections: TranscriptSection[] = [
  {
    id: 'intro',
    title: '介紹',
    summary: '影片開場介紹',
    items: [
      { time: 0, text: '大家好，歡迎來到這個影片', isHighlight: false },
      { time: 5, text: '今天我們要討論一個重要的主題', isHighlight: true },
      { time: 10, text: '這個主題與我們的日常生活息息相關', isHighlight: false },
    ],
  },
  {
    id: 'part1',
    title: '第一部分：基礎概念',
    summary: '介紹基本概念和實例說明',
    items: [
      { time: 15, text: '首先，讓我們了解一些基本概念', isHighlight: false },
      { time: 20, text: '這些概念是理解整個主題的關鍵', isHighlight: true },
      { time: 25, text: '我們會用實際例子來說明', isHighlight: false },
      { time: 30, text: '這樣可以幫助大家更容易理解', isHighlight: true },
    ],
  },
  {
    id: 'part2',
    title: '第二部分：進階應用',
    summary: '討論進階應用和實際案例',
    items: [
      { time: 35, text: '接下來我們來看看進階的應用', isHighlight: false },
      { time: 40, text: '這些應用在實際工作中非常有用', isHighlight: true },
      { time: 45, text: '我們會討論幾個常見的案例', isHighlight: false },
      { time: 50, text: '這些案例都來自真實的工作經驗', isHighlight: true },
    ],
  },
  {
    id: 'part3',
    title: '第三部分：實務技巧',
    summary: '分享實用技巧和工作效率提升方法',
    items: [
      { time: 55, text: '現在讓我們深入討論一些實務技巧', isHighlight: false },
      { time: 60, text: '這些技巧可以幫助提升工作效率', isHighlight: true },
      { time: 65, text: '我們會分享一些實用的小撇步', isHighlight: false },
      { time: 70, text: '這些都是經過實踐證明有效的方法', isHighlight: true },
    ],
  },
  {
    id: 'part4',
    title: '第四部分：常見問題',
    summary: '解答常見問題和解決方案',
    items: [
      { time: 75, text: '接下來我們來討論一些常見的問題', isHighlight: false },
      { time: 80, text: '這些問題在工作中經常遇到', isHighlight: true },
      { time: 85, text: '我們會提供解決這些問題的方法', isHighlight: false },
      { time: 90, text: '這些解決方案都是經過驗證的', isHighlight: true },
    ],
  },
  {
    id: 'part5',
    title: '第五部分：最佳實踐',
    summary: '分享最佳實踐和成功案例',
    items: [
      { time: 95, text: '讓我們來看看一些最佳實踐', isHighlight: false },
      { time: 100, text: '這些實踐可以幫助避免常見錯誤', isHighlight: true },
      { time: 105, text: '我們會分享一些成功的案例', isHighlight: false },
      { time: 110, text: '這些案例都有很好的參考價值', isHighlight: true },
    ],
  },
  {
    id: 'conclusion',
    title: '總結',
    summary: '總結重點並結束影片',
    items: [
      { time: 115, text: '今天我們討論了很多重要的內容', isHighlight: false },
      { time: 120, text: '希望這些內容對大家有幫助', isHighlight: true },
      { time: 125, text: '如果有任何問題，歡迎在下方留言', isHighlight: false },
      { time: 130, text: '謝謝大家的觀看，下次再見！', isHighlight: true },
    ],
  },
];
