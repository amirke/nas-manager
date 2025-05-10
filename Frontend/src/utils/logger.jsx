// logger.jsx
// ✅ Global logging utility for the entire app

let logHandler = null; // Internal reference to setLogs() from App.jsx

/**
 * Sets the log handler function (should be called once in App.jsx).
 * This links PrintAmirLog to the component's state.
 * @param {(fn: Function) => void} handlerFn - Function to update the logs state
 */
export function _setLogHandler(handlerFn) {
  logHandler = handlerFn;
}

/**
 * Global logger function.
 * Call this from anywhere to append a log to the main log window.
 * Automatically adds a timestamp and formats non-strings.
 *
 * @param {string} tag - Category label (e.g. "SOCKET", "UI", "DATA")
 * @param {any} data - Message or object to log
 */
export function PrintAmirLog(tag, data) {
  const now = new Date();
  const time = now.toLocaleTimeString('en-GB'); // Format as HH:MM:SS

  // Format log: 🕒 15:33:22 [SOCKET] Connected
  const formatted = `🕒 ${time} [${tag}] ${
    typeof data === 'string' ? data : JSON.stringify(data)
  }`;

  if (logHandler) {
    logHandler(prev => [...prev, formatted]); // ✅ Append to log state
  } else {
    console.warn('⚠️ PrintAmirLog called too early:', formatted);
  }
}
