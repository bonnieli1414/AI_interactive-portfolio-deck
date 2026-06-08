# 🚀 AI Interactive Portfolio Deck (互動式自我介紹網頁簡報)

這是一個專為**軟體工程師 / 開發者**設計的現代化、互動式自我介紹簡報網頁。它不僅擁有高質感的視覺設計與動態效果，更整合了即時內容編輯器，並支援一鍵匯出為標準 PowerPoint (.pptx) 或 PDF 簡報。

![3D Developer Avatar](20260608_anti/engineer_avatar.png)

---

## ✨ 核心特色 (Key Features)

### 🎨 1. 四款現代感主題 (Four Elegant Themes)
點擊控制列的 **調色盤 🎨** 按鈕即可即時切換主題，動態 Canvas 粒子背景會隨主題自動調整連線色彩與運動速度：
*   **未來科技霓虹 (Cyberpunk Neon)**：深色背景搭配霓虹藍、粉紅漸層與密集的數據粒子網格。
*   **極簡暗黑 (Minimalist Dark)**：霧面黑色系，以純粹的灰白與亮橘色點綴，打造沉穩專業感。
*   **溫雅大地 (Warm Terra)**：溫暖的米色底，搭配森林綠、黏土橘色，展現親切優雅的氛圍。
*   **經典皇家藍 (Royal Professional)**：乾淨的白底配上皇家藍與金色邊框，適合正式商務報告。

### ⚙️ 2. 即時內容自訂編輯器 (Live Content Editor)
點擊左上角的 **齒輪 ⚙️** 按鈕可展開自訂編輯面板：
*   可以直接修改姓名、職稱、自我介紹、技術清單、學經歷描述以及代表專案。
*   技能進度條支援 Slider 拖曳調整。
*   所有修改皆會即時同步渲染至簡報上，並自動保存於瀏覽器的 `localStorage`，重新整理也不會遺失。
*   提供「重設為預設」與「匯出 JSON 設定檔」的備份功能。

### 📊 3. 一鍵匯出 PowerPoint (.pptx) 簡報
內建 client-side 的 `PptxGenJS` 套件：
*   點擊控制列的 **PowerPoint 標誌 (P) 按鈕**，即可在瀏覽器端直接動態產生 16:9 比例的 PPTX 簡報檔並自動下載。
*   PPTX 中的字型、背景色、卡片、邊框及進度條會**完美對齊您當前在網頁上選取的主題配色**，且導出後檔案的文字與圖形均支援在 Microsoft PowerPoint / Keynote 中二次修改！

### 🖨️ 4. 完美 PDF 輸出支援 (Print to PDF)
特別優化了 `@media print` 列印樣式：
*   按下 `Ctrl + P` 或點擊 **PDF 圖示**，網頁會自動隱藏側邊欄、粒子背景與控制列，並將 6 張投影片完美對齊排版，方便您直接「列印儲存成 PDF」簡報檔。

### 🕹️ 5. 專業簡報控制 (Presenter Mode)
*   **翻頁操作**：支援鍵盤方向鍵 (`◄` / `►` / `▲` / `▼`)、`Space` 空白鍵、`PageUp` / `PageDown`，以及手機螢幕手勢左右滑動。
*   **播放模式**：內建自動播放功能（每 5 秒自動切換）。
*   **全螢幕簡報**：按 `F` 鍵或全螢幕按鈕，可直接進入滿版簡報播放模式。

---

## 📁 檔案結構 (Directory Structure)

```bash
Antigravity/
├── README.md               # 專案說明文件 (此檔案)
└── 20260608_anti/          # 簡報專案原始碼資料夾
    ├── index.html          # 簡報網頁結構與自訂側邊欄
    ├── style.css           # 樣式定義、主題切換及動畫
    ├── app.js              # 翻頁邏輯、資料同步及 PPTX 生成引擎
    ├── pptxgen.bundle.js   # 本地 PowerPoint 匯出核心套件
    └── engineer_avatar.png # AI 生成的開發者 3D 風格頭像
```

---

## 🛠️ 開發技術棧 (Technologies Used)

*   **Core**：HTML5, JavaScript (ES6+), Vanilla CSS3 (CSS Variables, Flexbox, CSS Grid)
*   **Libraries**：
    *   [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) (本地封裝版) - 用於生成 PowerPoint 簡報
    *   [Font Awesome](https://fontawesome.com/) - 精美圖示集
    *   [Google Fonts](https://fonts.google.com/) - 載入 Inter & Noto Sans TC 等字型

---

## 🚀 如何在本地運行？ (Local Setup)

本專案完全為純前端靜態頁面，無須安裝複雜的依賴：

### 方法一：直接點擊開啟
進入 `20260608_anti/` 資料夾，直接按兩下點擊 `index.html` 即可在瀏覽器中開啟簡報。

### 方法二：透過 HTTP 伺服器開啟 (推薦)
為了確保所有 AJAX 載入（如圖片）及本地儲存功能在最穩定的環境下運行，推薦使用輕量伺服器開啟：
```bash
# 前往專案目錄
cd 20260608_anti

# 使用 npm 啟動輕量伺服器
npx http-server -p 8080
```
開啟瀏覽器前往 [http://localhost:8080](http://localhost:8080) 即可開始使用！
