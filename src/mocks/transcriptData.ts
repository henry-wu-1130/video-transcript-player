import type { TranscriptSection } from '../stores/videoStore';

export const mockTranscriptSections: TranscriptSection[] = [
  {
    id: 'intro',
    title: '介紹',
    summary: '影片開場介紹',
    items: [
      { time: 0, text: '大家好，歡迎來到這個影片', isHighlight: false },
      { time: 5, text: '今天我們要討論一個重要的主題', isHighlight: true },
      {
        time: 10,
        text: '這個主題與我們的日常生活息息相關',
        isHighlight: false,
      },
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
    ],
  },
];
