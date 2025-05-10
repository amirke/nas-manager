// Import React hooks for component state and side effects
import { useRef, useEffect, useState } from 'react';

import { _setLogHandler } from './utils/logger';
import { PrintAmirLog } from './utils/logger';



// Import the TopBar component which shows the tab buttons
//import TopBar from './components/TopBar';

// Import TailwindCSS styles and any other global styles
import './index.css';
import { io } from 'socket.io-client';

function App() {

  // State variable: keeps a log of actions/events in the app.
  // Initialized with a starting message
  const [logs, setLogs] = useState([
    'App started',
  ]);
  

// Scroll-to-Bottom Logic in App.jsx (React Hook with comments)
//-------------------------------------------------------------
  // Create a reference to the scroll container (bind to log div)
  const logRef = useRef(null);
  
  // Tracks whether the log is scrolled fully to the bottom
  const [showScrollButton, setShowScrollButton] = useState(false);

  
  // React effect that runs every time logs are updated
  useEffect(() => {
    // Wait briefly for the DOM to update before scrolling
    const timeout = setTimeout(() => {
      if (logRef.current) {
        // Scroll to the very bottom of the scrollable log area
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 10); // Delay ensures rendering finishes
  
    // Cleanup timeout if component unmounts quickly
    return () => clearTimeout(timeout);
  }, [logs]); // This effect runs every time the logs array changes
  
  
  
    // Effect: detects if user has scrolled up (and shows scroll button)
  useEffect(() => {
    const container = logRef.current;
    if (!container) return;
  
    const handleScroll = () => {
      const atBottom =
        Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 4;
      setShowScrollButton(!atBottom); // Show button if not at bottom
    };
  
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  

//-------------------------------------------------------------


// after defining setLogs, register the handler
// Now, any file that imports PrintAmirLog(...) will route to your main log list!

  useEffect(() => {
    // Register the global log function to append logs
	_setLogHandler(setLogs);
/*
    _setLogHandler((msg) => {
      setLogs(prev => [...prev, msg]); // you can also cap it with .slice(-499) if desired
  });
  */
  }, []);

//       In any component or script we can write:       
//       ----------------------------------------       
//       import { PrintAmirLog } from './utils/logger';
//       
//       Example:
//       PrintAmirLog('socket', 'Connected to backend');
//       PrintAmirLog('data', { user: 'amir', status: 'ok' });
//
//       You’ll see in the log window:  
//       ----------------------------
//       [socket] Connected to backend
//       [data] {"user":"amir","status":"ok"}
//-------------------------------------------------------------


 

  // ✅ Socket.IO side-effect:
  // - Runs once on mount (empty dependency array [])
  // - Connects to backend at specified LAN IP and port
  // - Receives logs from backend and appends to UI
  useEffect(() => {
    // Initialize socket connection
    // io() comes from socket.io-client and opens a WebSocket to the backend
    // Replace with your actual NAS/PC LAN IP and port
    const socket = io('http://192.168.1.17:3001', {
  //    transports: ['websocket'], // optional: force websocket only
      transports: ['polling'], // force polling for debug

    });
    // ✅ Called once when connected successfully to socket server
    socket.on('connect', () => {
      console.log('✅ Connected');
	  PrintAmirLog('SOCKET', '✅ Connected to socket server');
    });

    // ✅ Called every time the backend emits a 'log' message
    socket.on('log', (msg) => {
      // Limit log window to last 10 lines
	  PrintAmirLog('SOCKET', msg);
    });

    // ❗ Catch any connection errors (e.g., wrong IP, firewall block)
    // `err.message` gives the cause (e.g. ECONNREFUSED)
    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection failed:', err.message);
    //  setLogs(prev => [...prev, '❌ Socket error: ' + err.message]);
	  PrintAmirLog('SOCKET', '❌ Socket error: ' + err.message);

    });

    // Cleanup: disconnect socket on component unmount
    return () => socket.disconnect();
  }, []); // Empty dependency array = run once on component mount


  // State variable: keeps track of the currently selected tab.
  // It reads from localStorage if available, otherwise defaults to 'tab1'.
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'tab1');

  // Side effect: Runs every time the active tab changes.
  // It stores the active tab in localStorage and logs the tab switch.
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab); // persist selected tab
    // setLogs(logs => [...logs, `Switched to ${activeTab.toUpperCase()}`]); // append log
	PrintAmirLog('UI', `Switched to ${activeTab.toUpperCase()}`);
	
    // Trigger test logs by tab
    switch (activeTab) {
      case 'tab1':
        PrintAmirLog('TAB', 'MAN');
        break;
      case 'tab2':
        PrintAmirLog('TAB', 'YOYO');
        break;
      case 'tab3':
        PrintAmirLog('TAB', 'SSIT DOWN');
        break;
      default:
        break;
    }
  }, [activeTab]);

  // Function: returns content to display for the currently active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'tab1':
        return <div className="p-4 text-lg">📄 Placeholder for Tab 1</div>;
      case 'tab2':
        return <div className="p-4 text-lg">📁 Placeholder for Tab 2</div>;
      case 'tab3':
        return <div className="p-4 text-lg">🛠️ Placeholder for Tab 3</div>;
      default:
        return null; // fallback if no tab matches
    }
  };
  
  
  
  
  
  
  
  
  
  
  
  

  // JSX to render the application UI
  return (
    // Main wrapper: sets the full-screen layout and background color
    <div className="min-h-screen bg-gray-100">
	  
      {/* Page header/title */}
      <h1 className="text-xl font-semibold text-center py-4 text-gray-800">📡 NAS Manager</h1>


      {/* Optional: Use dropdown instead of TopBar for mobile simplicity */}
      <select
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value)}
        className="mx-auto my-4 block w-4/5 p-2 border rounded"
      >
        <option value="tab1">Tab 1</option>
        <option value="tab2">Tab 2</option>
        <option value="tab3">Tab 3</option>
      </select>

      {/* Display the content of the selected tab */}
      {renderTabContent()}

      {/* Display socket server IP for clarity (debug info) */}
      <div className="text-xs text-gray-500 text-center mb-2">
        Listening to logs from: <code>192.168.1.17:3001</code>
      </div>
	  
	  
	  
	  
	  
	  
	  
      {/* Log window section – shows under the tab content */}
	  
      {/* 
          Outer wrapper for the log window section
          - px-4: padding-left and padding-right = 1rem each (for spacing inside parent)
          - py-2: padding-top and bottom = 0.5rem each
			1rem	= 16px (standard CSS root font size unit)
			lineHeight: '1.5rem'	Each line is exactly 24px tall → consistent spacing
			height: '15rem'	15 × 16px = 240px total → shows exactly 10 lines (240px ÷ 24px)
			overflow-y-scroll	Forces vertical scrollbar, even if not needed yet
			border	Ensures the border is rendered
			border-gray-500	Medium-dark visible gray border
			bg-gray-50	Slight background contrast
			rounded-md	Gives the log box a framed feel
			shadow-md	Subtle shadow around the box
			overflow-y-auto	Enables scroll when logs grow        
	  */}
      <div className="px-4 py-2">
        {/*
          Outer wrapper:
          - px-4: horizontal padding of 1rem
          - py-2: vertical padding of 0.5rem
          Provides spacing around the log box
        */}
      
        <div
          style={{
            height: '240px',                 // Total box height (10 lines × 24px)
            fontFamily: 'monospace',         // Use fixed-width font for logs
            fontSize: '14px',                // Small readable font size
            border: '1px solid #888',        // Visible medium-gray border frame
            borderRadius: '8px',             // Rounded corners for clean style
            backgroundColor: '#f9f9f9',      // Light gray background
            boxShadow: '0 0 4px rgba(0,0,0,0.15)', // Soft outer shadow for contrast
            display: 'flex',                 // Enables layout of header + scrollable log
            flexDirection: 'column',         // Arrange header on top, log below
          }}
        >
      
          <div
            style={{
              padding: '8px 12px',           // Internal spacing: top/bottom = 8px, sides = 12px
              fontWeight: 600,               // Semi-bold title
              color: '#333',                 // Dark gray text color
              borderBottom: '1px solid #ccc',// Line under header for separation
              flexShrink: 0,                 // Prevents this header from collapsing or scrolling
            }}
          >
            📝 Log Window:
          </div>
      
          <div
            ref={logRef}
            style={{
              overflowY: 'auto',             // Enables vertical scroll inside this container
              padding: '8px 12px',           // Same spacing as header for visual alignment
              flex: '1 1 auto',              // Fills the remaining vertical space in the container
              lineHeight: '24px',            // Sets each log line height to 24px
              minHeight: 0,                  // Ensures scroll area doesn't collapse on flex bugs
            }}
          >
            {logs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  whiteSpace: 'pre-wrap',    // Allows logs with line breaks or indent to display properly
                  color: '#444',             // Medium-dark text for better contrast
                }}
              >
                • {log}
              </div>
            ))}
          </div>
        </div>
      </div>
           
 





    </div>
  );
}

// Export the App component as default so it can be used in main.jsx
export default App;
