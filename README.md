# AI 行銷文案生成器 (AI Marketing Copy Generator)

這是一個使用 Google Gemini API 打造的智慧行銷文案生成工具。使用者可以透過簡單的介面設定，快速生成符合需求的社群媒體文案。

## ✨ 功能特色 (Features)

- **多樣化參數設定**:
    - **目標平台**: Instagram, Facebook, Threads, 或自訂。
    - **目標受眾**: 一般大眾、年輕人、學生、上班族等，並支援自訂。
    - **文案長度**: 短、中、長，或自訂字數。
    - **文案語氣**: 專業、有趣、親切等，並支援自訂。
    - **包含關鍵字**: 強制在文案中加入指定字詞。
    - **行動呼籲 (CTA)**: 選擇或自訂文案結尾的行動呼籲。
- **現代化操作介面**:
    - 採用專業的深色主題 (Dark Mode)，提升使用者體驗。
    - 所有設定均支援自訂輸入，提供最大彈性。
- **歷史紀錄**:
    - 自動儲存最近 5 筆生成紀錄於瀏覽器。
    - 可隨時載入或刪除單筆歷史紀錄。
- **一鍵複製**: 方便地複製生成結果。

## 🛠️ 技術棧 (Tech Stack)

- **後端 (Backend)**: Node.js, Express.js
- **前端 (Frontend)**: HTML, CSS, JavaScript (ES6)
- **API**: Google Gemini API
- **核心依賴 (Dependencies)**: `axios`, `cors`, `express`

## 🚀 安裝與啟動 (Setup and Usage)

1.  **複製專案 (Clone Repository)**:
    ```bash
    git clone https://github.com/aibigsmallthing/ai-.git
    cd ai-
    ```

2.  **安裝依賴 (Install Dependencies)**:
    在專案根目錄下執行以下指令來安裝所需的 Node.js 套件。
    ```bash
    npm install
    ```

3.  **啟動後端伺服器 (Run the Server)**:
    ```bash
    node server.js
    ```
    您應該會看到 `Server is running on http://localhost:3001` 的訊息。

4.  **開啟應用程式 (Open the Application)**:
    直接在您的瀏覽器中開啟 `public/index.html` 檔案即可開始使用。

5.  **設定 API Key**:
    在介面的 "Gemini API Key" 欄位中，輸入您自己的 Google Gemini API 金鑰。

---
