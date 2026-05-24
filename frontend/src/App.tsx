import { useState, useRef, useEffect } from "react";
import "./App.css";

type Message = { role: "ai" | "user"; text: string };

const INITIAL_MESSAGES: Message[] = [
  { role: "ai", text: "Tjena, vad kan jag hjälpa dig med?" },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSize, setChatSize] = useState({ width: 380, height: 480 });
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 380, height: 480 });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Jag förstår! Det här är ett mock-svar — riktig AI kommer snart." },
      ]);
    }, 600);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...chatSize };

    const onMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const dx = moveEvent.clientX - startPos.current.x;
      const dy = moveEvent.clientY - startPos.current.y;
      setChatSize({
        width: Math.max(280, startSize.current.width + dx),
        height: Math.max(320, startSize.current.height + dy),
      });
    };

    const onUp = () => {
      isResizing.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="app">
      <div className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <span className="app-title">DevLog</span>
      </div>

      <div className="body">
        <div className={`overlay ${sidebarOpen ? "visible" : ""}`} onClick={() => setSidebarOpen(false)} />

        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-section">
            <div className="sidebar-label">Add new</div>
            <button className="sidebar-btn">📁 New folder</button>
            <button className="sidebar-btn">📄 New entry</button>
          </div>
          <div className="file-tree">
            <div className="sidebar-label">Projects</div>
            <div className="tree-item folder">📁 Knightec</div>
            <div className="tree-item tree-child">📝 Car sensor pipeline</div>
            <div className="tree-item tree-child">📝 Auth service</div>
          </div>
        </div>

        <div className="main">
          <div
            className="chat-float"
            style={{ width: chatSize.width, height: chatSize.height }}
          >
            <div className="chat-float-header">
              <span>DevLog AI</span>
            </div>

            <div className="chat-area">
              {messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.role}`}>
                  {msg.role === "ai" && <div className="msg-label">DevLog AI</div>}
                  <div className="msg-bubble">{msg.text}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-row">
              <input
                className="chat-input"
                placeholder="Skriv ett meddelande..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button className="send-btn" onClick={sendMessage}>→</button>
            </div>

            <div className="resize-handle" onMouseDown={onResizeStart} />
          </div>
        </div>
      </div>
    </div>
  );
}