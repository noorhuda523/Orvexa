import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LuSparkles,
  LuX,
  LuSend,
  LuTrash2,
  LuCopy,
  LuCheck,
  LuArrowRight,
  LuBot,
  LuWorkflow,
  LuListTodo,
  LuTrendingUp,
} from 'react-icons/lu';
import {
  readCopilotMessages,
  saveCopilotMessages,
  clearCopilotMessages,
  sendCopilotQuery,
  QUICK_PROMPTS,
} from '../../services/ai/copilotService';
import { readTasks, readWf } from '../../utils/storage';

export default function AICopilotModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const tasks = readTasks();
  const workflows = readWf();

  useEffect(() => {
    if (isOpen) {
      setMessages(readCopilotMessages());
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Keyboard shortcut Esc to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (queryText = inputVal) => {
    const text = queryText.trim();
    if (!text || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const next = [...messages, userMsg];
    setMessages(next);
    saveCopilotMessages(next);
    setInputVal('');
    setLoading(true);

    try {
      const aiReply = await sendCopilotQuery(text);
      const updated = [...next, aiReply];
      setMessages(updated);
      saveCopilotMessages(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    const cleared = clearCopilotMessages();
    setMessages(cleared);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(25, 24, 43, 0.35)',
        backdropFilter: 'blur(3px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: '-8px 0 32px rgba(25, 24, 43, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #E9E8F1',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E9E8F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FC 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#EDE7FF',
                color: '#7047EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              <LuSparkles />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#19182B' }}>
                  Orvexa AI Copilot
                </h3>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: '#EDE7FF',
                    color: '#7047EB',
                  }}
                >
                  PROTOTYPE
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#74758A' }}>
                Workspace intelligence & task orchestrator
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={handleClear}
              title="Clear conversation"
              style={{
                background: 'none',
                border: 'none',
                color: '#74758A',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <LuTrash2 size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close Copilot (Esc)"
              style={{
                background: 'none',
                border: 'none',
                color: '#74758A',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <LuX size={18} />
            </button>
          </div>
        </div>

        {/* Live Workspace Context Ribbon */}
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: '#F8F9FC',
            borderBottom: '1px solid #E9E8F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#74758A',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16B890' }} />
            <span>Connected to workspace</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span><strong>{tasks.length}</strong> tasks</span>
            <span>•</span>
            <span><strong>{workflows.length}</strong> workflows</span>
            <span>•</span>
            <span><strong>99.4%</strong> health</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '100%',
                }}
              >
                <div
                  style={{
                    maxWidth: '88%',
                    padding: '12px 14px',
                    borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    backgroundColor: isUser ? '#7047EB' : '#FFFFFF',
                    color: isUser ? '#FFFFFF' : '#19182B',
                    border: isUser ? 'none' : '1px solid #E9E8F1',
                    boxShadow: isUser ? '0 2px 8px rgba(112, 71, 235, 0.25)' : '0 2px 8px rgba(25, 24, 43, 0.04)',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  {/* Markdown formatted content */}
                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {m.content}
                  </div>

                  {/* AI Message Footer Actions */}
                  {!isUser && (
                    <div
                      style={{
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop: '1px solid #F1F0FA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleCopy(m.id, m.content)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#74758A',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          padding: '2px 4px',
                          borderRadius: '4px',
                        }}
                      >
                        {copiedId === m.id ? (
                          <>
                            <LuCheck size={12} color="#16B890" />
                            <span style={{ color: '#16B890' }}>Copied</span>
                          </>
                        ) : (
                          <>
                            <LuCopy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggested Action Chips */}
                {!isUser && m.suggestedActions?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {m.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (act.link) {
                            navigate(act.link);
                            onClose();
                          } else if (act.query) {
                            handleSend(act.query);
                          }
                        }}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '12px',
                          backgroundColor: '#EDE7FF',
                          color: '#7047EB',
                          fontSize: '11px',
                          fontWeight: 500,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>{act.label}</span>
                        {act.link && <LuArrowRight size={10} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#EDE7FF', color: '#7047EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LuSparkles size={12} />
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span className="nx-typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#7047EB' }} />
                <span className="nx-typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8B75F5', animationDelay: '0.2s' }} />
                <span className="nx-typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EDE7FF', animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Drawer */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid #E9E8F1',
            backgroundColor: '#F8F9FC',
            overflowX: 'auto',
            display: 'flex',
            gap: '8px',
          }}
        >
          {QUICK_PROMPTS.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E9E8F1',
                fontSize: '11px',
                color: '#19182B',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid #E9E8F1', backgroundColor: '#FFFFFF' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F8F9FC',
              borderRadius: '10px',
              border: '1px solid #E9E8F1',
              padding: '6px 8px 6px 12px',
            }}
          >
            <input
              type="text"
              placeholder="Ask AI anything about your workspace..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '13px',
                color: '#19182B',
              }}
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || loading}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: inputVal.trim() ? '#7047EB' : '#E9E8F1',
                color: '#FFFFFF',
                border: 'none',
                cursor: inputVal.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <LuSend size={14} />
            </button>
          </form>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: '#74758A' }}>
            <span>Shortcut: <strong>Ctrl+J</strong> to toggle</span>
            <span>Simulated Frontend AI</span>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
