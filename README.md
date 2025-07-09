# Video Transcript Player 影片字幕播放器

[![Coverage](https://coveralls.io/repos/github/wuhenli/video-transcript-player/badge.svg?branch=main)](https://coveralls.io/github/wuhenli/video-transcript-player?branch=main)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1.11-38bdf8.svg)](https://tailwindcss.com/)
[![Testing](https://img.shields.io/badge/Testing-Vitest%20%7C%20Cypress-04C38E.svg)](https://vitest.dev/)
[![State Management](https://img.shields.io/badge/State-Zustand-brown.svg)](https://zustand-demo.pmnd.rs/)

<img src="./public/screenshot.png" alt="Video Transcript Player">

## 🎯 專案概述

Video Transcript Player 是一個現代化的影片播放應用程式，專注於提供優質的影片播放體驗和字幕同步功能。本專案展示了我在前端開發領域的技術能力和最佳實踐的應用。

### 🌟 主要特色

- **影片播放控制**：支援基本播放控制、進度條拖曳
- **字幕同步顯示**：即時同步顯示字幕、支援字幕區塊自動捲動，字幕區塊可自由拖曳
- **響應式設計**：完美支援各種螢幕尺寸，提供最佳使用體驗

## 技術棧

### 技術架構

- React 18
- TypeScript
- Tailwind CSS
- Zustand
- Vite
- ESLint & Prettier
- GitHub Actions
- Vitest & Cypress

---

## 技術選型與架構設計說明

- 專案骨幹以 Windsurf 完成，先設置安裝最基礎的程式架構。
- 前端技術選用 React，狀態管理採用輕量化的 zustand。
- 開發環境採用 Vite HMR，樣式以 utility class first 的 Tailwind CSS。
- 以功能為切分，模擬 Scrum 流程，逐步完成每個功能。
- 依據需求急迫性與時限，決定先開發還是先撰寫測試（理想情況下優先撰寫測試），測試區分為整合測試與 Cypress 點對點測試。
- 測試用例設計考慮結合專案管理與團隊測試需求，盡可能將測試規格化，減少團隊溝通成本。
- 特殊邏輯集中於 hooks，API mock 採用 MSW，支援瀏覽器與測試環境。
- CI/CD 流程針對不同分支做不同處理。
- 建議前端成員設置 .vscode 或 .prettierrc 統一程式碼風格，避免不同環境造成設置不一致。
- 若公司產品眾多且設計風格一致，建議可考慮採用 Storybook 作為元件文檔工具。

---

## 專案結構

```
├── src/                          # 源碼目錄
│   ├── components/               # React 元件
│   │   ├── __tests__/           # 元件測試檔案
│   │   │   ├── Header.test.tsx
│   │   │   ├── Layout.test.tsx
│   │   │   ├── Timeline.test.tsx
│   │   │   ├── VideoPlayer.test.tsx
│   │   │   └── ...
│   │   ├── Header.tsx           # 頁面標題元件
│   │   ├── Layout.tsx           # 佈局元件
│   │   ├── Loading.tsx          # 載入中元件
│   │   ├── Timeline.tsx         # 影片時間軸元件
│   │   ├── Toast.tsx            # 通知提示元件
│   │   ├── Transcript.tsx       # 字幕顯示元件
│   │   ├── TranscriptSection.tsx # 字幕區塊元件
│   │   ├── VideoCaption.tsx     # 影片字幕元件
│   │   ├── VideoControls.tsx    # 影片控制元件
│   │   └── VideoPlayer.tsx      # 影片播放器元件
│   ├── containers/               # 容器元件
│   │   ├── __tests__/           # 容器測試檔案
│   │   │   ├── TranscriptContainer.test.tsx
│   │   │   └── VideoPlayerContainer.test.tsx
│   │   ├── TranscriptContainer.tsx  # 字幕容器
│   │   └── VideoPlayerContainer.tsx # 播放器容器
│   ├── stores/                  # 狀態管理
│   │   └── videoStore.ts        # 影片相關狀態
│   ├── services/                # 服務層
│   │   ├── apis.ts              # API 介接
│   │   └── http.ts              # HTTP 請求封裝
│   └── mocks/                   # 模擬資料
│       ├── browser.ts           # 瀏覽器模擬
│       ├── handlers.ts          # 請求處理器
│       └── transcriptData.ts    # 字幕測試資料
├── cypress/                     # E2E 測試
│   ├── e2e/                     # 測試案例
│   ├── fixtures/                # 測試資料
│   └── support/                 # 測試支援
├── public/                      # 靜態資源
├── .github/                     # GitHub 配置
│   └── workflows/               # CI/CD 工作流程
├── package.json                 # 專案配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
├── tailwind.config.js          # Tailwind 配置
└── README.md                   # 專案文檔
```

## 🚀 開始使用

1. **安裝依賴**

   ```bash
   npm install
   ```

2. **開發模式**

   ```bash
   npm run dev
   ```

3. **執行測試**

   ```bash
   # 單元測試
   npm run test

   # E2E 測試
   npm run test:e2e

   # 測試覆蓋率報告
   npm run test:coverage
   ```

4. **建構專案**
   ```bash
   npm run build
   ```
