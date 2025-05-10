# NAS Manager

A lightweight React + Node.js based interface for managing logs and socket-based communication over your local NAS network.

## 🔧 Features

- 🧠 Smart log viewer with timestamps and auto-scrolling
- 🔌 Real-time logs via Socket.IO (WebSocket or polling fallback)
- 📱 Mobile-friendly UI with dropdown tab navigation
- 💬 Custom global logging via `PrintAmirLog(tag, message)`
- 🟢 Backend + frontend setup in a clean project structure
- ⚙️ React + TailwindCSS + Vite frontend
- ⚙️ Express + Socket.IO backend

## 📁 Folder Structure

```
my-nas-manager/
├── Backend/
│   └── server.js             # Node.js backend using Socket.IO
├── Frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React app with log UI
│   │   └── utils/logger.jsx  # Global logging function
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
```

## 🚀 Installation

```bash
git clone https://github.com/amirke/nas-manager.git
cd nas-manager
cd Frontend
npm install
npm run dev -- --host
```

Then in another terminal:

```bash
cd Backend
node server.js
```

Access the UI at:  
📱 `http://<your-nas-ip>:5173`

## ✍️ Logging Anywhere

Import and use:

```js
import { PrintAmirLog } from './utils/logger';
PrintAmirLog('SOCKET', 'Connected');
```

## 📝 License

MIT
